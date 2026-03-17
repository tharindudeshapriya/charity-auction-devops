# Build stage
FROM maven:3.9.6-eclipse-temurin-21-alpine AS build
WORKDIR /app

# Copy pom.xml and download dependencies (layer caching)
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy source code and build
COPY src ./src
RUN mvn clean package -DskipTests

# Run stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copy the built jar from build stage
COPY --from=build /app/target/charity-auction-0.0.1-SNAPSHOT.jar app.jar

# Expose the application port
EXPOSE 8080

# Create a non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Set the ownership of the application directory
RUN chown -R appuser:appgroup /app

# Switch to the non-root user
USER appuser

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
