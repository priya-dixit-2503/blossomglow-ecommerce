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
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

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
            .csrf(AbstractHttpConfigurer::disable)
            .cors(cors -> cors.configurationSource(corsConfigurationSource))
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Allow error and internal forwards
                .dispatcherTypeMatchers(DispatcherType.FORWARD, DispatcherType.ERROR).permitAll()

                // Allow all CORS preflight OPTIONS requests unconditionally
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                // Root & Swagger docs
                .requestMatchers(
                    "/",
                    "/api",
                    "/error",
                    "/index.html",
                    "/static/**",
                    "/favicon.ico",
                    "/v3/api-docs/**",
                    "/swagger-ui/**",
                    "/swagger-ui.html"
                ).permitAll()

                // Public Authentication
                .requestMatchers(
                    "/api/auth/login",
                    "/api/auth/register"
                ).permitAll()

                // Public storefront and catalog endpoints (all GET, search, etc.)
                .requestMatchers(
                    "/api/products",
                    "/api/products/**",
                    "/api/categories",
                    "/api/categories/**",
                    "/api/reviews",
                    "/api/reviews/**",
                    "/api/cart",
                    "/api/cart/**",
                    "/api/orders",
                    "/api/orders/track",
                    "/api/orders/track/**",
                    "/api/contact",
                    "/api/contact/**"
                ).permitAll()

                // Authenticated customer endpoints
                .requestMatchers(
                    "/api/auth/me",
                    "/api/user/**",
                    "/api/orders/my-orders",
                    "/api/wishlist/**"
                ).authenticated()

                // Admin endpoints (secured by role)
                .requestMatchers("/api/admin/**").hasRole("ADMIN")

                // Fallback: permit any other unmapped read
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
