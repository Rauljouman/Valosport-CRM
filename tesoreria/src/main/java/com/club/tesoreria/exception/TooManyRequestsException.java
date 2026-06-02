package com.club.tesoreria.exception;

public class TooManyRequestsException extends RuntimeException {

    public TooManyRequestsException(String message) {
        super(message);
    }
}