package com.aprende.ues.backend;

import com.aprende.ues.backend.model.Certificate;
import com.aprende.ues.backend.model.Course;
import com.aprende.ues.backend.model.Enrollment;
import com.aprende.ues.backend.model.User;
import com.aprende.ues.backend.repository.CertificateRepository;
import com.aprende.ues.backend.repository.EnrollmentRepository;
import com.aprende.ues.backend.service.CertificateServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.nio.charset.StandardCharsets;
import java.time.OffsetDateTime;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CertificateServiceTest {

    @Mock
    private CertificateRepository certificateRepository;

    @Mock
    private EnrollmentRepository enrollmentRepository;

    @InjectMocks
    private CertificateServiceImpl certificateService;

    @Test
    void generateDocument_returnsPdfBytes() {
        UUID certificateId = UUID.randomUUID();
        Certificate certificate = buildCertificate(certificateId);
        when(certificateRepository.findById(certificateId)).thenReturn(Optional.of(certificate));

        byte[] document = certificateService.generateDocument(certificateId);

        assertThat(document).isNotEmpty();
        assertThat(new String(document, 0, 4, StandardCharsets.US_ASCII)).isEqualTo("%PDF");
    }

    private Certificate buildCertificate(UUID id) {
        User user = new User();
        user.setFirstName("Ricardo Amed");
        user.setLastName("Guardado Hernandez");

        Course course = new Course();
        course.setTitle("Formacion en Prevencion de Riesgos Laborales");

        Enrollment enrollment = new Enrollment();
        enrollment.setUser(user);
        enrollment.setCourse(course);

        Certificate certificate = new Certificate();
        certificate.setId(id);
        certificate.setCode("CERT-RIESGOS-2026-RG-001");
        certificate.setIssuedAt(OffsetDateTime.parse("2026-06-03T12:00:00-06:00"));
        certificate.setEnrollment(enrollment);
        return certificate;
    }
}
