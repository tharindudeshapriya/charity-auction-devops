package com.tmdeshapriya.charity_auction.dto;

import com.tmdeshapriya.charity_auction.entity.ItemStatus;
import java.time.LocalDateTime;
import lombok.Data;

@Data
public class UpdateItemRequest {
    private String name;
    private String description;
    private Long startingPrice;
    private LocalDateTime auctionEndTime;
    private ItemStatus status;
}
