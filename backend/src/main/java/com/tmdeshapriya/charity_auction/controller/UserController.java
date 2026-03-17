package com.tmdeshapriya.charity_auction.controller;

import com.tmdeshapriya.charity_auction.dto.UpdateUserRequest;
import com.tmdeshapriya.charity_auction.dto.UserCreateRequest;
import com.tmdeshapriya.charity_auction.dto.UserResponse;
import com.tmdeshapriya.charity_auction.dto.BidHistoryResponse;
import com.tmdeshapriya.charity_auction.dto.ItemResponse;
import com.tmdeshapriya.charity_auction.entity.Role;
import com.tmdeshapriya.charity_auction.security.AuthenticatedUser;
import com.tmdeshapriya.charity_auction.service.BidService;
import com.tmdeshapriya.charity_auction.service.ItemService;
import com.tmdeshapriya.charity_auction.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final BidService bidService;
    private final ItemService itemService;

    // --- Read current authenticated user ---
    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(@AuthenticationPrincipal AuthenticatedUser user) {
        Role role = Role.valueOf(user.getAuthorities().iterator().next().getAuthority());
        return ResponseEntity.ok(new UserResponse(user.getUserId(), user.getUsername(), role));
    }

    // --- Admin: Get all users (paginated) ---
    @GetMapping
    public ResponseEntity<Page<UserResponse>> getAllUsers(Pageable pageable) {
        return ResponseEntity.ok(userService.getAllUsers(pageable));
    }

    // --- Admin: Get total bidder count ---
    @GetMapping("/count/bidders")
    public ResponseEntity<Long> getTotalBidderCount() {
        return ResponseEntity.ok(userService.getTotalBidderCount());
    }

    // --- Admin/Organizer: Create user (with role hierarchy enforcement) ---
    @PostMapping
    public ResponseEntity<Long> createUser(
            @Valid @RequestBody UserCreateRequest request,
            Authentication authentication
    ) {
        Role creatorRole = Role.valueOf(
                authentication.getAuthorities().iterator().next().getAuthority());
        Long userId = userService.createUser(request, creatorRole);
        return new ResponseEntity<>(userId, HttpStatus.CREATED);
    }

    // --- Admin: Update user ---
    @PutMapping("/{id}")
    public ResponseEntity<Long> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserRequest request) {
        return ResponseEntity.ok(userService.updateUser(id, request));
    }

    // --- Bidder: Get my bid history ---
    @GetMapping("/me/bids")
    public ResponseEntity<Page<BidHistoryResponse>> getMyBids(
            @AuthenticationPrincipal AuthenticatedUser user,
            Pageable pageable) {
        return ResponseEntity.ok(bidService.getBiddingHistory(user.getUserId(), pageable));
    }

    // --- Bidder: Get items I have won (CLOSED auctions where I am highest bidder) ---
    @GetMapping("/me/won-items")
    public ResponseEntity<Page<ItemResponse>> getMyWonItems(
            @AuthenticationPrincipal AuthenticatedUser user,
            Pageable pageable) {
        return ResponseEntity.ok(itemService.getWonItems(user.getUserId(), pageable));
    }
}
