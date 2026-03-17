# Community Charity Auction Backend

A robust, real-time backend API built with Java 21, Spring Boot 3, and MySQL for a local community charity auction. This system manages User Accounts (with hierarchical RBAC via Spring Security), Item Management, a highly concurrent Bidding System, and Automated Auction Closures.

---

## Features Implemented
* **Core API Functionality**:
  * Complete RESTful interface for managing Items, Users, and Bids.
  * Allows organizers to create items and bidders to view and place secure bids.
* **Real-Time WebSockets**: 
  * Integrated STOMP over WebSockets.
  * Subscriptions to `/topic/items/{id}/bids` allow frontend clients to receive live, instant updates when a higher bid is placed.
* **Advanced Security Architecture**: 
  * Implemented Spring Security Basic Authentication.
  * Uses a custom `AuthenticatedUser` principal mapping to achieve O(1) time complexity database ID lookups during traffic spikes.
* **Pagination & Sorting**: 
  * Fully integrated Spring Data `Pageable` routing to cleanly fetch manageable chunks of data (e.g., `/items?page=0&size=10`).
* **Search Filtering**: 
  * Uses Custom Derived JPA Queries (`findByNameContainingIgnoreCase...`) for robust, case-insensitive item discovery.
* **Hardened Concurrency Processing**:
  * Prevents critical lost-update race conditions during high-frequency concurrent bidding.
  * Utilizes database-level JPA `@Version` Optimistic Locking rather than heavy, slow thread-blocking pessimistic locks.
* **Automated Background Scheduling**:
  * A `@Scheduled` background worker thread actively manages and safely closes expired auctions in completely isolated database transactions.

---

## Build & Run Instructions

### Prerequisites
- Java 21+
- Maven
- Docker / Docker Compose (Optional, but recommended for DB setup)
- MySQL 8.0+

### Option A: Running via Docker Compose (Recommended)
This approach spins up both the MySQL database and the Spring Boot application container simultaneously, automatically configuring the database.
1. Create an `.env` file in the root directory:
   ```env
   DB_NAME=charity_auction
   DB_USER=auction_user
   DB_PASSWORD=password123
   DB_ROOT_PASSWORD=rootpassword
   ```
2. Build and run the containers:
   ```bash
   docker-compose up --build
   ```

### Option B: Running Locally (Manual DB Setup)
1. Ensure your local MySQL instance is running.
2. Edit `src/main/resources/application.properties` or set your local environment variables to match your local database:
   ```properties
   SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/charity_auction
   SPRING_DATASOURCE_USERNAME=auction_user
   SPRING_DATASOURCE_PASSWORD=password123
   ```
3. Run the application:
   ```bash
   ./mvnw spring-boot:run
   ```

---

## MySQL Database Setup Instructions

If you run the application using Docker Compose (Option A), the MySQL database, schema, and user privileges are automatically created and configured using the environment variables in your `.env` file. No manual database setup is required.

If you choose to run the Spring Boot application locally against a manual MySQL instance (Option B), follow these database instructions using your MySQL client:

1. Connect to MySQL as `root`:
   ```sql
   mysql -u root -p
   ```
