package com.tmdeshapriya.charity_auction.service;

import com.tmdeshapriya.charity_auction.dto.UpdateUserRequest;
import com.tmdeshapriya.charity_auction.dto.UserCreateRequest;
import com.tmdeshapriya.charity_auction.dto.UserResponse;
import com.tmdeshapriya.charity_auction.entity.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface UserService {
    Long createUser(UserCreateRequest request, Role creatorRole);

    Long updateUser(Long id, UpdateUserRequest request);

    // Returns a paginated list of all users
    Page<UserResponse> getAllUsers(Pageable pageable);

    // Returns the total count of bidder accounts
    long getTotalBidderCount();
}
