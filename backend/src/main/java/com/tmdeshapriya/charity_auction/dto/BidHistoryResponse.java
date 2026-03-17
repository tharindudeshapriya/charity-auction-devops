package com.tmdeshapriya.charity_auction.dto;

import com.tmdeshapriya.charity_auction.entity.ItemStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO representing a single bid entry in a history view.
 * Enriches the raw Bid with item context for display purposes.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BidHistoryResponse {
    private Long bidId;
    private Long itemId;
    private String itemName;
    private ItemStatus itemStatus;
    private Long amount;
    private LocalDateTime bidTime;
    private String bidderUsername;
}
