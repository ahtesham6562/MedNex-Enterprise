package com.hospital.backend.service;

import com.hospital.backend.model.AccessLog;
import com.hospital.backend.repository.AccessLogRepository;
import com.hospital.backend.tenant.TenantContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AccessLogService {

    private final AccessLogRepository accessLogRepository;

    public void log(String username, String action, String resourceType, String resourceId, String ipAddress) {
        AccessLog log = new AccessLog();
        log.setUsername(username);
        log.setAction(action);
        log.setResourceType(resourceType);
        log.setResourceId(resourceId);
        log.setAccessedAt(LocalDateTime.now());
        log.setTenantId(TenantContext.getTenant());
        log.setIpAddress(ipAddress);
        accessLogRepository.save(log);
    }

    public List<AccessLog> getAllLogs() {
        return accessLogRepository.findByTenantIdOrderByAccessedAtDesc(TenantContext.getTenant());
    }
}