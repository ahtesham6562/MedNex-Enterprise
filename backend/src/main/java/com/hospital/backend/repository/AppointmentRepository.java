package com.hospital.backend.repository;

import com.hospital.backend.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    List<Appointment> findByTenantId(String tenantId);

    boolean existsByDoctorNameAndAppointmentDateTimeBetweenAndTenantId(
        String doctorName,
        LocalDateTime start,
        LocalDateTime end,
        String tenantId
    );
}
