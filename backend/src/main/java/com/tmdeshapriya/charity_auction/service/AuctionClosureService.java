package com.tmdeshapriya.charity_auction.service;

import com.tmdeshapriya.charity_auction.entity.Item;

/**
 * Handles the transactional closure of a single auction item.
 * Extracted to ensure that if closing one item fails, it does not
 * roll back the closure of other items in the batch.
 */
public interface AuctionClosureService {
    void closeAuction(Item item);
}
