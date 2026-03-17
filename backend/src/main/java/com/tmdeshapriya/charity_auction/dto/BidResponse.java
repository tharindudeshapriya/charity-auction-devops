package com.tmdeshapriya.charity_auction.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Data Transfer Object broadcasted over WebSockets when a new bid is placed.
 * We don't want to broadcast the entire Item or Bid entity directly.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BidResponse {
    private Long id; // The ID of the bid
    private Long itemId; // Which item was bid on
    private Long amount; // The new highest bid amount
    private String bidderName; // Username of whoever placed the bid
    private LocalDateTime bidTime;
}
