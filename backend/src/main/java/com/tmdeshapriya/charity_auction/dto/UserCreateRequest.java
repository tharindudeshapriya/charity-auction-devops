package com.tmdeshapriya.charity_auction.dto;

import com.tmdeshapriya.charity_auction.entity.Role;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UserCreateRequest {

    @NotBlank(message = "Username is required")
    private String username;

    @NotBlank(message = "Password is required")
    private String password;

    @NotNull(message = "Role is required")
    private Role role;
}
