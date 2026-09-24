package com.blossomglow.backend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String jwt = authHeader.substring(7).trim();
            
            // If the token is empty or a mock simulation string, safely skip JWT parsing
            if (!jwt.isEmpty() && !jwt.startsWith("mock-jwt-") && jwt.split("\\.").length == 3) {
                try {
                    String username = jwtUtil.extractUsername(jwt);
                    if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                        if (jwtUtil.validateToken(jwt)) {
                            String role = jwtUtil.extractRole(jwt);
                            if (role == null) {
                                role = "ROLE_CUSTOMER";
                            }
                            if (!role.startsWith("ROLE_")) {
                                role = "ROLE_" + role;
                            }

                            UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                                    username,
                                    null,
                                    Collections.singletonList(new SimpleGrantedAuthority(role))
                            );
                            authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                            SecurityContextHolder.getContext().setAuthentication(authToken);
                        }
                    }
                } catch (Exception e) {
                    // Ignore expired/invalid token; permit anonymous access on public routes
                    logger.debug("JWT validation skipped: " + e.getMessage());
                }
            }
        }

        filterChain.doFilter(request, response);
    }
}
