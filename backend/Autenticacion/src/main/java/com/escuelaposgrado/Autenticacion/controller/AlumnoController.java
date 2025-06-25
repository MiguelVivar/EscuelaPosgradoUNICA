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

/**
 * Controlador REST para operaciones de alumnos
 */
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/alumno")
@PreAuthorize("hasAnyRole('ALUMNO', 'ADMIN')")
public class AlumnoController {

    @Autowired
    private AuthService authService;

    /**
     * Obtener perfil del alumno actual
     */
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
     * Obtener lista de docentes (para alumnos)
     */
    @GetMapping("/docentes")
    public ResponseEntity<List<UsuarioResponse>> getDocentes() {
        List<UsuarioResponse> docentes = authService.getUsuariosByRole(Role.DOCENTE);
        return ResponseEntity.ok(docentes);
    }

    /**
     * Obtener compañeros de estudios
     */
    @GetMapping("/companeros")
    public ResponseEntity<List<UsuarioResponse>> getCompaneros() {
        List<UsuarioResponse> alumnos = authService.getUsuariosByRole(Role.ALUMNO);
        return ResponseEntity.ok(alumnos);
    }

    /**
     * Mensaje de bienvenida para alumnos
     */
    @GetMapping("/bienvenida")
    public ResponseEntity<MessageResponse> getBienvenida(Authentication authentication) {
        try {
            UsuarioResponse usuario = authService.getCurrentUser(authentication.getName());
            String mensaje = String.format("Bienvenido/a, %s. Portal del Estudiante - Escuela de Posgrado UNICA", 
                                          usuario.getNombreCompleto());
            return ResponseEntity.ok(new MessageResponse(mensaje));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error al obtener información del usuario", false));
        }
    }

    /**
     * Información del código de estudiante
     */
    @GetMapping("/codigo")
    public ResponseEntity<MessageResponse> getCodigoEstudiante(Authentication authentication) {
        try {
            UsuarioResponse usuario = authService.getCurrentUser(authentication.getName());
            String mensaje = "Código de estudiante: " + 
                           (usuario.getCodigoEstudiante() != null ? usuario.getCodigoEstudiante() : "No asignado");
            return ResponseEntity.ok(new MessageResponse(mensaje));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error al obtener código de estudiante", false));
        }
    }
}
