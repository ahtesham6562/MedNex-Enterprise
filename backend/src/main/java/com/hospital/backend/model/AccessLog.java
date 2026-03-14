package com.hospital.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "access_logs")
public class AccessLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String username;

    @Column(nullable = false)
    private String action;

    @Column(nullable = false)
    private String resourceType;

    private String resourceId;

    @Column(nullable = false)
    private LocalDateTime accessedAt;

    @Column(nullable = false)
    private String tenantId;

    private String ipAddress;
}