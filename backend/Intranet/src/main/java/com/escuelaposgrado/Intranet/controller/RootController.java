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
 * Controlador raíz para información básica de la API de Intranet
 */
@Tag(name = "🏠 API Info", description = "Información general de la API de Intranet")
@RestController
@RequestMapping("/")
public class RootController {

    @Operation(
        summary = "📋 Información de la API",
        description = "Endpoint público que proporciona información básica sobre la API de Intranet"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Información obtenida correctamente")
    })
    @GetMapping
    public ResponseEntity<Map<String, Object>> getApiInfo() {
        Map<String, Object> apiInfo = new HashMap<>();
        apiInfo.put("name", "API Intranet - Escuela de Posgrado UNICA");
        apiInfo.put("version", "1.0.0");
        apiInfo.put("description", "API REST para el sistema de intranet académica");
        apiInfo.put("timestamp", LocalDateTime.now());
        apiInfo.put("port", 8081);
        apiInfo.put("status", "running");
        
        Map<String, String> links = new HashMap<>();
        links.put("health", "/health/status");
        links.put("info", "/health/info");
        links.put("ping", "/health/ping");
        links.put("swagger", "/swagger-ui.html");
        links.put("api-docs", "/v3/api-docs");
        
        apiInfo.put("_links", links);
        
        Map<String, String> endpoints = new HashMap<>();
        endpoints.put("authentication", "/api/auth");
        endpoints.put("users", "/api/usuarios");
        endpoints.put("attendance", "/api/asistencias");
        endpoints.put("grades", "/api/calificaciones");
        endpoints.put("surveys", "/api/encuestas");
        
        apiInfo.put("main_endpoints", endpoints);
        
        return ResponseEntity.ok(apiInfo);
    }
}
