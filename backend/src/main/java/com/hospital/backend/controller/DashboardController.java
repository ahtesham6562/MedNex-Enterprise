package com.hospital.backend.controller;

import com.hospital.backend.repository.AppointmentRepository;
import com.hospital.backend.repository.PatientRepository;
import com.hospital.backend.tenant.TenantContext;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final PatientRepository patientRepository;
    private final AppointmentRepository appointmentRepository;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        String tenant = TenantContext.getTenant();
        Map<String, Object> stats = new HashMap<>();

        stats.put("totalPatients", patientRepository.countByTenantId(tenant));
        stats.put("totalAppointments", appointmentRepository.countByTenantId(tenant));
        stats.put("scheduledAppointments", appointmentRepository.countByStatusAndTenantId("SCHEDULED", tenant));
        stats.put("cancelledAppointments", appointmentRepository.countByStatusAndTenantId("CANCELLED", tenant));

        return ResponseEntity.ok(stats);
    }
}