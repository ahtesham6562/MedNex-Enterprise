package com.hospital.backend.service;

import com.hospital.backend.model.Appointment;
import com.hospital.backend.repository.AppointmentRepository;
import com.hospital.backend.tenant.TenantContext;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final JavaMailSender mailSender;

    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findByTenantId(TenantContext.getTenant());
    }

    public Appointment createAppointment(Appointment appointment) {
        appointment.setTenantId(TenantContext.getTenant());

        LocalDateTime start = appointment.getAppointmentDateTime().minusMinutes(29);
        LocalDateTime end = appointment.getAppointmentDateTime().plusMinutes(29);

        boolean conflict = appointmentRepository
                .existsByDoctorNameAndAppointmentDateTimeBetweenAndTenantId(
                        appointment.getDoctorName(), start, end, TenantContext.getTenant()
                );

        if (conflict) {
            throw new RuntimeException("Doctor is already booked at this time!");
        }

        appointment.setStatus("SCHEDULED");
        Appointment saved = appointmentRepository.save(appointment);
        sendConfirmationEmail(saved);
        return saved;
    }

    public Appointment updateStatus(Long id, String status) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        appointment.setStatus(status);
        return appointmentRepository.save(appointment);
    }

    public void deleteAppointment(Long id) {
        appointmentRepository.deleteById(id);
    }

    private void sendConfirmationEmail(Appointment appointment) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(appointment.getPatientEmail());
            message.setSubject("Appointment Confirmed - MedNex Enterprise");
            message.setText("Dear " + appointment.getPatientName() + ",\n\n" +
                    "Your appointment with Dr. " + appointment.getDoctorName() +
                    " is confirmed for " + appointment.getAppointmentDateTime() + ".\n\n" +
                    "Status: " + appointment.getStatus() + "\n\nThank you,\nMedNex Enterprise");
            mailSender.send(message);
        } catch (Exception e) {
            System.out.println("Email sending failed: " + e.getMessage());
        }
    }
}