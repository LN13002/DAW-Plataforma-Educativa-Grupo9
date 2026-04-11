package com.aprende.ues.backend.exceptions;

public class EnrollmentNotFoundException extends RuntimeException {
    public EnrollmentNotFoundException(String id) {
        super("Enrollment not found with id: " + id);
    }
}