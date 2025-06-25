package com.escuelaposgrado.Autenticacion.controller;

import com.escuelaposgrado.Autenticacion.dto.response.MessageResponse;
import com.escuelaposgrado.Autenticacion.dto.response.UsuarioResponse;
import com.escuelaposgrado.Autenticacion.model.enums.Role;
import com.escuelaposgrado.Autenticacion.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador REST para operaciones de postulantes
 */
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/postulante")
@PreAuthorize("hasAnyRole('POSTULANTE', 'ADMIN')")
public class PostulanteController {

    @Autowired
    private AuthService authService;

    /**
     * Obtener perfil del postulante actual
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
     * Obtener información de docentes disponibles
     */
    @GetMapping("/docentes")
    public ResponseEntity<List<UsuarioResponse>> getDocentes() {
        List<UsuarioResponse> docentes = authService.getUsuariosByRole(Role.DOCENTE);
        return ResponseEntity.ok(docentes);
    }

    /**
     * Obtener información de coordinadores
     */
    @GetMapping("/coordinadores")
    public ResponseEntity<List<UsuarioResponse>> getCoordinadores() {
        List<UsuarioResponse> coordinadores = authService.getUsuariosByRole(Role.COORDINADOR);
        return ResponseEntity.ok(coordinadores);
    }

    /**
     * Mensaje de bienvenida para postulantes
     */
    @GetMapping("/bienvenida")
    public ResponseEntity<MessageResponse> getBienvenida(Authentication authentication) {
        try {
            UsuarioResponse usuario = authService.getCurrentUser(authentication.getName());
            String mensaje = String.format("Bienvenido/a, %s. Portal de Postulantes - Escuela de Posgrado UNICA", 
                                          usuario.getNombreCompleto());
            return ResponseEntity.ok(new MessageResponse(mensaje));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error al obtener información del usuario", false));
        }
    }

    /**
     * Información del programa de interés
     */
    @GetMapping("/programa-interes")
    public ResponseEntity<MessageResponse> getProgramaInteres(Authentication authentication) {
        try {
            UsuarioResponse usuario = authService.getCurrentUser(authentication.getName());
            String programa = usuario.getProgramaInteres();
            String mensaje = "Programa de interés: " + (programa != null ? programa : "No especificado");
            return ResponseEntity.ok(new MessageResponse(mensaje));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error al obtener programa de interés", false));
        }
    }

    /**
     * Estado de postulación
     */
    @GetMapping("/estado")
    public ResponseEntity<MessageResponse> getEstado(Authentication authentication) {
        try {
            UsuarioResponse usuario = authService.getCurrentUser(authentication.getName());
            String mensaje = String.format("Estado: Postulante activo. Código: %s", 
                                          usuario.getCodigoEstudiante() != null ? 
                                          usuario.getCodigoEstudiante() : "Pendiente de asignación");
            return ResponseEntity.ok(new MessageResponse(mensaje));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error al obtener estado de postulación", false));
        }
    }
}
