package com.escuelaposgrado.Autenticacion.controller;

import com.escuelaposgrado.Autenticacion.dto.request.LoginRequest;
import com.escuelaposgrado.Autenticacion.dto.request.RegistroRequest;
import com.escuelaposgrado.Autenticacion.dto.response.AuthResponse;
import com.escuelaposgrado.Autenticacion.dto.response.MessageResponse;
import com.escuelaposgrado.Autenticacion.dto.response.UsuarioResponse;
import com.escuelaposgrado.Autenticacion.service.AuthService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/**
 * Controlador REST para la autenticación
 */
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private AuthService authService;

    /**
     * Endpoint para login
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            logger.info("Intento de login para usuario: {}", loginRequest.getUsernameOrEmail());
            AuthResponse response = authService.login(loginRequest);
            logger.info("Login exitoso para usuario: {}", loginRequest.getUsernameOrEmail());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error en login para usuario {}: {}", loginRequest.getUsernameOrEmail(), e.getMessage(), e);
            return ResponseEntity.badRequest().body(new MessageResponse("Error en login: " + e.getMessage(), false));
        }
    }

    /**
     * Endpoint para registro de usuarios
     */
    @PostMapping("/registro")
    public ResponseEntity<MessageResponse> registro(@Valid @RequestBody RegistroRequest registroRequest) {
        MessageResponse response = authService.registro(registroRequest);
        
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Endpoint para obtener información del usuario actual
     */
    @GetMapping("/me")
    public ResponseEntity<UsuarioResponse> getCurrentUser(Authentication authentication) {
        try {
            UsuarioResponse response = authService.getCurrentUser(authentication.getName());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Endpoint de validación de token (health check para autenticación)
     */
    @GetMapping("/validate")
    public ResponseEntity<MessageResponse> validateToken(Authentication authentication) {
        if (authentication != null && authentication.isAuthenticated()) {
            return ResponseEntity.ok(new MessageResponse("Token válido"));
        }
        return ResponseEntity.badRequest().body(new MessageResponse("Token inválido", false));
    }
}
