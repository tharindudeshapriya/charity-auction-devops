package com.tmdeshapriya.charity_auction.service.impl;

import com.tmdeshapriya.charity_auction.entity.Item;
import com.tmdeshapriya.charity_auction.entity.ItemStatus;
import com.tmdeshapriya.charity_auction.repository.ItemRepository;
import com.tmdeshapriya.charity_auction.service.AuctionClosureService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuctionClosureServiceImpl implements AuctionClosureService {

    private final ItemRepository itemRepository;

    @Override
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void closeAuction(Item item) {
        log.info("Closing auction for Item ID: {}", item.getId());

        item.setStatus(ItemStatus.CLOSED);
        itemRepository.save(item);

        // In a real system, we might also:
        // - Send an email to the winner
        // - Trigger payment processing

        log.info("Successfully closed auction for Item ID: {}. Winner: {}, Final Bid: {}",
                item.getId(),
                item.getHighestBidder() != null ? item.getHighestBidder().getUsername() : "No bids",
                item.getCurrentHighestBid());
    }
}
