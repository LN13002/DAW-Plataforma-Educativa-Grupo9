package com.aprende.ues.backend.exceptions;

import com.aprende.ues.backend.dto.ErrorDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.ArrayList;
import java.util.List;

@RestControllerAdvice
public class RestExceptionHandler {

    // CERTIFICATE
    @ExceptionHandler(CertificateNotFoundException.class)
    public ResponseEntity<ErrorDTO> handleException(CertificateNotFoundException e) {
        ErrorDTO error = new ErrorDTO("certificate-not-found", e.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @ExceptionHandler(CertificateCodeAlreadyExistsException.class)
    public ResponseEntity<ErrorDTO> handleException(CertificateCodeAlreadyExistsException e) {
        ErrorDTO error = new ErrorDTO("certificate-code-already-exists", e.getMessage());
        return ResponseEntity.badRequest().body(error);
    }

    // ENROLLMENT
    @ExceptionHandler(EnrollmentNotFoundException.class)
    public ResponseEntity<ErrorDTO> handleException(EnrollmentNotFoundException e) {
        ErrorDTO error = new ErrorDTO("enrollment-not-found", e.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @ExceptionHandler(EnrollmentAlreadyCertifiedException.class)
    public ResponseEntity<ErrorDTO> handleException(EnrollmentAlreadyCertifiedException e) {
        ErrorDTO error = new ErrorDTO("enrollment-already-certified", e.getMessage());
        return ResponseEntity.badRequest().body(error);
    }

    // VALIDATION: It will display a list of errors for fields that do not comply with the validation constraints
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<List<ErrorDTO>> handleException(MethodArgumentNotValidException e) {
        List<ErrorDTO> errors = new ArrayList<>();

        // We use a forEach to iterate through the FieldErrors list
        e.getBindingResult().getFieldErrors().forEach((FieldError fieldError) ->
                // we build the error message with a field name and the description
                errors.add(new ErrorDTO(fieldError.getField(), fieldError.getDefaultMessage()))
        );
        return ResponseEntity.badRequest().body(errors);
    }

    // FALLBACK
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorDTO> handleException(Exception e) {
        ErrorDTO error = new ErrorDTO("unknown-error", e.getMessage());
        return ResponseEntity.internalServerError().body(error);
    }
}
