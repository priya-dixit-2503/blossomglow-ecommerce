package com.blossomglow.backend.config;

import com.blossomglow.backend.security.JwtAuthenticationFilter;
import jakarta.servlet.DispatcherType;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

import static org.springframework.security.web.util.matcher.AntPathRequestMatcher.antMatcher;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final CorsConfigurationSource corsConfigurationSource;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource))
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Allow internal container forwards and error pages
                .dispatcherTypeMatchers(DispatcherType.FORWARD, DispatcherType.ERROR).permitAll()

                // Allow all CORS preflight OPTIONS requests unconditionally
                .requestMatchers(antMatcher(HttpMethod.OPTIONS, "/**")).permitAll()

                // Static resources & documentation
                .requestMatchers(
                    antMatcher("/"),
                    antMatcher("/api"),
                    antMatcher("/error"),
                    antMatcher("/index.html"),
                    antMatcher("/static/**"),
                    antMatcher("/favicon.ico"),
                    antMatcher("/v3/api-docs/**"),
                    antMatcher("/swagger-ui/**"),
                    antMatcher("/swagger-ui.html")
                ).permitAll()

                // Public Authentication endpoints
                .requestMatchers(
                    antMatcher("/api/auth/login"),
                    antMatcher("/api/auth/register")
                ).permitAll()

                // Public storefront and catalog endpoints (all HTTP methods; mutation secured via @PreAuthorize)
                .requestMatchers(
                    antMatcher("/api/products"),
                    antMatcher("/api/products/**"),
                    antMatcher("/api/categories"),
                    antMatcher("/api/categories/**"),
                    antMatcher("/api/reviews"),
                    antMatcher("/api/reviews/**"),
                    antMatcher("/api/cart"),
                    antMatcher("/api/cart/**"),
                    antMatcher("/api/orders"),
                    antMatcher("/api/orders/track"),
                    antMatcher("/api/orders/track/**"),
                    antMatcher("/api/contact"),
                    antMatcher("/api/contact/**")
                ).permitAll()

                // Authenticated customer endpoints
                .requestMatchers(
                    antMatcher("/api/auth/me"),
                    antMatcher("/api/orders/my-orders"),
                    antMatcher("/api/wishlist/**")
                ).authenticated()

                // Protected admin management endpoints
                .requestMatchers(antMatcher("/api/admin/**")).hasRole("ADMIN")

                // Any other request
                .anyRequest().permitAll()
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
