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

import io.swagger.v3.oas.annotations.tags.Tag;

/**
 * Controlador REST para operaciones de coordinadores
 */
@Tag(name = "👨‍💼 Coordinadores", description = "Endpoints específicos para coordinadores académicos")
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/coordinador")
@PreAuthorize("hasAnyRole('COORDINADOR', 'ADMIN')")
public class CoordinadorController {

    @Autowired
    private AuthService authService;

    /**
     * Obtener perfil del coordinador actual
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
     * Obtener todos los docentes
     */
    @GetMapping("/docentes")
    public ResponseEntity<List<UsuarioResponse>> getDocentes() {
        List<UsuarioResponse> docentes = authService.getUsuariosByRole(Role.DOCENTE);
        return ResponseEntity.ok(docentes);
    }

    /**
     * Obtener todos los alumnos
     */
    @GetMapping("/alumnos")
    public ResponseEntity<List<UsuarioResponse>> getAlumnos() {
        List<UsuarioResponse> alumnos = authService.getUsuariosByRole(Role.ALUMNO);
        return ResponseEntity.ok(alumnos);
    }

    /**
     * Obtener todos los postulantes
     */
    @GetMapping("/postulantes")
    public ResponseEntity<List<UsuarioResponse>> getPostulantes() {
        List<UsuarioResponse> postulantes = authService.getUsuariosByRole(Role.POSTULANTE);
        return ResponseEntity.ok(postulantes);
    }

    /**
     * Obtener otros coordinadores
     */
    @GetMapping("/coordinadores")
    public ResponseEntity<List<UsuarioResponse>> getCoordinadores() {
        List<UsuarioResponse> coordinadores = authService.getUsuariosByRole(Role.COORDINADOR);
        return ResponseEntity.ok(coordinadores);
    }

    /**
     * Mensaje de bienvenida para coordinadores
     */
    @GetMapping("/bienvenida")
    public ResponseEntity<MessageResponse> getBienvenida(Authentication authentication) {
        try {
            UsuarioResponse usuario = authService.getCurrentUser(authentication.getName());
            String mensaje = String.format("Bienvenido/a, %s. Panel de Coordinación Académica - Escuela de Posgrado UNICA", 
                                          usuario.getNombreCompleto());
            return ResponseEntity.ok(new MessageResponse(mensaje));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error al obtener información del usuario", false));
        }
    }

    /**
     * Obtener resumen de usuarios para coordinación
     */
    @GetMapping("/resumen")
    public ResponseEntity<MessageResponse> getResumen() {
        MessageResponse estadisticas = authService.getEstadisticas();
        return ResponseEntity.ok(new MessageResponse("Resumen académico: " + estadisticas.getMessage()));
    }
}
