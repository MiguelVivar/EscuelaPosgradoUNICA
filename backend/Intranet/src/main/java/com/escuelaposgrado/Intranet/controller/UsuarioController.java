package com.escuelaposgrado.Intranet.controller;

import com.escuelaposgrado.Intranet.dto.MensajeResponse;
import com.escuelaposgrado.Intranet.dto.UsuarioDTO;
import com.escuelaposgrado.Intranet.service.UsuarioService;
import com.escuelaposgrado.Intranet.security.jwt.JwtUtils;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador REST para la gestión de usuarios
 */
@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*", maxAge = 3600)
public class UsuarioController {
    
    @Autowired
    private UsuarioService usuarioService;
    
    @Autowired
    private JwtUtils jwtUtils;
    
    /**
     * Obtener todos los usuarios con paginación
     */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('COORDINADOR')")
    public ResponseEntity<Page<UsuarioDTO>> obtenerUsuarios(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<UsuarioDTO> usuarios = usuarioService.obtenerUsuariosPaginados(pageable);
        return ResponseEntity.ok(usuarios);
    }
    
    /**
     * Obtener usuario por ID
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('COORDINADOR') or @usuarioService.esUsuarioActual(#id, authentication.name)")
    public ResponseEntity<UsuarioDTO> obtenerUsuarioPorId(@PathVariable Long id) {
        try {
            UsuarioDTO usuario = usuarioService.obtenerUsuarioPorId(id);
            return ResponseEntity.ok(usuario);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Crear nuevo usuario
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> crearUsuario(@Valid @RequestBody UsuarioDTO usuarioDTO) {
        try {
            UsuarioDTO nuevoUsuario = usuarioService.crearUsuario(usuarioDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevoUsuario);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MensajeResponse("Error: " + e.getMessage()));
        }
    }
    
    /**
     * Actualizar usuario
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @usuarioService.esUsuarioActual(#id, authentication.name)")
    public ResponseEntity<?> actualizarUsuario(@PathVariable Long id, @Valid @RequestBody UsuarioDTO usuarioDTO) {
        try {
            UsuarioDTO usuarioActualizado = usuarioService.actualizarUsuario(id, usuarioDTO);
            return ResponseEntity.ok(usuarioActualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MensajeResponse("Error: " + e.getMessage()));
        }
    }
    
    /**
     * Eliminar usuario (soft delete)
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> eliminarUsuario(@PathVariable Long id) {
        try {
            usuarioService.eliminarUsuario(id);
            return ResponseEntity.ok(new MensajeResponse("Usuario eliminado correctamente"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MensajeResponse("Error: " + e.getMessage()));
        }
    }
    
    /**
     * Buscar usuarios por nombre o email
     */
    @GetMapping("/buscar")
    @PreAuthorize("hasRole('ADMIN') or hasRole('COORDINADOR') or hasRole('DOCENTE')")
    public ResponseEntity<List<UsuarioDTO>> buscarUsuarios(@RequestParam String termino) {
        List<UsuarioDTO> usuarios = usuarioService.buscarUsuarios(termino);
        return ResponseEntity.ok(usuarios);
    }
    
    /**
     * Obtener usuarios por rol
     */
    @GetMapping("/rol/{rol}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('COORDINADOR')")
    public ResponseEntity<List<UsuarioDTO>> obtenerUsuariosPorRol(@PathVariable String rol) {
        try {
            List<UsuarioDTO> usuarios = usuarioService.obtenerUsuariosPorRol(rol);
            return ResponseEntity.ok(usuarios);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
    
    /**
     * Obtener estudiantes activos
     */
    @GetMapping("/estudiantes")
    @PreAuthorize("hasRole('ADMIN') or hasRole('COORDINADOR') or hasRole('DOCENTE')")
    public ResponseEntity<List<UsuarioDTO>> obtenerEstudiantes() {
        List<UsuarioDTO> estudiantes = usuarioService.obtenerEstudiantes();
        return ResponseEntity.ok(estudiantes);
    }
    
    /**
     * Obtener docentes activos
     */
    @GetMapping("/docentes")
    @PreAuthorize("hasRole('ADMIN') or hasRole('COORDINADOR')")
    public ResponseEntity<List<UsuarioDTO>> obtenerDocentes() {
        List<UsuarioDTO> docentes = usuarioService.obtenerDocentes();
        return ResponseEntity.ok(docentes);
    }
    
    /**
     * Cambiar contraseña
     */
    @PatchMapping("/{id}/cambiar-password")
    @PreAuthorize("hasRole('ADMIN') or @usuarioService.esUsuarioActual(#id, authentication.name)")
    public ResponseEntity<?> cambiarPassword(
            @PathVariable Long id, 
            @RequestBody CambiarPasswordRequest request) {
        try {
            usuarioService.cambiarPassword(id, request.getPasswordActual(), request.getPasswordNuevo());
            return ResponseEntity.ok(new MensajeResponse("Contraseña actualizada correctamente"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MensajeResponse("Error: " + e.getMessage()));
        }
    }
    
    /**
     * Activar/Desactivar usuario
     */
    @PatchMapping("/{id}/estado")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> cambiarEstadoUsuario(@PathVariable Long id, @RequestParam Boolean activo) {
        try {
            usuarioService.cambiarEstadoUsuario(id, activo);
            String mensaje = activo ? "Usuario activado" : "Usuario desactivado";
            return ResponseEntity.ok(new MensajeResponse(mensaje + " correctamente"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MensajeResponse("Error: " + e.getMessage()));
        }
    }
    
    /**
     * Obtener perfil del usuario actual
     */
    @GetMapping("/perfil")
    public ResponseEntity<UsuarioDTO> obtenerPerfil(@RequestHeader("Authorization") String token) {
        try {
            String jwt = token.substring(7); // Remover "Bearer "
            String username = jwtUtils.getUserNameFromJwtToken(jwt);
            UsuarioDTO usuario = usuarioService.obtenerUsuarioPorEmail(username);
            return ResponseEntity.ok(usuario);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Validar email único
     */
    @GetMapping("/validar-email")
    public ResponseEntity<Boolean> validarEmailUnico(@RequestParam String email) {
        boolean disponible = usuarioService.esEmailUnico(email);
        return ResponseEntity.ok(disponible);
    }
    
    /**
     * Validar código único
     */
    @GetMapping("/validar-codigo")
    public ResponseEntity<Boolean> validarCodigoUnico(@RequestParam String codigo) {
        boolean disponible = usuarioService.esCodigoUnico(codigo);
        return ResponseEntity.ok(disponible);
    }
}

/**
 * Clase para request de cambio de contraseña
 */
class CambiarPasswordRequest {
    private String passwordActual;
    private String passwordNuevo;
    
    public String getPasswordActual() { return passwordActual; }
    public void setPasswordActual(String passwordActual) { this.passwordActual = passwordActual; }
    
    public String getPasswordNuevo() { return passwordNuevo; }
    public void setPasswordNuevo(String passwordNuevo) { this.passwordNuevo = passwordNuevo; }
}
