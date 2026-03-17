package com.tmdeshapriya.charity_auction.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import java.time.LocalDateTime;
import lombok.Data;

@Data
public class CreateItemRequest {

    @NotBlank(message = "Item name is required")
    private String name;

    private String description;

    @Positive(message = "Starting price must be a positive number")
    private Long startingPrice;

    @Future(message = "Auction end time must be in the future")
    private LocalDateTime auctionEndTime;
}