2. Execute the following commands to create the database and user:
   ```sql
   CREATE DATABASE IF NOT EXISTS charity_auction;
   CREATE USER 'auction_user'@'localhost' IDENTIFIED BY 'password123';
   GRANT ALL PRIVILEGES ON charity_auction.* TO 'auction_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

**Note on Schema Generation**: You do not need to manually create the `users`, `items`, and `bids` tables. The application uses `spring.jpa.hibernate.ddl-auto=update`, which dynamically generates the schema upon the first successful boot. On the first boot, a `CommandLineRunner` in `DataInitializer.java` intercepts the startup sequence and automatically seeds the database with a default Admin `(username: admin, password: admin123)`.

---

## Architectural Overview & Design Decisions

### Database Entities
The system is built on three core JPA entities mapped to MySQL tables via Hibernate:

* **`users`** — Stores all system users. Each user has a unique `username`, a BCrypt-hashed `password`, and a `role` (`ROLE_ADMIN`, `ROLE_ORGANIZER`, `ROLE_BIDDER`). Seeded automatically on first boot with a default admin account.
* **`items`** — Represents each auction listing. Holds `name`, `description`, `starting_price`, `current_highest_bid`, `auction_end_time`, and `status` (`ACTIVE` / `CLOSED`). References `users` twice: `organizer_id` (who created it) and `highest_bidder_id` (who is currently winning). Contains a `version` column for Optimistic Locking.
* **`bids`** — A historical record of every bid placed. Each bid stores the `amount`, `bid_time`, and two foreign keys: `item_id` (which auction it belongs to) and `user_id` (who placed it).

**Entity Relationships:**
* A `User` (Organizer) creates many `Items` → `items.organizer_id → users.id`
* An `Item` receives many `Bids` → `bids.item_id → items.id`
* A `User` (Bidder) places many `Bids` → `bids.user_id → users.id`
* An `Item` tracks its current leader → `items.highest_bidder_id → users.id` (nullable)

---

### Operational Flows

#### 1. User Management Flow
1. An `ADMIN` or `ORGANIZER` sends a `POST /users` request with a `UserCreateRequest` DTO (username, password, role).
2. `UserController` receives the request. It reads the caller's role from the granted authorities in the `Authentication` object and passes it to the service.
3. `UserServiceImpl.createUser()` validates the role hierarchy (e.g., an `ORGANIZER` can only create `BIDDER` users). It rejects duplicates by checking if `userRepository.findByUsername()` returns a value.
4. The password is BCrypt-hashed using `PasswordEncoder` before the `User` entity is saved via `UserRepository.save()`.
5. The new user's generated `id` is returned with a `201 CREATED` response.
6. Updates follow the same path via `PUT /users/{id}` → `UserController` → `UserServiceImpl.updateUser()` → `UserRepository.save()`, restricted to `ADMIN` only.

#### 2. Item Management Flow
1. An `ADMIN` or `ORGANIZER` sends a `POST /items` request with a `CreateItemRequest` DTO.
2. `ItemController` extracts the authenticated user's ID from the `AuthenticatedUser` principal (O(1), no DB query).
3. `ItemServiceImpl.createItem()` builds an `Item` entity, sets `status = ACTIVE` and `currentHighestBid = startingPrice`, links the calling user as the `organizer`, then saves via `ItemRepository.save()`.
4. For listings, `GET /items` delegates to `ItemServiceImpl.getAllItems(pageable)` which queries `ItemRepository.findAll(pageable)` and maps results to `ItemResponse` DTOs.
5. `GET /items/search?query=guitar` calls `ItemRepository.findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(...)` for case-insensitive search.

#### 3. Bidding Flow
1. A `BIDDER` sends `POST /items/{itemId}/bids` with a `PlaceBidRequest` DTO containing the bid `amount`.
2. `BidController` extracts the authenticated user's `userId` directly from the in-memory `AuthenticatedUser` principal.
3. `BidServiceImpl.placeBid()` enforces all business rules in sequence:
   * Fetches the `Item` by ID. Throws `ResourceNotFoundException` if not found.
   * Validates `item.getStatus() == ACTIVE` and ensures the auction has not ended. Throws `BusinessException` if not.
   * Prevents anti-shill bidding: checks `item.getOrganizer().getId() == bidderId`. Throws `AccessDeniedException` if matched.
   * Prevents anti-self bidding: checks if the bidder is already the current highest bidder. Throws `BusinessException` if matched.
   * Validates `bid.getAmount() > item.getCurrentHighestBid()`. Throws `BusinessException` if not.
   * Saves the `Bid` entity. Updates `item.currentHighestBid` and `item.highestBidder`, then saves the `Item`.
4. On successful save, `SimpMessagingTemplate.convertAndSend("/topic/items/{itemId}/bids", bidResponse)` broadcasts the new bid to all WebSocket subscribers in real time.
5. The new bid's generated `id` is returned with a `201 CREATED` response.

#### 4. Auction Closure Flow (Automated)
1. `AuctionSchedulerService` runs a background thread every 60 seconds via `@Scheduled(fixedRate = 60000)`.
2. It queries `ItemRepository.findByStatusAndAuctionEndTimeBefore(ACTIVE, LocalDateTime.now())` to get all expired, unclosed auctions.
3. For each expired item, it calls `AuctionClosureServiceImpl.closeAuction(item)` in a **separate, isolated transaction** (`Propagation.REQUIRES_NEW`).
4. `closeAuction()` sets `item.setStatus(CLOSED)` and saves. If one item fails, only that transaction rolls back; the others continue.

---

### Significant Design Decisions

#### Role-Based Access Control (RBAC)
The system enforces strict hierarchical access control using Spring Security, mapped to three distinct roles:
* **ADMIN**: Full system access. They uniquely possess the authority to **update/edit** existing `Users` and `Items`. They can create any user role. An Admin can only be created via direct database seeding or by another Admin.
* **ORGANIZER**: Event managers. They have the authority to **create** new `Items` for auction and can register new `Users` (but only as `BIDDER`s). They are strictly prohibited from modifying existing records.
* **BIDDER**: Standard participants. Viewing items is open to the public (no login required), consistent with how the WebSocket broadcast is also open. Bidders are the *only* role permitted to execute the `POST /items/{id}/bids` endpoint to actually place bids.

#### Concurrency Handling (Race Conditions)
During high-frequency bidding, multiple users may attempt to place a bid simultaneously. This is handled using **JPA Optimistic Locking**. The `Item` entity contains an `@Version` column. Instead of implementing expensive, thread-blocking database locks, all concurrent bid attempts read the item instantly without blocking. The first thread to save successfully increments the database version. Subsequent threads that attempt to execute an update matching the old version will trigger an `OptimisticLockingFailureException`. The `GlobalExceptionHandler` intercepts this rollback and returns an HTTP `409 CONFLICT`, politely informing the outbid user to refresh and try again.

#### Automated Auction Closing (Background Batch Processing)
Auctions automatically close when their time expires via the `AuctionSchedulerService`. It runs a `@Scheduled` background worker thread every 60 seconds. It polls the database efficiently for active items past their expiration. The actual status change is delegated to `AuctionClosureServiceImpl` inside a `@Transactional(propagation = Propagation.REQUIRES_NEW)` block. This ensures that if the loop processes multiple items and one throws an exception, Spring only rolls back that specific item, allowing the remaining items in the loop to close successfully without crashing the entire batch process.

---


## API Documentation, Testing & WebSockets

### 1. API Endpoints
The following endpoints orchestrate the application. Based on our Role-Based Access Control, only specific users are permitted to access certain endpoints.

| Endpoint | Method | Description | Controller | Access Role(s) |
| :--- | :---: | :--- | :--- | :--- |
| `/users` | `POST` | Register a new user | `UserController` | `ADMIN`, `ORGANIZER` |
| `/users/{id}` | `PUT` | Update an existing user | `UserController` | `ADMIN` |
| `/items` | `POST` | Create an auction listing | `ItemController` | `ADMIN`, `ORGANIZER` |
| `/items/{id}` | `PUT` | Update an auction listing | `ItemController` | `ADMIN` |
| `/items` | `GET` | Fetch paginated, active items | `ItemController` | `PUBLIC (No Auth Required)` |
| `/items/{id}` | `GET` | Fetch details for a specific item | `ItemController` | `PUBLIC (No Auth Required)` |
| `/items/{id}/winner` | `GET` | Get winning bid (if CLOSED) | `ItemController` | `PUBLIC (No Auth Required)` |
| `/items/search` | `GET` | Search items by metadata | `ItemController` | `PUBLIC (No Auth Required)` |
| `/items/{itemId}/bids` | `POST` | Place a bid on a specific item | `BidController` | `BIDDER` |

### 2. Swagger OpenAPI
Once the application boots, visually interact with the API endpoints by navigating to:
**`http://localhost:8080/swagger-ui/index.html`**

