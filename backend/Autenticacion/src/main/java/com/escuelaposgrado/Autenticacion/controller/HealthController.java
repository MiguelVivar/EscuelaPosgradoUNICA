package com.escuelaposgrado.Autenticacion.controller;

import java.sql.Connection;
import java.util.HashMap;
import java.util.Map;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.info.BuildProperties;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.escuelaposgrado.Autenticacion.dto.response.MessageResponse;

/**
 * Controlador REST para health checks y información del servicio
 */
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/health")
public class HealthController {

    @Autowired
    private DataSource dataSource;

    @Autowired(required = false)
    private BuildProperties buildProperties;

    /**
     * Health check básico
     */
    @GetMapping("/status")
    public ResponseEntity<MessageResponse> getStatus() {
        return ResponseEntity.ok(new MessageResponse("Microservicio de Autenticación - ACTIVO"));
    }

    /**
     * Health check completo
     */
    @GetMapping("/check")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> health = new HashMap<>();
        
        try {
            // Verificar conexión a base de datos
            try (Connection connection = dataSource.getConnection()) {
                boolean isValid = connection.isValid(5);
                health.put("database", isValid ? "UP" : "DOWN");
            }
            
            // Información del servicio
            health.put("service", "Autenticación");
            health.put("status", "UP");
            health.put("timestamp", System.currentTimeMillis());
            
            // Información de build si está disponible
            if (buildProperties != null) {
                health.put("version", buildProperties.getVersion());
                health.put("buildTime", buildProperties.getTime());
            }
            
        } catch (Exception e) {
            health.put("status", "DOWN");
            health.put("error", e.getMessage());
            return ResponseEntity.status(503).body(health);
        }
        
        return ResponseEntity.ok(health);
    }

    /**
     * Información del servicio
     */
    @GetMapping("/info")
    public ResponseEntity<Map<String, Object>> getInfo() {
        Map<String, Object> info = new HashMap<>();
        
        info.put("name", "Microservicio de Autenticación");
        info.put("description", "Sistema de autenticación y autorización para la Escuela de Posgrado UNICA");
        info.put("version", "1.0.0");
        info.put("institution", "Universidad Nacional San Luis Gonzaga de Ica");
        info.put("java_version", System.getProperty("java.version"));
        info.put("spring_profiles", System.getProperty("spring.profiles.active", "default"));
        
        return ResponseEntity.ok(info);
    }
}
