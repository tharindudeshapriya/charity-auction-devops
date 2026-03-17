package com.tmdeshapriya.charity_auction.security;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

/**
 * Custom {@link UserDetails} that exposes the database user ID alongside
 * standard Spring Security fields, eliminating the need for secondary
 * repository lookups in controllers.
 */
public class AuthenticatedUser implements UserDetails {

    private final Long userId;
    private final String username;
    private final String password;
    private final List<GrantedAuthority> authorities;

    public AuthenticatedUser(Long userId,
            String username,
            String password,
            List<GrantedAuthority> authorities) {
        this.userId = userId;
        this.username = username;
        this.password = password;
        this.authorities = authorities;
    }

    public Long getUserId() {
        return userId;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
