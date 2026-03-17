package com.tmdeshapriya.charity_auction.repository;

import com.tmdeshapriya.charity_auction.entity.Bid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BidRepository extends JpaRepository<Bid, Long> {

    // All bids placed by a specific user (bidding history)
    Page<Bid> findByUser_Id(Long userId, Pageable pageable);

    // All bids placed on a specific item (per-item bid history)
    Page<Bid> findByItem_Id(Long itemId, Pageable pageable);
}
