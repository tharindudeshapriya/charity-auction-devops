package com.tmdeshapriya.charity_auction.dto;

import com.tmdeshapriya.charity_auction.entity.ItemStatus;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ItemResponse {
    private Long id;
    private String name;
    private String description;
    private Long startingPrice;
    private Long currentHighestBid;
    private LocalDateTime auctionEndTime;
    private ItemStatus status;
    private String organizerUsername;
    private Long winnerId;
    private String winnerUsername;
}
