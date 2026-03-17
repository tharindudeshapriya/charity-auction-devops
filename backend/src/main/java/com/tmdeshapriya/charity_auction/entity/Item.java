package com.tmdeshapriya.charity_auction.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "items")
@Getter
@Setter
public class Item {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private Long startingPrice;

    @Column(nullable = false)
    private Long currentHighestBid;

    @Column(nullable = false)
    private LocalDateTime auctionEndTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ItemStatus status;

    @Version
    private Long version;

    @OneToMany(mappedBy = "item", cascade = CascadeType.ALL)
    private List<Bid> bids;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organizer_id", nullable = false)
    private User organizer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "highest_bidder_id")
    private User highestBidder;
}
