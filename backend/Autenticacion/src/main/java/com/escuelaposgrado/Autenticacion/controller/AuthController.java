package com.escuelaposgrado.Autenticacion.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.escuelaposgrado.Autenticacion.dto.request.LoginRequest;
import com.escuelaposgrado.Autenticacion.dto.request.RegistroRequest;
import com.escuelaposgrado.Autenticacion.dto.response.AuthResponse;
import com.escuelaposgrado.Autenticacion.dto.response.MessageResponse;
import com.escuelaposgrado.Autenticacion.dto.response.UsuarioResponse;
import com.escuelaposgrado.Autenticacion.service.AuthService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

/**
 * Controlador REST para la autenticación
 */
@Tag(name = "🔐 Autenticación", description = "Endpoints para autenticación y registro de usuarios")
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
    @Operation(
            summary = "Iniciar sesión",
            description = "Autentica un usuario y devuelve un token JWT para acceder a los endpoints protegidos",
            tags = {"🔐 Autenticación"}
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Login exitoso",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = AuthResponse.class),
                            examples = @ExampleObject(
                                    name = "Login exitoso",
                                    value = """
                                            {
                                              "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                                              "id": 1,
                                              "username": "admin",
                                              "email": "admin@unica.edu.pe",
                                              "nombres": "Administrador",
                                              "apellidos": "Sistema",
                                              "role": "ADMIN",
                                              "ultimoAcceso": "2024-01-01T10:00:00"
                                            }
                                            """
                            )
                    )
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Credenciales inválidas",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = MessageResponse.class),
                            examples = @ExampleObject(
                                    name = "Error de login",
                                    value = """
                                            {
                                              "message": "Error en login: Credenciales inválidas",
                                              "success": false
                                            }
                                            """
                            )
                    )
            )
    })
    @PostMapping("/login")
    public ResponseEntity<?> login(
            @Parameter(description = "Credenciales de login", required = true)
            @Valid @RequestBody LoginRequest loginRequest) {
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
    @Operation(
            summary = "Registrar nuevo usuario",
            description = "Registra un nuevo usuario en el sistema. Los campos requeridos varían según el rol seleccionado",
            tags = {"🔐 Autenticación"}
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Usuario registrado exitosamente",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = MessageResponse.class),
                            examples = @ExampleObject(
                                    name = "Registro exitoso",
                                    value = """
                                            {
                                              "message": "Usuario registrado exitosamente",
                                              "success": true
                                            }
                                            """
                            )
                    )
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Error en el registro (usuario/email ya existe, campos faltantes, etc.)",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = MessageResponse.class),
                            examples = @ExampleObject(
                                    name = "Error de registro",
                                    value = """
                                            {
                                              "message": "Error: El nombre de usuario ya está en uso!",
                                              "success": false
                                            }
                                            """
                            )
                    )
            )
    })
    @PostMapping("/registro")
    public ResponseEntity<MessageResponse> registro(
            @Parameter(description = "Datos del nuevo usuario", required = true)
            @Valid @RequestBody RegistroRequest registroRequest) {
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
    @Operation(
            summary = "Obtener perfil del usuario actual",
            description = "Devuelve la información completa del usuario autenticado actualmente",
            security = @SecurityRequirement(name = "bearerAuth"),
            tags = {"🔐 Autenticación"}
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Información del usuario obtenida exitosamente",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = UsuarioResponse.class),
                            examples = @ExampleObject(
                                    name = "Perfil de usuario",
                                    value = """
                                            {
                                              "id": 1,
                                              "username": "juan.perez",
                                              "email": "juan.perez@unica.edu.pe",
                                              "nombres": "Juan Carlos",
                                              "apellidos": "Pérez García",
                                              "dni": "12345678",
                                              "telefono": "966123456",
                                              "role": "ALUMNO",
                                              "activo": true,
                                              "fechaCreacion": "2024-01-01T10:00:00",
                                              "ultimoAcceso": "2024-01-01T10:00:00",
                                              "codigoEstudiante": "EST2024001"
                                            }
                                            """
                            )
                    )
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Usuario no encontrado o token inválido",
                    content = @Content(mediaType = "application/json")
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Token JWT no válido o expirado",
                    content = @Content(mediaType = "application/json")
            )
    })
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
    @Operation(
            summary = "Validar token JWT",
            description = "Verifica si el token JWT proporcionado es válido y no ha expirado",
            security = @SecurityRequirement(name = "bearerAuth"),
            tags = {"🔐 Autenticación"}
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Token válido",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = MessageResponse.class),
                            examples = @ExampleObject(
                                    name = "Token válido",
                                    value = """
                                            {
                                              "message": "Token válido",
                                              "success": true
                                            }
                                            """
                            )
                    )
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Token inválido",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = MessageResponse.class),
                            examples = @ExampleObject(
                                    name = "Token inválido",
                                    value = """
                                            {
                                              "message": "Token inválido",
                                              "success": false
                                            }
                                            """
                            )
                    )
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Token no proporcionado o expirado",
                    content = @Content(mediaType = "application/json")
            )
    })
    @GetMapping("/validate")
    public ResponseEntity<MessageResponse> validateToken(Authentication authentication) {
        if (authentication != null && authentication.isAuthenticated()) {
            return ResponseEntity.ok(new MessageResponse("Token válido"));
        }
        return ResponseEntity.badRequest().body(new MessageResponse("Token inválido", false));
    }
}
