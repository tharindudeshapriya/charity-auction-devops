package com.tmdeshapriya.charity_auction;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class CharityAuctionApplication {

	public static void main(String[] args) {
		SpringApplication.run(CharityAuctionApplication.class, args);
	}

}
