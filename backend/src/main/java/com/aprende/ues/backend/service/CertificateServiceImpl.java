package com.aprende.ues.backend.service;

import com.aprende.ues.backend.dto.CertificateRequestDTO;
import com.aprende.ues.backend.dto.CertificateResponseDTO;
import com.aprende.ues.backend.exceptions.CertificateCodeAlreadyExistsException;
import com.aprende.ues.backend.exceptions.CertificateEligibilityException;
import com.aprende.ues.backend.exceptions.CertificateNotFoundException;
import com.aprende.ues.backend.exceptions.EnrollmentAlreadyCertifiedException;
import com.aprende.ues.backend.exceptions.EnrollmentNotFoundException;
import com.aprende.ues.backend.model.Certificate;
import com.aprende.ues.backend.model.Enrollment;
import com.aprende.ues.backend.model.enums.EnrollmentStatus;
import com.aprende.ues.backend.repository.CertificateRepository;
import com.aprende.ues.backend.repository.EnrollmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.text.Normalizer;
import java.util.List;
import java.util.Locale;
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
        Enrollment enrollment = enrollmentRepository.findById(request.enrollmentId())
                .orElseThrow(() -> new EnrollmentNotFoundException(
                        request.enrollmentId().toString()));

        validateEnrollmentCanBeCertified(enrollment);

        // 2. The enrollment must not already have a certificate (1-to-1 relationship)
        if (certificateRepository.existsByEnrollmentId(request.enrollmentId())) {
            throw new EnrollmentAlreadyCertifiedException(request.enrollmentId().toString());
        }

        String code = hasText(request.code()) ? request.code().trim() : generateCertificateCode(enrollment);

        // 3. The code must be unique
        if (certificateRepository.existsByCode(code)) {
            throw new CertificateCodeAlreadyExistsException(code);
        }

        Certificate certificate = new Certificate();
        certificate.setEnrollment(enrollment);
        certificate.setCode(code);

        Certificate saved = certificateRepository.save(certificate);
        saved.setPdfUrl(hasText(request.pdfUrl()) ? request.pdfUrl().trim() : "/api/certificates/" + saved.getId() + "/download");

        return toResponseDTO(certificateRepository.save(saved));
    }

    @Override
    @Transactional
    public CertificateResponseDTO update(UUID id, CertificateRequestDTO request) {

        Certificate certificate = certificateRepository.findById(id)
                .orElseThrow(() -> new CertificateNotFoundException(id.toString()));

        // If the code changes, verify that the new one is not already used by another certificate
        String code = hasText(request.code()) ? request.code().trim() : certificate.getCode();
        boolean codeChanged = !certificate.getCode().equals(code);
        if (codeChanged && certificateRepository.existsByCode(code)) {
            throw new CertificateCodeAlreadyExistsException(code);
        }

        certificate.setCode(code);
        certificate.setPdfUrl(hasText(request.pdfUrl()) ? request.pdfUrl().trim() : "/api/certificates/" + certificate.getId() + "/download");
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

    @Override
    @Transactional(readOnly = true)
    public byte[] generateDocument(UUID id) {
        Certificate certificate = certificateRepository.findById(id)
                .orElseThrow(() -> new CertificateNotFoundException(id.toString()));
        Enrollment enrollment = certificate.getEnrollment();
        String studentName = fullName(enrollment);
        String courseTitle = enrollment.getCourse().getTitle();
        String issuedAt = certificate.getIssuedAt().toLocalDate().toString();

        String html = """
                <!doctype html>
                <html lang="es">
                <head>
                  <meta charset="utf-8">
                  <title>Certificado %s</title>
                  <style>
                    body { font-family: Arial, sans-serif; margin: 0; color: #2b2b2b; }
                    .certificate { min-height: 720px; border: 18px solid #7a0000; margin: 32px; padding: 52px; text-align: center; }
                    .brand { color: #7a0000; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; }
                    h1 { color: #7a0000; font-size: 48px; margin: 32px 0 12px; }
                    h2 { font-size: 34px; margin: 20px 0; }
                    p { font-size: 20px; line-height: 1.6; }
                    .code { margin-top: 42px; font-size: 14px; color: #555; }
                  </style>
                </head>
                <body>
                  <section class="certificate">
                    <div class="brand">AprendeUES · Universidad de El Salvador</div>
                    <h1>Certificado de finalización</h1>
                    <p>Se certifica que</p>
                    <h2>%s</h2>
                    <p>completó satisfactoriamente el curso</p>
                    <h2>%s</h2>
                    <p>Emitido el %s</p>
                    <p class="code">Código de verificación: %s</p>
                  </section>
                </body>
                </html>
                """.formatted(
                escapeHtml(certificate.getCode()),
                escapeHtml(studentName),
                escapeHtml(courseTitle),
                escapeHtml(issuedAt),
                escapeHtml(certificate.getCode())
        );

        return html.getBytes(StandardCharsets.UTF_8);
    }

    // Mapper
    private CertificateResponseDTO toResponseDTO(Certificate certificate) {
        Enrollment enrollment = certificate.getEnrollment();
        return new CertificateResponseDTO(
                certificate.getId(),
                enrollment.getId(),
                fullName(enrollment),
                enrollment.getCourse().getTitle(),
                certificate.getCode(),
                certificate.getPdfUrl(),
                certificate.getIssuedAt()
        );
    }

    private void validateEnrollmentCanBeCertified(Enrollment enrollment) {
        boolean completedStatus = enrollment.getStatus() == EnrollmentStatus.completed;
        boolean completedProgress = enrollment.getProgress() != null
                && enrollment.getProgress().compareTo(BigDecimal.valueOf(100)) >= 0;

        if (!completedStatus || !completedProgress) {
            throw new CertificateEligibilityException(
                    "Solo se puede emitir certificado para una inscripción completada al 100%");
        }
    }

    private String generateCertificateCode(Enrollment enrollment) {
        String course = slug(enrollment.getCourse().getTitle(), 12);
        String initials = initials(enrollment);
        String suffix = enrollment.getId().toString().replace("-", "").substring(0, 6).toUpperCase(Locale.ROOT);
        return "CERT-" + course + "-" + certificateYear(enrollment) + "-" + initials + "-" + suffix;
    }

    private String certificateYear(Enrollment enrollment) {
        if (enrollment.getCompletedAt() != null) return String.valueOf(enrollment.getCompletedAt().getYear());
        return String.valueOf(java.time.OffsetDateTime.now().getYear());
    }

    private String slug(String value, int maxLength) {
        String normalized = Normalizer.normalize(value == null ? "CURSO" : value, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .replaceAll("[^A-Za-z0-9]+", "")
                .toUpperCase(Locale.ROOT);
        if (normalized.isBlank()) return "CURSO";
        return normalized.substring(0, Math.min(maxLength, normalized.length()));
    }

    private String initials(Enrollment enrollment) {
        String first = enrollment.getUser().getFirstName();
        String last = enrollment.getUser().getLastName();
        String firstInitial = hasText(first) ? first.substring(0, 1) : "U";
        String lastInitial = hasText(last) ? last.substring(0, 1) : "E";
        return (firstInitial + lastInitial).toUpperCase(Locale.ROOT);
    }

    private String fullName(Enrollment enrollment) {
        return (enrollment.getUser().getFirstName() + " " + enrollment.getUser().getLastName()).trim();
    }

    private boolean hasText(String value) {
        return value != null && !value.trim().isEmpty();
    }

    private String escapeHtml(String value) {
        if (value == null) return "";
        return value
                .replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&#39;");
    }
}
