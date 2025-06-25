package com.escuelaposgrado.Autenticacion.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.escuelaposgrado.Autenticacion.dto.response.MessageResponse;
import com.escuelaposgrado.Autenticacion.dto.response.UsuarioResponse;
import com.escuelaposgrado.Autenticacion.model.enums.Role;
import com.escuelaposgrado.Autenticacion.service.AuthService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

/**
 * Controlador REST para operaciones de docentes
 */
@Tag(name = "👨‍🏫 Docentes", description = "Endpoints específicos para docentes")
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/docente")
@PreAuthorize("hasAnyRole('DOCENTE', 'COORDINADOR', 'ADMIN')")
public class DocenteController {

    @Autowired
    private AuthService authService;

    /**
     * Obtener perfil del docente actual
     */
    @Operation(
            summary = "Obtener perfil del docente",
            description = "Información del perfil del docente autenticado",
            security = @SecurityRequirement(name = "bearerAuth"),
            tags = {"👨‍🏫 Docentes"}
    )
    @GetMapping("/perfil")
    public ResponseEntity<UsuarioResponse> getPerfil(Authentication authentication) {
        try {
            UsuarioResponse response = authService.getCurrentUser(authentication.getName());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Obtener lista de alumnos (para docentes)
     */
    @GetMapping("/alumnos")
    public ResponseEntity<List<UsuarioResponse>> getAlumnos() {
        List<UsuarioResponse> alumnos = authService.getUsuariosByRole(Role.ALUMNO);
        return ResponseEntity.ok(alumnos);
    }

    /**
     * Obtener otros docentes
     */
    @GetMapping("/colegas")
    public ResponseEntity<List<UsuarioResponse>> getColegas() {
        List<UsuarioResponse> docentes = authService.getUsuariosByRole(Role.DOCENTE);
        return ResponseEntity.ok(docentes);
    }

    /**
     * Mensaje de bienvenida para docentes
     */
    @GetMapping("/bienvenida")
    public ResponseEntity<MessageResponse> getBienvenida(Authentication authentication) {
        try {
            UsuarioResponse usuario = authService.getCurrentUser(authentication.getName());
            String mensaje = String.format("Bienvenido/a, %s. Panel de Docente - Escuela de Posgrado UNICA", 
                                          usuario.getNombreCompleto());
            return ResponseEntity.ok(new MessageResponse(mensaje));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error al obtener información del usuario", false));
        }
    }
}
