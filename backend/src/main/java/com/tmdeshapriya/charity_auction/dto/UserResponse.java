package com.tmdeshapriya.charity_auction.dto;

import com.tmdeshapriya.charity_auction.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserResponse {
    private Long id;
    private String username;
    private Role role;
}
