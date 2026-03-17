package com.tmdeshapriya.charity_auction.config;

import com.tmdeshapriya.charity_auction.security.UserSecurityDetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final UserSecurityDetailsService userSecurityDetailsService;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider(userSecurityDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()
                        .requestMatchers("/ws-auction/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/users/me").permitAll()
                        .requestMatchers(HttpMethod.GET, "/users/me/bids").hasRole("BIDDER")
                        .requestMatchers(HttpMethod.GET, "/users/me/won-items").hasRole("BIDDER")
                        .requestMatchers(HttpMethod.GET, "/users").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/users/count/bidders").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/users").hasAnyRole("ADMIN", "ORGANIZER")
                        .requestMatchers(HttpMethod.PUT, "/users/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/items").hasAnyRole("ORGANIZER", "ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/items/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/items/*/bids").hasRole("BIDDER")
                        .requestMatchers(HttpMethod.GET, "/items/*/bids").permitAll()
                        .requestMatchers(HttpMethod.GET, "/items/**").permitAll()
                        .anyRequest().authenticated())
                .httpBasic(Customizer.withDefaults());

        return http.build();
    }

    @Bean
    public org.springframework.web.cors.CorsConfigurationSource corsConfigurationSource() {
        org.springframework.web.cors.CorsConfiguration configuration = new org.springframework.web.cors.CorsConfiguration();
        configuration.setAllowedOrigins(java.util.List.of("http://localhost:9002"));
        configuration.setAllowedMethods(java.util.List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(java.util.List.of("Authorization", "Content-Type"));
        configuration.setAllowCredentials(true);
        org.springframework.web.cors.UrlBasedCorsConfigurationSource source = new org.springframework.web.cors.UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
