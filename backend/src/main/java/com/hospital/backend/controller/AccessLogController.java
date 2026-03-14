package com.hospital.backend.controller;

import com.hospital.backend.model.AccessLog;
import com.hospital.backend.service.AccessLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/access-logs")
@RequiredArgsConstructor
public class AccessLogController {

    private final AccessLogService accessLogService;

    @GetMapping
    public ResponseEntity<List<AccessLog>> getLogs() {
        return ResponseEntity.ok(accessLogService.getAllLogs());
    }
}