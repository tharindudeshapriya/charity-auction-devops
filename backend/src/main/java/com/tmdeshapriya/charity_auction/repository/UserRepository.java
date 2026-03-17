package com.tmdeshapriya.charity_auction.repository;

import com.tmdeshapriya.charity_auction.entity.Role;
import com.tmdeshapriya.charity_auction.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);

    boolean existsByRole(Role role);

    // Count users by role — used for total bidder count
    long countByRole(Role role);

    // Paginated list of users filtered by role
    Page<User> findByRole(Role role, Pageable pageable);
}
