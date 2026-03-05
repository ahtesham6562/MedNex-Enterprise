package com.hospital.backend.config;

import com.hospital.backend.service.CustomUserDetailsService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class SecurityConfig {

    private final CustomUserDetailsService userDetailsService;
    private final JwtAuthenticationFilter jwtFilter;

    public SecurityConfig(CustomUserDetailsService userDetailsService,
                          JwtAuthenticationFilter jwtFilter) {
        this.userDetailsService = userDetailsService;
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth

                        // Auth endpoints
                        .requestMatchers("/api/auth/**").permitAll()

                        // Patient APIs
                        .requestMatchers(HttpMethod.GET, "/api/patients/**")
                        .hasAnyRole("ADMIN","DOCTOR","NURSE")

                        .requestMatchers(HttpMethod.POST, "/api/patients/**")
                        .hasAnyRole("ADMIN","DOCTOR")

                        .requestMatchers(HttpMethod.PUT, "/api/patients/**")
                        .hasAnyRole("ADMIN","DOCTOR")

                        .requestMatchers(HttpMethod.DELETE, "/api/patients/**")
                        .hasRole("ADMIN")

                        .requestMatchers("/test/**").permitAll()

                        // fallback
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtFilter,
                        UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}