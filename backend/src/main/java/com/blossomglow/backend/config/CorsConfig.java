package com.blossomglow.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
public class CorsConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        // Explicit allowed origin patterns (do not include bare "*" when allowCredentials=true)
        config.setAllowedOriginPatterns(List.of(
                "http://localhost:[*]",
                "http://localhost:*",
                "http://127.0.0.1:[*]",
                "http://127.0.0.1:*",
                "https://*.run.app",
                "https://*.google.com",
                "https://*.web.app",
                "https://*.firebaseapp.com"
        ));
        config.setAllowedHeaders(Arrays.asList("*"));
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"));
        config.setExposedHeaders(Arrays.asList("Authorization", "X-Session-Token", "Content-Disposition"));
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
