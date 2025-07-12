package com.escuelaposgrado.Matricula.controller;

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
 * Controlador para verificación de salud del microservicio
 */
@Tag(name = "🏥 Health Check", description = "Endpoints para verificar el estado del microservicio")
@RestController
@RequestMapping("/health")
public class HealthController {

    @Operation(
        summary = "🩺 Verificar estado del servicio",
        description = "Endpoint público para verificar que el microservicio de matrícula está funcionando correctamente"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Servicio funcionando correctamente")
    })
    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getStatus() {
        Map<String, Object> status = new HashMap<>();
        status.put("service", "Microservicio de Matrícula");
        status.put("status", "UP");
        status.put("timestamp", LocalDateTime.now());
        status.put("version", "1.0.0");
        status.put("description", "Sistema de gestión de matrícula para la Escuela de Posgrado UNICA");
        
        return ResponseEntity.ok(status);
    }

    @Operation(
        summary = "📊 Información detallada del servicio",
        description = "Proporciona información detallada sobre el microservicio y sus capacidades"
    )
    @GetMapping("/info")
    public ResponseEntity<Map<String, Object>> getInfo() {
        Map<String, Object> info = new HashMap<>();
        info.put("service", "Microservicio de Matrícula");
        info.put("version", "1.0.0");
        info.put("description", "Gestión completa del proceso de matrícula académica");
        info.put("port", 8082);
        info.put("database", "PostgreSQL - Schema: matricula");
        
        Map<String, String> features = new HashMap<>();
        features.put("periodos-academicos", "Gestión de períodos académicos");
        features.put("sedes-aulas", "Administración de sedes y aulas");
        features.put("facultades", "Gestión de facultades");
        features.put("programas-estudio", "Administración de programas de estudio");
        features.put("menciones", "Gestión de menciones por programa");
        features.put("tasas-pago", "Configuración de tasas de pago");
        features.put("comisiones", "Registro de comisiones de posgrado");
        features.put("turnos-matricula", "Definición de turnos de matrícula");
        
        info.put("features", features);
        info.put("swagger-ui", "http://localhost:8082/swagger-ui.html");
        info.put("timestamp", LocalDateTime.now());
        
        return ResponseEntity.ok(info);
    }
}
