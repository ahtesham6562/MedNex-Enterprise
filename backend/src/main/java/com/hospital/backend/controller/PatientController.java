package com.hospital.backend.controller;

import com.hospital.backend.model.Patient;
import com.hospital.backend.service.PatientService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/patients")
@CrossOrigin
public class PatientController {

    private final PatientService patientService;

    public PatientController(PatientService patientService) {
        this.patientService = patientService;
    }

    // ==============================
    // HELPER METHOD
    // ==============================
    private String getTenant(HttpServletRequest request) {
        String tenant = (String) request.getAttribute("tenant");

        if (tenant == null) {
            throw new RuntimeException("Tenant not found in JWT");
        }
        return tenant;
    }

    // ==============================
    // CREATE PATIENT
    // ==============================
    @PostMapping
    public ResponseEntity<Patient> createPatient(
            @Valid @RequestBody Patient patient,
            HttpServletRequest request) {

        String tenant = getTenant(request);

        patient.setTenantId(tenant);

        return ResponseEntity.ok(
                patientService.savePatient(patient)
        );
    }

    // ==============================
    // GET ALL
    // ==============================
    @GetMapping
    public ResponseEntity<Page<Patient>> getAllPatients(
            Pageable pageable,
            HttpServletRequest request) {

        String tenant = getTenant(request);

        return ResponseEntity.ok(
                patientService.getPatientsByTenant(tenant, pageable)
        );
    }

    // ==============================
    // GET BY ID
    // ==============================
    @GetMapping("/{id}")
    public ResponseEntity<Patient> getPatientById(
            @PathVariable Long id,
            HttpServletRequest request) {

        String tenant = getTenant(request);

        return ResponseEntity.ok(
                patientService.getPatientByIdAndTenant(id, tenant)
        );
    }

    // ==============================
    // UPDATE
    // ==============================
    @PutMapping("/{id}")
    public ResponseEntity<Patient> updatePatient(
            @PathVariable Long id,
            @RequestBody Patient patient,
            HttpServletRequest request) {

        String tenant = getTenant(request);

        return ResponseEntity.ok(
                patientService.updatePatient(id, patient, tenant)
        );
    }

    // ==============================
    // DELETE
    // ==============================
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePatient(
            @PathVariable Long id,
            HttpServletRequest request) {

        String tenant = getTenant(request);

        patientService.deletePatient(id, tenant);

        return ResponseEntity.noContent().build();
    }
}