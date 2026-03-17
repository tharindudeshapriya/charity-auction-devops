package com.tmdeshapriya.charity_auction.service;

import com.tmdeshapriya.charity_auction.dto.BidHistoryResponse;
import com.tmdeshapriya.charity_auction.dto.PlaceBidRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface BidService {
    Long placeBid(Long itemId, PlaceBidRequest request, Long userId);

    // Paginated history of all bids placed by a specific bidder
    Page<BidHistoryResponse> getBiddingHistory(Long userId, Pageable pageable);

    // Paginated history of all bids placed on a specific item
    Page<BidHistoryResponse> getItemBids(Long itemId, Pageable pageable);
}
