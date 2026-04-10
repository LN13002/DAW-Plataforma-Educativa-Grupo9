package com.aprende.ues.backend.exceptions;

public class CertificateNotFoundException extends RuntimeException {
    public CertificateNotFoundException(String id) {
        super("Certificate not found with id: " + id);
    }
}
