package com.aprende.ues.backend.service;

import com.aprende.ues.backend.dto.CertificateRequestDTO;
import com.aprende.ues.backend.dto.CertificateResponseDTO;
import com.aprende.ues.backend.model.Certificate;
import com.aprende.ues.backend.repository.CertificateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CertificateServiceImpl implements CertificateService {

    private final CertificateRepository certificateRepository;
    //private final EnrollmentRepository enrollmentRepository;

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
                .orElseThrow(() -> new RuntimeException(
                        "The certificate with id: " + id + " was not found"));

        return toResponseDTO(certificate);
    }

    @Override
    @Transactional
    public CertificateResponseDTO create(CertificateRequestDTO request) {

        // 1. The enrollment must exist
        var enrollment = enrollmentRepository.findById(request.enrollmentId())
                .orElseThrow(() -> new RuntimeException(
                        "Enrollment with id: " + request.enrollmentId() + " was not found"));

        // 2. The enrollment must not already have a certificate (1-to-1 relationship)
        if (certificateRepository.existsByEnrollmentId(request.enrollmentId())) {
            throw new RuntimeException(
                    "The enrollment already has an issued certificate: " + request.enrollmentId());
        }

        // 3. The code must be unique
        if (certificateRepository.existsByCode(request.code())) {
            throw new RuntimeException(
                    "A certificate with the code already exists: " + request.code());
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
                .orElseThrow(() -> new RuntimeException(
                        "Certificate not found with id: " + id));

        // If the code changes, verify that the new one is not already used by another certificate
        boolean codeChanged = !certificate.getCode().equals(request.code());
        if (codeChanged && certificateRepository.existsByCode(request.code())) {
            throw new RuntimeException(
                    "A certificate with the code already exists: " + request.code());
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
            throw new RuntimeException(
                    "Certificate not found with id: " + id);
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