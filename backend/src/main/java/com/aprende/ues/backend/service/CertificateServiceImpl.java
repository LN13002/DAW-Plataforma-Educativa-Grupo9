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
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.UncheckedIOException;
import java.math.BigDecimal;
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

        try (PDDocument document = new PDDocument();
             ByteArrayOutputStream output = new ByteArrayOutputStream()) {
            PDRectangle pageSize = new PDRectangle(PDRectangle.LETTER.getHeight(), PDRectangle.LETTER.getWidth());
            PDPage page = new PDPage(pageSize);
            document.addPage(page);

            try (PDPageContentStream content = new PDPageContentStream(document, page)) {
                drawCertificate(document, content, pageSize, studentName, courseTitle, issuedAt, certificate.getCode());
            }

            document.save(output);
            return output.toByteArray();
        } catch (IOException ex) {
            throw new UncheckedIOException("No se pudo generar el PDF del certificado", ex);
        }
    }

    private void drawCertificate(
            PDDocument document,
            PDPageContentStream content,
            PDRectangle pageSize,
            String studentName,
            String courseTitle,
            String issuedAt,
            String certificateCode
    ) throws IOException {
        float width = pageSize.getWidth();
        float height = pageSize.getHeight();
        float margin = 28;
        PDType1Font regular = new PDType1Font(Standard14Fonts.FontName.TIMES_ROMAN);
        PDType1Font bold = new PDType1Font(Standard14Fonts.FontName.TIMES_BOLD);
        PDType1Font italic = new PDType1Font(Standard14Fonts.FontName.TIMES_ITALIC);
        PDType1Font sans = new PDType1Font(Standard14Fonts.FontName.HELVETICA);
        PDType1Font sansBold = new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD);

        content.setNonStrokingColor(new Color(255, 253, 248));
        content.addRect(0, 0, width, height);
        content.fill();

        content.setStrokingColor(new Color(108, 22, 37));
        content.setLineWidth(3);
        content.addRect(margin, margin, width - (margin * 2), height - (margin * 2));
        content.stroke();
        content.setLineWidth(1.2f);
        content.addRect(margin + 12, margin + 12, width - ((margin + 12) * 2), height - ((margin + 12) * 2));
        content.stroke();

        content.setNonStrokingColor(new Color(95, 16, 32));
        drawSkewedBand(content, margin + 30, height - margin - 8, 250, 14, 30);
        drawSkewedBand(content, width - margin - 280, margin - 6, 250, 14, 30);

        content.setNonStrokingColor(new Color(248, 240, 236));
        drawCenteredText(content, "UES", sansBold, 152, width / 2, 220);

        drawLogo(document, content, width / 2, height - 64);

        content.setNonStrokingColor(new Color(33, 27, 27));
        drawCenteredText(content, "Universidad de El Salvador", bold, 26, width / 2, height - 182);
        drawCenteredText(content, "Aprende UES", bold, 17, width / 2, height - 207);
        drawCenteredText(content, "Por cuanto:", regular, 19, width / 2, height - 249);

        float studentSize = fitFontSize(studentName, bold, 36, 24, width - 170);
        drawCenteredText(content, studentName, bold, studentSize, width / 2, height - 295);
        drawLine(content, width / 2 - 260, height - 303, width / 2 + 260, height - 303, 33, 27, 27, 1);

        drawCenteredText(content, "ha finalizado el curso", italic, 21, width / 2, height - 353);

        content.setNonStrokingColor(new Color(108, 22, 37));
        List<String> courseLines = wrapText(courseTitle, bold, 28, width - 190);
        float courseY = height - 394;
        for (String line : courseLines) {
            drawCenteredText(content, line, bold, 28, width / 2, courseY);
            courseY -= 34;
        }

        content.setNonStrokingColor(new Color(33, 27, 27));
        drawCenteredText(content, "Por tanto, se extiende el presente certificado de finalizacion", regular, 15, width / 2, 164);
        drawCenteredText(content, "en Ciudad Universitaria, el " + issuedAt + ".", regular, 15, width / 2, 144);

        drawLine(content, 86, 86, 304, 86, 45, 41, 41, .8f);
        drawCenteredText(content, "Coordinacion academica", regular, 12, 195, 68);
        drawLine(content, width - 304, 86, width - 86, 86, 45, 41, 41, .8f);
        drawCenteredText(content, "Universidad de El Salvador", regular, 12, width - 195, 68);
        drawCenteredText(content, "Codigo de verificacion", sans, 10, width / 2, 82);
        drawCenteredText(content, certificateCode, sansBold, 11, width / 2, 66);
    }

    private void drawLogo(PDDocument document, PDPageContentStream content, float centerX, float topY) throws IOException {
        PDImageXObject logo = loadUesLogo(document);
        float logoWidth = 58;
        float logoHeight = logoWidth * logo.getHeight() / logo.getWidth();
        content.drawImage(logo, centerX - (logoWidth / 2), topY - logoHeight, logoWidth, logoHeight);
    }

    private PDImageXObject loadUesLogo(PDDocument document) throws IOException {
        try (InputStream input = getClass().getResourceAsStream("/assets/ues-logo.png")) {
            if (input == null) {
                throw new IOException("No se encontro el logo UES en /assets/ues-logo.png");
            }
            return PDImageXObject.createFromByteArray(document, input.readAllBytes(), "ues-logo");
        }
    }

    private void drawSkewedBand(PDPageContentStream content, float x, float y, float width, float height, float skew) throws IOException {
        content.moveTo(x, y);
        content.lineTo(x + width, y);
        content.lineTo(x + width - skew, y - height);
        content.lineTo(x - skew, y - height);
        content.closePath();
        content.fill();
    }

    private void drawLine(
            PDPageContentStream content,
            float startX,
            float startY,
            float endX,
            float endY,
            int red,
            int green,
            int blue,
            float width
    ) throws IOException {
        content.setStrokingColor(new Color(red, green, blue));
        content.setLineWidth(width);
        content.moveTo(startX, startY);
        content.lineTo(endX, endY);
        content.stroke();
    }

    private void drawCenteredText(
            PDPageContentStream content,
            String text,
            PDType1Font font,
            float fontSize,
            float centerX,
            float baselineY
    ) throws IOException {
        float textWidth = font.getStringWidth(pdfText(text)) / 1000 * fontSize;
        content.beginText();
        content.setFont(font, fontSize);
        content.newLineAtOffset(centerX - (textWidth / 2), baselineY);
        content.showText(pdfText(text));
        content.endText();
    }

    private float fitFontSize(String text, PDType1Font font, float preferred, float minimum, float maxWidth) throws IOException {
        float size = preferred;
        while (size > minimum && font.getStringWidth(pdfText(text)) / 1000 * size > maxWidth) {
            size -= 1;
        }
        return size;
    }

    private List<String> wrapText(String text, PDType1Font font, float fontSize, float maxWidth) throws IOException {
        String[] words = pdfText(text).split("\\s+");
        List<String> lines = new java.util.ArrayList<>();
        StringBuilder current = new StringBuilder();

        for (String word : words) {
            String candidate = current.isEmpty() ? word : current + " " + word;
            if (font.getStringWidth(candidate) / 1000 * fontSize <= maxWidth) {
                current = new StringBuilder(candidate);
            } else {
                if (!current.isEmpty()) {
                    lines.add(current.toString());
                }
                current = new StringBuilder(word);
            }
        }

        if (!current.isEmpty()) {
            lines.add(current.toString());
        }

        return lines.stream().limit(3).toList();
    }

    private String pdfText(String value) {
        if (value == null) return "";
        return value
                .replace("\r", " ")
                .replace("\n", " ")
                .replaceAll("\\s+", " ")
                .trim();
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

}
