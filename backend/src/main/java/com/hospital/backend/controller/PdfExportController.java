package com.hospital.backend.controller;

import com.hospital.backend.model.Patient;
import com.hospital.backend.repository.PatientRepository;
import com.hospital.backend.service.AccessLogService;
import com.hospital.backend.service.PdfExportService;
import com.hospital.backend.tenant.TenantContext;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/patients")
@RequiredArgsConstructor
public class PdfExportController {

    private final PatientRepository patientRepository;
    private final PdfExportService pdfExportService;
    private final AccessLogService accessLogService;

    @GetMapping("/{id}/export-pdf")
    public ResponseEntity<byte[]> exportPdf(@PathVariable Long id,
                                            Authentication authentication,
                                            jakarta.servlet.http.HttpServletRequest request) {
        Patient patient = patientRepository.findByIdAndTenantId(id, TenantContext.getTenant())
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        try {
            byte[] pdf = pdfExportService.generatePatientPdf(patient);

            accessLogService.log(
                    authentication.getName(),
                    "EXPORT_PDF",
                    "Patient",
                    String.valueOf(id),
                    request.getRemoteAddr()
            );

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "patient-" + id + ".pdf");

            return ResponseEntity.ok().headers(headers).body(pdf);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}