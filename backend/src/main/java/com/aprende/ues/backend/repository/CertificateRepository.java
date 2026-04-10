package com.aprende.ues.backend.repository;

import com.aprende.ues.backend.model.Certificate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface CertificateRepository extends JpaRepository<Certificate, UUID> {
    // Prevents issuing a second certificate for the same enrollment in ServiceImpl
    boolean existsByEnrollmentId(UUID enrollmentId);

    boolean existsByCode(String code);
}
