package com.aprende.ues.backend.service;

import com.aprende.ues.backend.dto.CertificateRequestDTO;
import com.aprende.ues.backend.dto.CertificateResponseDTO;

import java.util.List;
import java.util.UUID;

public interface CertificateService {

    // Actions that a certificate is able to perform
    List<CertificateResponseDTO> getAll();
    CertificateResponseDTO getById(UUID id);
    CertificateResponseDTO create(CertificateRequestDTO requestDTO);
    CertificateResponseDTO update(UUID id, CertificateRequestDTO requestDTO);
    void delete(UUID id);
    byte[] generateDocument(UUID id);

}