### 3. Postman Collection
A fully configured Postman exported collection (`Charity_Auction_Postman_Collection.json`) is included in the project.
* Import it via Postman -> File -> Import.
* All requests are pre-configured to inherit Basic Auth credentials from the Collection level (e.g., `admin` / `admin123`).

### 4. Real-Time WebSockets
The application features a STOMP over WebSockets implementation to provide real-time bidding updates without the need for manual browser refreshing. 

**Connection Details:**
* **WebSocket Endpoint URL:** `ws://localhost:8080/ws-auction`.
* **Subscription Topic:** `/topic/items/{itemId}/bids`

**How it works:** 
Frontend clients (e.g., React, Angular) connect to the `ws-auction` endpoint and subscribe to a specific item's topic ID. Every time a successful bid is persisted to the database on that item, the backend instantly broadcasts a JSON payload to the specific topic channel, instantly pushing the new highest bid to all connected users watching that specific auction item.

**Visual Testing with ws-test.html:**
A simple HTML test client (`ws-test.html`) is included in the project root to visually verify WebSocket functionality without writing a frontend application.
1. Start the backend application.
2. Open `ws-test.html` directly in any browser (no server needed).
3. Enter the **Item ID** you want to monitor in the input field.
4. Click **Connect to WebSocket** — the page will subscribe to `/topic/items/{itemId}/bids`.
5. Use Postman to place a bid on that item via `POST /items/{itemId}/bids`.
6. The new bid payload will appear live in the browser log with a timestamp.

