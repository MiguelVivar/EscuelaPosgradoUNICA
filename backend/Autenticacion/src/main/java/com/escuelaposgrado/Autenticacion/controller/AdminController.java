package com.escuelaposgrado.Autenticacion.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.escuelaposgrado.Autenticacion.dto.request.ActualizarUsuarioAdminRequest;
import com.escuelaposgrado.Autenticacion.dto.response.MessageResponse;
import com.escuelaposgrado.Autenticacion.dto.response.UsuarioResponse;
import com.escuelaposgrado.Autenticacion.model.enums.Role;
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
 * Controlador REST para operaciones administrativas
 */
@Tag(name = "👨‍💼 Administración", description = "Endpoints exclusivos para administradores del sistema")
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
    @Operation(
            summary = "Obtener todos los usuarios",
            description = "Devuelve una lista de todos los usuarios activos en el sistema",
            security = @SecurityRequirement(name = "bearerAuth"),
            tags = {"👨‍💼 Administración"}
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Lista de usuarios obtenida exitosamente",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = UsuarioResponse.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "No autorizado - Token JWT inválido",
                    content = @Content(mediaType = "application/json")
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "Prohibido - Se requiere rol ADMIN",
                    content = @Content(mediaType = "application/json")
            )
    })
    @GetMapping("/usuarios")
    public ResponseEntity<List<UsuarioResponse>> getAllUsuarios() {
        List<UsuarioResponse> usuarios = authService.getAllUsuarios();
        return ResponseEntity.ok(usuarios);
    }

    @Operation(
        summary = "Obtener todos los usuarios (incluidos inactivos)",
        description = "Devuelve una lista de todos los usuarios en el sistema, incluidos los activos e inactivos.",
        security = @SecurityRequirement(name = "bearerAuth"),
        tags = {"👨‍💼 Administración"}
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Lista de todos los usuarios obtenida exitosamente",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = UsuarioResponse.class)
            )
        )
    })
    @GetMapping("/usuarios/all")
    public ResponseEntity<List<UsuarioResponse>> getAllUsuariosIncluyendoInactivos() {
        List<UsuarioResponse> usuarios = authService.getAllUsuariosIncluyendoInactivos();
        return ResponseEntity.ok(usuarios);
    }

    /**
     * Obtener usuarios por rol
     */
    @Operation(
            summary = "Obtener usuarios por rol",
            description = "Devuelve una lista de usuarios filtrados por el rol especificado",
            security = @SecurityRequirement(name = "bearerAuth"),
            tags = {"👨‍💼 Administración"}
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Lista de usuarios por rol obtenida exitosamente",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = UsuarioResponse.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "No autorizado - Token JWT inválido",
                    content = @Content(mediaType = "application/json")
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "Prohibido - Se requiere rol ADMIN",
                    content = @Content(mediaType = "application/json")
            )
    })
    @GetMapping("/usuarios/rol/{role}")
    public ResponseEntity<List<UsuarioResponse>> getUsuariosByRole(
            @Parameter(description = "Rol a filtrar (ADMIN, COORDINADOR, DOCENTE, ALUMNO, POSTULANTE)", required = true)
            @PathVariable Role role) {
        List<UsuarioResponse> usuarios = authService.getUsuariosByRole(role);
        return ResponseEntity.ok(usuarios);
    }

    /**
     * Obtener usuarios por rol (incluidos inactivos)
     */
    @Operation(
            summary = "Obtener usuarios por rol (incluidos inactivos)",
            description = "Devuelve una lista de usuarios filtrados por el rol especificado, incluidos los activos e inactivos",
            security = @SecurityRequirement(name = "bearerAuth"),
            tags = {"👨‍💼 Administración"}
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Lista de usuarios por rol obtenida exitosamente",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = UsuarioResponse.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "No autorizado - Token JWT inválido",
                    content = @Content(mediaType = "application/json")
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "Prohibido - Se requiere rol ADMIN",
                    content = @Content(mediaType = "application/json")
            )
    })
    @GetMapping("/usuarios/rol/{role}/all")
    public ResponseEntity<List<UsuarioResponse>> getUsuariosByRoleIncluyendoInactivos(
            @Parameter(description = "Rol a filtrar (ADMIN, COORDINADOR, DOCENTE, ALUMNO, POSTULANTE)", required = true)
            @PathVariable Role role) {
        List<UsuarioResponse> usuarios = authService.getUsuariosByRoleIncluyendoInactivos(role);
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
    @Operation(
            summary = "Activar usuario",
            description = "Activa un usuario previamente desactivado en el sistema",
            security = @SecurityRequirement(name = "bearerAuth"),
            tags = {"👨‍💼 Administración"}
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Usuario activado exitosamente",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = MessageResponse.class),
                            examples = @ExampleObject(
                                    name = "Usuario activado",
                                    value = """
                                            {
                                              "message": "Usuario activado exitosamente",
                                              "success": true
                                            }
                                            """
                            )
                    )
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Usuario no encontrado",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = MessageResponse.class),
                            examples = @ExampleObject(
                                    name = "Usuario no encontrado",
                                    value = """
                                            {
                                              "message": "Usuario no encontrado",
                                              "success": false
                                            }
                                            """
                            )
                    )
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "No autorizado - Token JWT inválido",
                    content = @Content(mediaType = "application/json")
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "Prohibido - Se requiere rol ADMIN",
                    content = @Content(mediaType = "application/json")
            )
    })
    @PutMapping("/usuarios/{id}/activar")
    public ResponseEntity<MessageResponse> activarUsuario(
            @Parameter(description = "ID del usuario a activar", required = true)
            @PathVariable Long id) {
        MessageResponse response = authService.activarUsuario(id);
        return ResponseEntity.ok(response);
    }

    /**
     * Actualizar datos de usuario
     */
    @Operation(
            summary = "Actualizar datos de usuario",
            description = "Permite al administrador actualizar todos los datos de un usuario",
            security = @SecurityRequirement(name = "bearerAuth"),
            tags = {"👨‍💼 Administración"}
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Usuario actualizado exitosamente",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = MessageResponse.class),
                            examples = @ExampleObject(
                                    name = "Usuario actualizado",
                                    value = """
                                            {
                                              "message": "Usuario actualizado exitosamente",
                                              "success": true
                                            }
                                            """
                            )
                    )
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Datos inválidos o usuario no encontrado",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = MessageResponse.class),
                            examples = @ExampleObject(
                                    name = "Error de validación",
                                    value = """
                                            {
                                              "message": "Error: El nombre de usuario ya está en uso",
                                              "success": false
                                            }
                                            """
                            )
                    )
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "No autorizado - Token JWT inválido",
                    content = @Content(mediaType = "application/json")
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "Prohibido - Se requiere rol ADMIN",
                    content = @Content(mediaType = "application/json")
            )
    })
    @PutMapping("/usuarios/{id}")
    public ResponseEntity<MessageResponse> actualizarUsuario(
            @Parameter(description = "ID del usuario a actualizar", required = true)
            @PathVariable Long id,
            @Parameter(description = "Datos del usuario a actualizar", required = true)
            @Valid @RequestBody ActualizarUsuarioAdminRequest request) {
        MessageResponse response = authService.actualizarUsuarioAdmin(id, request);
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
