package com.escuelaposgrado.Intranet.controller;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

/**
 * Controlador para verificación de salud del microservicio de Intranet
 */
@Tag(name = "🏥 Health Check", description = "Endpoints para verificar el estado del microservicio de Intranet")
@RestController
@RequestMapping("/health")
public class HealthController {

    @Operation(
        summary = "🩺 Verificar estado del servicio",
        description = "Endpoint público para verificar que el microservicio de Intranet está funcionando correctamente"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Servicio funcionando correctamente")
    })
    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getStatus() {
        Map<String, Object> status = new HashMap<>();
        status.put("service", "Microservicio de Intranet");
        status.put("status", "UP");
        status.put("timestamp", LocalDateTime.now());
        status.put("version", "1.0.0");
        status.put("description", "Sistema de intranet para la Escuela de Posgrado UNICA");
        status.put("port", 8081);
        status.put("endpoints", new String[]{
            "/api/auth", "/api/usuarios", "/api/asistencias", 
            "/api/calificaciones", "/api/encuestas", "/health"
        });
        
        return ResponseEntity.ok(status);
    }

    @Operation(
        summary = "📊 Información detallada del servicio",
        description = "Proporciona información detallada sobre el microservicio de Intranet y sus capacidades"
    )
    @GetMapping("/info")
    public ResponseEntity<Map<String, Object>> getInfo() {
        Map<String, Object> info = new HashMap<>();
        info.put("name", "Intranet Escuela de Posgrado UNICA");
        info.put("description", "Microservicio para gestión de intranet académica");
        info.put("version", "1.0.0");
        info.put("build-time", LocalDateTime.now());
        
        Map<String, Object> features = new HashMap<>();
        features.put("authentication", "JWT Token-based");
        features.put("database", "PostgreSQL");
        features.put("security", "Spring Security");
        features.put("documentation", "Swagger/OpenAPI 3");
        
        info.put("features", features);
        
        Map<String, Object> endpoints = new HashMap<>();
        endpoints.put("auth", "/api/auth - Autenticación y autorización");
        endpoints.put("users", "/api/usuarios - Gestión de usuarios");
        endpoints.put("attendance", "/api/asistencias - Control de asistencia");
        endpoints.put("grades", "/api/calificaciones - Gestión de calificaciones");
        endpoints.put("surveys", "/api/encuestas - Sistema de encuestas");
        endpoints.put("health", "/health - Estado del servicio");
        endpoints.put("swagger", "/swagger-ui.html - Documentación API");
        
        info.put("endpoints", endpoints);
        
        return ResponseEntity.ok(info);
    }

    /**
     * Endpoint para verificar conectividad básica
     */
    @Operation(
        summary = "🔗 Test de conectividad",
        description = "Endpoint simple para verificar que el servicio responde"
    )
    @GetMapping("/ping")
    public ResponseEntity<Map<String, String>> ping() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "pong");
        response.put("service", "Intranet");
        response.put("timestamp", LocalDateTime.now().toString());
        return ResponseEntity.ok(response);
    }
}
