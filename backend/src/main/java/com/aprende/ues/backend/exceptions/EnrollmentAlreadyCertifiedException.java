package com.aprende.ues.backend.exceptions;

public class EnrollmentAlreadyCertifiedException extends RuntimeException {
    public EnrollmentAlreadyCertifiedException(String enrollmentId) {
        super("The enrollment " + enrollmentId + " already has an issued certificate");
    }
}
