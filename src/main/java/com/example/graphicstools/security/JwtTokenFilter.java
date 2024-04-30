package com.example.graphicstools.security;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

public class JwtTokenFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    public JwtTokenFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    private String extractToken(HttpServletRequest request) {

        String bearerToken = request.getHeader("Authorization");
        //System.out.println(bearerToken);
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        // Obține token-ul din header-ul cererii
        String token = extractToken(request);

        if (token != null && jwtService.validateToken(token)) {
            // Extrage informațiile din token și autentifică utilizatorul
            String uid = jwtService.getClaimsFromToken(token).get("uid", String.class);
            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(uid, null, null);
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }

        // Continuă lanțul de filtre
        filterChain.doFilter(request, response);
    }
}
