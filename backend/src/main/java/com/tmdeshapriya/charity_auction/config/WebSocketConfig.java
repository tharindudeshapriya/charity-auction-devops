package com.tmdeshapriya.charity_auction.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // The endpoint clients will use to connect to the WebSocket server
        // .setAllowedOriginPatterns("*") allows cross-origin requests (e.g., from a
        // separate frontend app)
        registry.addEndpoint("/ws-auction")
                .setAllowedOriginPatterns("*")
                .withSockJS(); // Fallback options for browsers that don't support WebSockets
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // Enable a simple memory-based message broker to carry the messages back to the
        // client on destinations prefixed with "/topic"
        registry.enableSimpleBroker("/topic");

        // Prefix for messages BOUND for @MessageMapping methods in Spring controllers
        // (we don't strictly need this for broadcasting only, but good practice)
        registry.setApplicationDestinationPrefixes("/app");
    }
}
