package com.club.tesoreria.exception;

public class AccountTemporarilyLockedException extends RuntimeException {

    public AccountTemporarilyLockedException(String message) {
        super(message);
    }
}