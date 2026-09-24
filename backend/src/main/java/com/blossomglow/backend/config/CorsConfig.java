package com.blossomglow.backend.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.Collections;

@Configuration
public class CorsConfig {

    private CorsConfiguration buildCorsConfig() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        // Allow ANY origin pattern (Cloud Run preview URLs, localhost, custom ports, etc.)
        config.setAllowedOriginPatterns(Collections.singletonList("*"));
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"));
        config.setAllowedHeaders(Arrays.asList("*"));
        config.setExposedHeaders(Arrays.asList("Authorization", "X-Session-Token", "Content-Disposition", "Access-Control-Allow-Private-Network"));
        config.setMaxAge(3600L);
        return config;
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", buildCorsConfig());
        return source;
    }

    /**
     * Registers a CorsFilter at HIGHEST_PRECEDENCE so that CORS and preflight
     * OPTIONS requests are handled before any other filter, and injects Chrome
     * Private Network Access headers when called from cloud portal URLs to localhost.
     */
    @Bean
    public FilterRegistrationBean<CorsFilter> corsFilterRegistration(CorsConfigurationSource corsConfigurationSource) {
        CorsFilter filter = new CorsFilter(corsConfigurationSource) {
            @Override
            protected void doFilterInternal(HttpServletRequest request,
                                            HttpServletResponse response,
                                            FilterChain filterChain)
                    throws ServletException, IOException {

                // Support Chrome Private Network Access (PNA) when portal requests localhost:8080
                if ("true".equalsIgnoreCase(request.getHeader("Access-Control-Request-Private-Network"))) {
                    response.setHeader("Access-Control-Allow-Private-Network", "true");
                }

                // Handle preflight directly
                if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
                    response.setHeader("Access-Control-Allow-Origin", request.getHeader("Origin") != null ? request.getHeader("Origin") : "*");
                    response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD");
                    response.setHeader("Access-Control-Allow-Headers", "*");
                    response.setHeader("Access-Control-Allow-Credentials", "true");
                    response.setStatus(HttpServletResponse.SC_OK);
                    return;
                }

                super.doFilterInternal(request, response, filterChain);
            }
        };

        FilterRegistrationBean<CorsFilter> bean = new FilterRegistrationBean<>(filter);
        bean.setOrder(Ordered.HIGHEST_PRECEDENCE);
        return bean;
    }
}
