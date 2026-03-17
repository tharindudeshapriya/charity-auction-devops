package com.tmdeshapriya.charity_auction.service;

import com.tmdeshapriya.charity_auction.dto.CreateItemRequest;
import com.tmdeshapriya.charity_auction.dto.ItemResponse;
import com.tmdeshapriya.charity_auction.dto.UpdateItemRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ItemService {
    Long createItem(CreateItemRequest request, Long userId);

    Page<ItemResponse> getAllItems(Pageable pageable);

    Page<ItemResponse> searchItems(String query, Pageable pageable);

    ItemResponse getItemById(Long id);

    Long updateItem(Long id, UpdateItemRequest request);

    // Returns CLOSED items where the given user is the highest bidder
    Page<ItemResponse> getWonItems(Long userId, Pageable pageable);
}
