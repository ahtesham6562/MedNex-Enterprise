package com.hospital.backend.repository;

import com.hospital.backend.model.Patient;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PatientRepository extends JpaRepository<Patient, Long> {

    Page<Patient> findByTenantId(String tenantId, Pageable pageable);

    Optional<Patient> findByIdAndTenantId(Long id, String tenantId);

    long countByTenantId(String tenantId);
}