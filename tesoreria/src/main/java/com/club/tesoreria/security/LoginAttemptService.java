package com.club.tesoreria.security;

import com.club.tesoreria.exception.AccountTemporarilyLockedException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class LoginAttemptService {

    private static final int MAX_FAILED_ATTEMPTS = 5;
    private static final int LOCK_MINUTES = 15;

    private final Map<String, LoginAttemptInfo> attempts = new ConcurrentHashMap<>();

    public void checkIfBlocked(String email, String ip) {
        String key = buildKey(email, ip);

        LoginAttemptInfo info = attempts.get(key);

        if (info == null) {
            return;
        }

        if (info.getBlockedUntil() != null) {
            if (info.getBlockedUntil().isAfter(LocalDateTime.now())) {
                throw new AccountTemporarilyLockedException(
                        "Demasiados intentos fallidos. Inténtalo de nuevo más tarde."
                );
            }

            attempts.remove(key);
        }
    }

    public void loginSucceeded(String email, String ip) {
        attempts.remove(buildKey(email, ip));
    }

    public void loginFailed(String email, String ip) {
        String key = buildKey(email, ip);

        LoginAttemptInfo info = attempts.getOrDefault(
                key,
                new LoginAttemptInfo(0, null)
        );

        info.incrementFailedAttempts();

        if (info.getFailedAttempts() >= MAX_FAILED_ATTEMPTS) {
            info.setBlockedUntil(LocalDateTime.now().plusMinutes(LOCK_MINUTES));
        }

        attempts.put(key, info);
    }

    private String buildKey(String email, String ip) {
        String normalizedEmail = email == null ? "unknown" : email.toLowerCase().trim();
        return normalizedEmail + ":" + ip;
    }

    private static class LoginAttemptInfo {
        private int failedAttempts;
        private LocalDateTime blockedUntil;

        public LoginAttemptInfo(int failedAttempts, LocalDateTime blockedUntil) {
            this.failedAttempts = failedAttempts;
            this.blockedUntil = blockedUntil;
        }

        public int getFailedAttempts() {
            return failedAttempts;
        }

        public void incrementFailedAttempts() {
            this.failedAttempts++;
        }

        public LocalDateTime getBlockedUntil() {
            return blockedUntil;
        }

        public void setBlockedUntil(LocalDateTime blockedUntil) {
            this.blockedUntil = blockedUntil;
        }
    }
}