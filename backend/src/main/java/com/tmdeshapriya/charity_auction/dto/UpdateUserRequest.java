package com.tmdeshapriya.charity_auction.dto;

import com.tmdeshapriya.charity_auction.entity.Role;
import lombok.Data;

@Data
public class UpdateUserRequest {
    private String username;
    private String password; // Optional
    private Role role;
}
