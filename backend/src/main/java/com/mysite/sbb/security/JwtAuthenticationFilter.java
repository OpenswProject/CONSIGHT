package com.mysite.sbb.security;

import com.mysite.sbb.user.UserSecurityService;
import com.mysite.sbb.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    private final JwtUtil jwtUtil;
    private final UserSecurityService userSecurityService;

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String path = request.getRequestURI();
        logger.debug("Checking shouldNotFilter for path: {}", path); // 로그 추가
        boolean skipFilter = path.startsWith("/api/user/login");
        logger.debug("Should skip JwtAuthenticationFilter: {}", skipFilter); // 로그 추가
        return skipFilter;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");
        logger.debug("Authorization Header: {}", authHeader); // 로그 추가
        final String jwt;
        final String username;

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            logger.warn("JWT Token not found or does not start with Bearer for request: {}", request.getRequestURI()); // 로그 추가
            filterChain.doFilter(request, response);
            return;
        }

        jwt = authHeader.substring(7);
        logger.debug("Extracted JWT: {}", jwt); // 로그 추가
        try {
            username = jwtUtil.getUsernameFromToken(jwt);
            logger.debug("Username from JWT: {}", username); // 로그 추가
        } catch (Exception e) {
            logger.error("Error extracting username from JWT: {}", e.getMessage()); // 로그 추가
            filterChain.doFilter(request, response);
            return;
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = this.userSecurityService.loadUserByUsername(username);
            logger.debug("UserDetails loaded for username {}: {}", username, userDetails != null); // 로그 추가
            if (jwtUtil.validateToken(jwt, userDetails)) {
                logger.debug("JWT Token is valid for user: {}", username); // 로그 추가
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                );
                authToken.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                );
                SecurityContextHolder.getContext().setAuthentication(authToken);
                logger.debug("Authentication set for user: {}", username); // 로그 추가
            } else {
                logger.warn("JWT Token is NOT valid for user: {}", username); // 로그 추가
            }
        }
        filterChain.doFilter(request, response);
    }
}
