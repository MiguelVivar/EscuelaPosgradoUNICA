package com.escuelaposgrado.Intranet.controller;

import com.escuelaposgrado.Intranet.dto.MensajeResponse;
import com.escuelaposgrado.Intranet.dto.UsuarioDTO;
import com.escuelaposgrado.Intranet.security.jwt.JwtUtils;
import com.escuelaposgrado.Intranet.service.UsuarioService;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

/**
 * Controlador para autenticación y autorización
 */
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private JwtUtils jwtUtils;
    
    @Autowired
    private UsuarioService usuarioService;
    
    /**
     * Iniciar sesión
     */
    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequest.getUsername(), 
                    loginRequest.getPassword()
                )
            );
            
            SecurityContextHolder.getContext().setAuthentication(authentication);
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String jwt = jwtUtils.generateJwtToken(authentication);
            
            // Obtener información del usuario
            UsuarioDTO usuario = usuarioService.obtenerUsuarioPorEmail(userDetails.getUsername());
            
            return ResponseEntity.ok(new JwtResponse(
                jwt,
                userDetails.getUsername(),
                usuario.getRol(),
                usuario.getNombreCompleto()
            ));
            
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new MensajeResponse("Error: Credenciales inválidas"));
        }
    }
    
    /**
     * Registrar nuevo usuario (solo para administradores)
     */
    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody UsuarioDTO usuarioDTO) {
        try {
            usuarioService.crearUsuario(usuarioDTO);
            return ResponseEntity.ok(new MensajeResponse("Usuario registrado exitosamente"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                .body(new MensajeResponse("Error: " + e.getMessage()));
        }
    }
    
    /**
     * Cerrar sesión
     */
    @PostMapping("/signout")
    public ResponseEntity<?> logoutUser() {
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok(new MensajeResponse("Sesión cerrada exitosamente"));
    }
    
    /**
     * Verificar token
     */
    @GetMapping("/verify")
    public ResponseEntity<?> verifyToken(@RequestHeader("Authorization") String token) {
        try {
            String jwt = token.substring(7);
            if (jwtUtils.validateJwtToken(jwt)) {
                String username = jwtUtils.getUserNameFromJwtToken(jwt);
                UsuarioDTO usuario = usuarioService.obtenerUsuarioPorEmail(username);
                return ResponseEntity.ok(usuario);
            } else {
                return ResponseEntity.badRequest()
                    .body(new MensajeResponse("Token inválido"));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new MensajeResponse("Error al verificar token"));
        }
    }
}

/**
 * Request para login
 */
class LoginRequest {
    private String username;
    private String password;
    
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}

/**
 * Response con JWT
 */
class JwtResponse {
    private String token;
    private String type = "Bearer";
    private String username;
    private String role;
    private String nombreCompleto;
    
    public JwtResponse(String accessToken, String username, String role, String nombreCompleto) {
        this.token = accessToken;
        this.username = username;
        this.role = role;
        this.nombreCompleto = nombreCompleto;
    }
    
    // Getters y Setters
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    
    public String getNombreCompleto() { return nombreCompleto; }
    public void setNombreCompleto(String nombreCompleto) { this.nombreCompleto = nombreCompleto; }
}
