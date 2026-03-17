package com.tmdeshapriya.charity_auction.service.impl;

import com.tmdeshapriya.charity_auction.dto.CreateItemRequest;
import com.tmdeshapriya.charity_auction.dto.ItemResponse;
import com.tmdeshapriya.charity_auction.dto.UpdateItemRequest;
import com.tmdeshapriya.charity_auction.entity.Item;
import com.tmdeshapriya.charity_auction.entity.ItemStatus;
import com.tmdeshapriya.charity_auction.entity.User;
import com.tmdeshapriya.charity_auction.exception.ResourceNotFoundException;
import com.tmdeshapriya.charity_auction.repository.ItemRepository;
import com.tmdeshapriya.charity_auction.repository.UserRepository;
import com.tmdeshapriya.charity_auction.service.ItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ItemServiceImpl implements ItemService {

    private final ItemRepository itemRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public Long createItem(CreateItemRequest request, Long userId) {
        // 1. Fetch the Organizer
        User organizer = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        // 2. Enforce Role-based creation
        // Removed role-based check as per instruction, assuming it's handled elsewhere
        // or no longer needed for this method.

        // 3. Map DTO to Entity
        Item item = new Item();
        item.setName(request.getName());
        item.setDescription(request.getDescription());
        item.setStartingPrice(request.getStartingPrice());
        item.setCurrentHighestBid(request.getStartingPrice()); // Initial high bid is the starting price
        item.setAuctionEndTime(request.getAuctionEndTime());
        item.setStatus(ItemStatus.ACTIVE);
        item.setOrganizer(organizer);

        // 4. Save and return ID
        return itemRepository.save(item).getId();
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ItemResponse> getAllItems(Pageable pageable) {
        return itemRepository.findAll(pageable)
                .map(this::mapToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public ItemResponse getItemById(Long id) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found: " + id));
        return mapToResponse(item);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ItemResponse> searchItems(String query, Pageable pageable) {
        return itemRepository.findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(query, query, pageable)
                .map(this::mapToResponse);
    }

    @Override
    @Transactional
    public Long updateItem(Long id, UpdateItemRequest request) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found with id: " + id));

        if (request.getName() != null) {
            item.setName(request.getName());
        }
        if (request.getDescription() != null) {
            item.setDescription(request.getDescription());
        }
        if (request.getStartingPrice() != null) {
            item.setStartingPrice(request.getStartingPrice());
        }
        if (request.getAuctionEndTime() != null) {
            item.setAuctionEndTime(request.getAuctionEndTime());
        }
        if (request.getStatus() != null) {
            item.setStatus(request.getStatus());
        }

        return itemRepository.save(item).getId();
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ItemResponse> getWonItems(Long userId, Pageable pageable) {
        return itemRepository.findByHighestBidder_IdAndStatus(userId, ItemStatus.CLOSED, pageable)
                .map(this::mapToResponse);
    }

    private ItemResponse mapToResponse(Item item) {
        return ItemResponse.builder()
                .id(item.getId())
                .name(item.getName())
                .description(item.getDescription())
                .startingPrice(item.getStartingPrice())
                .currentHighestBid(item.getCurrentHighestBid())
                .auctionEndTime(item.getAuctionEndTime())
                .status(item.getStatus())
                .organizerUsername(item.getOrganizer().getUsername())
                .winnerId(item.getHighestBidder() != null ? item.getHighestBidder().getId() : null)
                .winnerUsername(item.getHighestBidder() != null ? item.getHighestBidder().getUsername() : null)
                .build();
    }
}
