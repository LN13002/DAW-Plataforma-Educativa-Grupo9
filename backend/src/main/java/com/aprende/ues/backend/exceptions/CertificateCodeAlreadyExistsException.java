package com.aprende.ues.backend.exceptions;

public class CertificateCodeAlreadyExistsException extends RuntimeException {
    public CertificateCodeAlreadyExistsException(String code) {
        super("A certificate with the code " + code + " already exists");
    }
}
