package com.aprende.ues.backend.service;

import com.aprende.ues.backend.dto.CertificateRequestDTO;
import com.aprende.ues.backend.dto.CertificateResponseDTO;
import com.aprende.ues.backend.exceptions.CertificateCodeAlreadyExistsException;
import com.aprende.ues.backend.exceptions.CertificateNotFoundException;
import com.aprende.ues.backend.exceptions.EnrollmentAlreadyCertifiedException;
import com.aprende.ues.backend.exceptions.EnrollmentNotFoundException;
import com.aprende.ues.backend.model.Certificate;
import com.aprende.ues.backend.repository.CertificateRepository;
import com.aprende.ues.backend.repository.EnrollmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CertificateServiceImpl implements CertificateService {

    private final CertificateRepository certificateRepository;
    private final EnrollmentRepository enrollmentRepository;

    @Override
    @Transactional(readOnly = true)
    public List<CertificateResponseDTO> getAll() {
        return certificateRepository.findAll()
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public CertificateResponseDTO getById(UUID id) {
        Certificate certificate = certificateRepository.findById(id)
                .orElseThrow(() -> new CertificateNotFoundException(id.toString()));

        return toResponseDTO(certificate);
    }

    @Override
    @Transactional
    public CertificateResponseDTO create(CertificateRequestDTO request) {

        // 1. The enrollment must exist
        var enrollment = enrollmentRepository.findById(request.enrollmentId())
                .orElseThrow(() -> new EnrollmentNotFoundException(
                        request.enrollmentId().toString()));

        // 2. The enrollment must not already have a certificate (1-to-1 relationship)
        if (certificateRepository.existsByEnrollmentId(request.enrollmentId())) {
            throw new EnrollmentAlreadyCertifiedException(request.enrollmentId().toString());
        }

        // 3. The code must be unique
        if (certificateRepository.existsByCode(request.code())) {
            throw new CertificateCodeAlreadyExistsException(request.code());
        }

        Certificate certificate = new Certificate();
        certificate.setEnrollment(enrollment);
        certificate.setCode(request.code());
        certificate.setPdfUrl(request.pdfUrl());

        return toResponseDTO(certificateRepository.save(certificate));
    }

    @Override
    @Transactional
    public CertificateResponseDTO update(UUID id, CertificateRequestDTO request) {

        Certificate certificate = certificateRepository.findById(id)
                .orElseThrow(() -> new CertificateNotFoundException(id.toString()));

        // If the code changes, verify that the new one is not already used by another certificate
        boolean codeChanged = !certificate.getCode().equals(request.code());
        if (codeChanged && certificateRepository.existsByCode(request.code())) {
            throw new CertificateCodeAlreadyExistsException(request.code());
        }

        certificate.setCode(request.code());
        certificate.setPdfUrl(request.pdfUrl());
        // enrollment and issuedAt are immutable, do not modify them

        return toResponseDTO(certificateRepository.save(certificate));
    }

    @Override
    @Transactional
    public void delete(UUID id) {
        if (!certificateRepository.existsById(id)) {
            throw new CertificateNotFoundException(id.toString());
        }
        certificateRepository.deleteById(id);
    }

    // Mapper
    private CertificateResponseDTO toResponseDTO(Certificate certificate) {
        return new CertificateResponseDTO(
                certificate.getId(),
                certificate.getEnrollment().getId(),
                certificate.getCode(),
                certificate.getPdfUrl(),
                certificate.getIssuedAt()
        );
    }
}