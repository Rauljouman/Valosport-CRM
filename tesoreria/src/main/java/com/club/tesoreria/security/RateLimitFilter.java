package com.club.tesoreria.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class RateLimitFilter extends OncePerRequestFilter {

    private final RateLimitService rateLimitService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String path = request.getRequestURI();
        String method = request.getMethod();
        String ip = obtenerIpCliente(request);

        if ("OPTIONS".equalsIgnoreCase(method)) {
            filterChain.doFilter(request, response);
            return;
        }

        RateLimitRule rule = obtenerRegla(path, method);

        if (rule != null) {
            String key = ip + ":" + method + ":" + path;

            boolean allowed = rateLimitService.isAllowed(
                    key,
                    rule.maxRequests(),
                    rule.windowSeconds()
            );

            if (!allowed) {
                response.setStatus(429);
                response.setContentType("application/json");
                response.getWriter().write("\"Demasiadas peticiones. Espera unos minutos.\"");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }

    private RateLimitRule obtenerRegla(String path, String method) {
        if ("POST".equalsIgnoreCase(method) && path.equals("/api/auth/login")) {
            return new RateLimitRule(10, 60); // 10 intentos por minuto por IP
        }

        if ("POST".equalsIgnoreCase(method) && path.equals("/api/auth/forgot-password")) {
            return new RateLimitRule(5, 300); // 5 solicitudes cada 5 minutos
        }

        if ("POST".equalsIgnoreCase(method) && path.equals("/api/usuarios")) {
            return new RateLimitRule(10, 300); // 10 usuarios cada 5 minutos
        }

        if ("POST".equalsIgnoreCase(method) && path.equals("/api/transacciones")) {
            return new RateLimitRule(3, 60); // 30 transacciones por minuto
        }

        if ("POST".equalsIgnoreCase(method) && path.equals("/api/sugerencias")) {
            return new RateLimitRule(3, 300); // 5 sugerencias cada 5 minutos
        }

        if ("POST".equalsIgnoreCase(method) && path.equals("/api/jugadores")) {
            return new RateLimitRule(3, 60); // 20 jugadores cada 5 minutos
        }

        if ("POST".equalsIgnoreCase(method) && path.equals("/api/grupos")) {
            return new RateLimitRule(3, 60); // 10 grupos cada 5 minutos
        }

        if (path.startsWith("/api/")) {
            return new RateLimitRule(120, 60); // límite general: 120 peticiones/minuto
        }

        return null;
    }

    private String obtenerIpCliente(HttpServletRequest request) {
        String forwardedFor = request.getHeader("X-Forwarded-For");

        if (forwardedFor != null && !forwardedFor.isBlank()) {
            return forwardedFor.split(",")[0].trim();
        }

        return request.getRemoteAddr();
    }

    private record RateLimitRule(int maxRequests, int windowSeconds) {
    }
}