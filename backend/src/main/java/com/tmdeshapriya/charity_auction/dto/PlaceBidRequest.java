package com.tmdeshapriya.charity_auction.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class PlaceBidRequest {

    @NotNull(message = "Bid amount is required")
    @Positive(message = "Bid amount must be positive")
    private Long amount;
}
