package com.club.tesoreria.security;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class RateLimitService {

    private final Map<String, RateLimitInfo> requestMap = new ConcurrentHashMap<>();

    public boolean isAllowed(String key, int maxRequests, int windowSeconds) {
        LocalDateTime now = LocalDateTime.now();

        RateLimitInfo info = requestMap.get(key);

        if (info == null || info.getWindowStart().plusSeconds(windowSeconds).isBefore(now)) {
            requestMap.put(key, new RateLimitInfo(1, now));
            return true;
        }

        if (info.getRequestCount() >= maxRequests) {
            return false;
        }

        info.incrementRequestCount();
        return true;
    }

    private static class RateLimitInfo {
        private int requestCount;
        private LocalDateTime windowStart;

        public RateLimitInfo(int requestCount, LocalDateTime windowStart) {
            this.requestCount = requestCount;
            this.windowStart = windowStart;
        }

        public int getRequestCount() {
            return requestCount;
        }

        public LocalDateTime getWindowStart() {
            return windowStart;
        }

        public void incrementRequestCount() {
            this.requestCount++;
        }
    }
}