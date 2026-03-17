package com.tmdeshapriya.charity_auction.service;

import com.tmdeshapriya.charity_auction.entity.Item;
import com.tmdeshapriya.charity_auction.entity.ItemStatus;
import com.tmdeshapriya.charity_auction.repository.ItemRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuctionSchedulerService {

    private final ItemRepository itemRepository;
    private final AuctionClosureService auctionClosureService;

    // Runs every 60 seconds (60,000 milliseconds)
    @Scheduled(fixedRate = 60000)
    public void processExpiredAuctions() {
        log.debug("Scheduler running: checking for expired auctions...");

        // Optimized DB query: Only pull items that are currently ACTIVE but their end time has passed
        List<Item> expiredItems = itemRepository.findByStatusAndAuctionEndTimeBefore(
                ItemStatus.ACTIVE, 
                LocalDateTime.now()
        );

        if (!expiredItems.isEmpty()) {
            log.info("Found {} expired auction(s) to close.", expiredItems.size());
            
            for (Item item : expiredItems) {
                try {
                    // Call the separate service which manages its own REQUIRES_NEW transaction
                    auctionClosureService.closeAuction(item);
                } catch (Exception e) {
                    // Log the error but continue processing the rest of the items
                    log.error("Failed to close auction for Item ID: {}. Error: {}", item.getId(), e.getMessage(), e);
                }
            }
        }
    }
}
