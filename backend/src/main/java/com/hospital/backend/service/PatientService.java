package com.hospital.backend.service;

import com.hospital.backend.exception.ResourceNotFoundException;
import com.hospital.backend.model.Patient;
import com.hospital.backend.repository.PatientRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class PatientService {

    private final PatientRepository patientRepository;

    public PatientService(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }

    // =====================================================
    // CREATE PATIENT
    // =====================================================
    public Patient savePatient(Patient patient) {
        return patientRepository.save(patient);
    }

    // =====================================================
    // GET ALL PATIENTS (Tenant Scoped + Pagination)
    // =====================================================
    public Page<Patient> getPatientsByTenant(String tenant, Pageable pageable) {

        if (tenant == null || tenant.isBlank()) {
            throw new RuntimeException("Tenant missing");
        }

        return patientRepository.findByTenantId(tenant, pageable);
    }

    // =====================================================
    // GET PATIENT BY ID (Tenant Safe)
    // =====================================================
    public Patient getPatientByIdAndTenant(Long id, String tenant) {

        return patientRepository.findByIdAndTenantId(id, tenant)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Patient not found with id " + id));
    }

    // =====================================================
    // UPDATE PATIENT (Partial Update + Tenant Safe)
    // =====================================================
    public Patient updatePatient(Long id,
                                 Patient updatedPatient,
                                 String tenant) {

        Patient existing =
                patientRepository.findByIdAndTenantId(id, tenant)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Patient not found with id " + id));

        // ===== Partial update logic =====

        if (updatedPatient.getFirstName() != null)
            existing.setFirstName(updatedPatient.getFirstName());

        if (updatedPatient.getLastName() != null)
            existing.setLastName(updatedPatient.getLastName());

        if (updatedPatient.getAge() != null)
            existing.setAge(updatedPatient.getAge());

        if (updatedPatient.getGender() != null)
            existing.setGender(updatedPatient.getGender());

        if (updatedPatient.getPhone() != null)
            existing.setPhone(updatedPatient.getPhone());

        if (updatedPatient.getEmail() != null)
            existing.setEmail(updatedPatient.getEmail());

        // ✅ JSONB medical history update
        if (updatedPatient.getMedicalHistory() != null)
            existing.setMedicalHistory(updatedPatient.getMedicalHistory());

        return patientRepository.save(existing);
    }

    // =====================================================
    // DELETE PATIENT (Tenant Safe)
    // =====================================================
    public void deletePatient(Long id, String tenant) {

        Patient patient =
                patientRepository.findByIdAndTenantId(id, tenant)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Patient not found with id " + id));

        patientRepository.delete(patient);
    }
}