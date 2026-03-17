package com.tmdeshapriya.charity_auction.controller;

import com.tmdeshapriya.charity_auction.dto.CreateItemRequest;
import com.tmdeshapriya.charity_auction.dto.ItemResponse;
import com.tmdeshapriya.charity_auction.dto.UpdateItemRequest;
import com.tmdeshapriya.charity_auction.security.AuthenticatedUser;
import com.tmdeshapriya.charity_auction.service.ItemService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/items")
@RequiredArgsConstructor
public class ItemController {

    private final ItemService itemService;

    @PostMapping
    public ResponseEntity<Long> createItem(
            @Valid @RequestBody CreateItemRequest request,
            Authentication authentication) {
        Long userId = ((AuthenticatedUser) authentication.getPrincipal()).getUserId();
        return new ResponseEntity<>(itemService.createItem(request, userId), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<Page<ItemResponse>> getAllItems(Pageable pageable) {
        return ResponseEntity.ok(itemService.getAllItems(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ItemResponse> getItemById(@PathVariable Long id) {
        return ResponseEntity.ok(itemService.getItemById(id));
    }

    @GetMapping("/{id}/winner")
    public ResponseEntity<ItemResponse> getItemWinner(@PathVariable Long id) {
        // reusing the ItemResponse; if status is not CLOSED, the winnerId/Name will just
        // represent current leader
        return ResponseEntity.ok(itemService.getItemById(id));
    }

    @GetMapping("/search")
    public ResponseEntity<Page<ItemResponse>> searchItems(
            @RequestParam String query,
            Pageable pageable) {
        return ResponseEntity.ok(itemService.searchItems(query, pageable));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Long> updateItem(
            @PathVariable Long id,
            @Valid @RequestBody UpdateItemRequest request) {
        return ResponseEntity.ok(itemService.updateItem(id, request));
    }
}
