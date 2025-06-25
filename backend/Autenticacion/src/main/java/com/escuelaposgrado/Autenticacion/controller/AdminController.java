package com.escuelaposgrado.Autenticacion.controller;

import com.escuelaposgrado.Autenticacion.dto.response.MessageResponse;
import com.escuelaposgrado.Autenticacion.dto.response.UsuarioResponse;
import com.escuelaposgrado.Autenticacion.model.enums.Role;
import com.escuelaposgrado.Autenticacion.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador REST para operaciones administrativas
 */
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private AuthService authService;

    /**
     * Obtener todos los usuarios
     */
    @GetMapping("/usuarios")
    public ResponseEntity<List<UsuarioResponse>> getAllUsuarios() {
        List<UsuarioResponse> usuarios = authService.getAllUsuarios();
        return ResponseEntity.ok(usuarios);
    }

    /**
     * Obtener usuarios por rol
     */
    @GetMapping("/usuarios/rol/{role}")
    public ResponseEntity<List<UsuarioResponse>> getUsuariosByRole(@PathVariable Role role) {
        List<UsuarioResponse> usuarios = authService.getUsuariosByRole(role);
        return ResponseEntity.ok(usuarios);
    }

    /**
     * Desactivar usuario
     */
    @PutMapping("/usuarios/{id}/desactivar")
    public ResponseEntity<MessageResponse> desactivarUsuario(@PathVariable Long id) {
        MessageResponse response = authService.desactivarUsuario(id);
        return ResponseEntity.ok(response);
    }

    /**
     * Activar usuario
     */
    @PutMapping("/usuarios/{id}/activar")
    public ResponseEntity<MessageResponse> activarUsuario(@PathVariable Long id) {
        MessageResponse response = authService.activarUsuario(id);
        return ResponseEntity.ok(response);
    }

    /**
     * Obtener estadísticas de usuarios
     */
    @GetMapping("/estadisticas")
    public ResponseEntity<MessageResponse> getEstadisticas() {
        MessageResponse response = authService.getEstadisticas();
        return ResponseEntity.ok(response);
    }

    /**
     * Obtener docentes
     */
    @GetMapping("/docentes")
    public ResponseEntity<List<UsuarioResponse>> getDocentes() {
        List<UsuarioResponse> docentes = authService.getUsuariosByRole(Role.DOCENTE);
        return ResponseEntity.ok(docentes);
    }

    /**
     * Obtener coordinadores
     */
    @GetMapping("/coordinadores")
    public ResponseEntity<List<UsuarioResponse>> getCoordinadores() {
        List<UsuarioResponse> coordinadores = authService.getUsuariosByRole(Role.COORDINADOR);
        return ResponseEntity.ok(coordinadores);
    }

    /**
     * Obtener alumnos
     */
    @GetMapping("/alumnos")
    public ResponseEntity<List<UsuarioResponse>> getAlumnos() {
        List<UsuarioResponse> alumnos = authService.getUsuariosByRole(Role.ALUMNO);
        return ResponseEntity.ok(alumnos);
    }

    /**
     * Obtener postulantes
     */
    @GetMapping("/postulantes")
    public ResponseEntity<List<UsuarioResponse>> getPostulantes() {
        List<UsuarioResponse> postulantes = authService.getUsuariosByRole(Role.POSTULANTE);
        return ResponseEntity.ok(postulantes);
    }
}
