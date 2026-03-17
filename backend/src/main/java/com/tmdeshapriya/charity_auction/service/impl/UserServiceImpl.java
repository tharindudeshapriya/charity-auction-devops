package com.tmdeshapriya.charity_auction.service.impl;

import com.tmdeshapriya.charity_auction.dto.UpdateUserRequest;
import com.tmdeshapriya.charity_auction.dto.UserCreateRequest;
import com.tmdeshapriya.charity_auction.dto.UserResponse;
import com.tmdeshapriya.charity_auction.entity.Role;
import com.tmdeshapriya.charity_auction.entity.User;
import com.tmdeshapriya.charity_auction.exception.AccessDeniedException;
import com.tmdeshapriya.charity_auction.exception.DuplicateResourceException;
import com.tmdeshapriya.charity_auction.exception.ResourceNotFoundException;
import com.tmdeshapriya.charity_auction.repository.UserRepository;
import com.tmdeshapriya.charity_auction.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public Long createUser(UserCreateRequest request, Role creatorRole) {
        validateHierarchy(creatorRole, request.getRole());

        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new DuplicateResourceException("Username already exists: " + request.getUsername());
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());

        return userRepository.save(user).getId();
    }

    @Override
    @Transactional
    public Long updateUser(Long id, UpdateUserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        if (request.getUsername() != null) {
            user.setUsername(request.getUsername());
        }
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        if (request.getRole() != null) {
            user.setRole(request.getRole());
        }

        return userRepository.save(user).getId();
    }

    @Override
    @Transactional(readOnly = true)
    public Page<UserResponse> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable)
                .map(u -> new UserResponse(u.getId(), u.getUsername(), u.getRole()));
    }

    @Override
    @Transactional(readOnly = true)
    public long getTotalBidderCount() {
        return userRepository.countByRole(Role.ROLE_BIDDER);
    }

    private void validateHierarchy(Role creatorRole, Role targetRole) {
        if (creatorRole == Role.ROLE_ADMIN) {
            if (targetRole == Role.ROLE_ADMIN) {
                throw new AccessDeniedException("Admin cannot create another Admin");
            }
        } else if (creatorRole == Role.ROLE_ORGANIZER) {
            if (targetRole != Role.ROLE_BIDDER) {
                throw new AccessDeniedException("Organizers can only create Bidders");
            }
        } else {
            throw new AccessDeniedException("Bidders are not allowed to create users");
        }
    }
}
