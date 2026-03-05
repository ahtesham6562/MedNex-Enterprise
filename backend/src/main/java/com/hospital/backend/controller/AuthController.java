package com.hospital.backend.controller;

import com.hospital.backend.config.JwtUtil;
import com.hospital.backend.dto.LoginRequest;
import com.hospital.backend.model.User;
import com.hospital.backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    public AuthController(AuthenticationManager authenticationManager,
                          JwtUtil jwtUtil,
                          UserRepository userRepository) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody LoginRequest request) {

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUsername(),
                            request.getPassword()
                    )
            );
        }
        catch (BadCredentialsException e) {
            throw new RuntimeException("Invalid username or password");
        }

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRole() == null)
            throw new RuntimeException("User role not set in DB");

        if (user.getTenantId() == null)
            throw new RuntimeException("Tenant not assigned to user");

        String token = jwtUtil.generateToken(
                user.getUsername(),
                user.getRole().name(),
                user.getTenantId()
        );

        // ✅ JSON response
        return ResponseEntity.ok(Map.of(
                "token", token,
                "username", user.getUsername(),
                "role", user.getRole().name(),
                "tenant", user.getTenantId()
        ));
    }
}