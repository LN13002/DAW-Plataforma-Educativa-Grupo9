package com.aprende.ues.backend.exceptions;

public class ReviewNotFoundException extends RuntimeException {

    public ReviewNotFoundException(String id) {
        super("Review not found with id: " + id);
    }
}
