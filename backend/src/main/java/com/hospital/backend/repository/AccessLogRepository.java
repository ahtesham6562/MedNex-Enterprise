package com.hospital.backend.repository;

import com.hospital.backend.model.AccessLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AccessLogRepository extends JpaRepository<AccessLog, Long> {
    List<AccessLog> findByTenantIdOrderByAccessedAtDesc(String tenantId);
}