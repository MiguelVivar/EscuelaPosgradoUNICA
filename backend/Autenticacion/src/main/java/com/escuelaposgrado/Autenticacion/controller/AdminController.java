package com.escuelaposgrado.Autenticacion.controller;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.escuelaposgrado.Autenticacion.dto.request.ActualizarUsuarioAdminRequest;
import com.escuelaposgrado.Autenticacion.dto.request.RegistroRequest;
import com.escuelaposgrado.Autenticacion.dto.response.MessageResponse;
import com.escuelaposgrado.Autenticacion.dto.response.UsuarioResponse;
import com.escuelaposgrado.Autenticacion.model.enums.Role;
import com.escuelaposgrado.Autenticacion.service.AuthService;
import com.escuelaposgrado.Autenticacion.service.DataCleanupService;
import com.escuelaposgrado.Autenticacion.service.ExcelService;

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
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"}, 
             allowCredentials = "true", maxAge = 3600)
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private AuthService authService;

    @Autowired
    private DataCleanupService dataCleanupService;

    @Autowired
    private ExcelService excelService;

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

    /**
     * Crear nuevo usuario
     */
    @Operation(
            summary = "Crear nuevo usuario",
            description = "Permite al administrador crear un nuevo usuario en el sistema",
            security = @SecurityRequirement(name = "bearerAuth"),
            tags = {"👨‍💼 Administración"}
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Usuario creado exitosamente",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = MessageResponse.class),
                            examples = @ExampleObject(
                                    name = "Usuario creado",
                                    value = """
                                            {
                                              "message": "Usuario creado exitosamente",
                                              "success": true
                                            }
                                            """
                            )
                    )
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Error en la creación (usuario/email ya existe, campos faltantes, etc.)",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = MessageResponse.class),
                            examples = @ExampleObject(
                                    name = "Error de creación",
                                    value = """
                                            {
                                              "message": "Error: El nombre de usuario ya está en uso!",
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
    @PostMapping("/usuarios")
    public ResponseEntity<MessageResponse> crearUsuario(
            @Parameter(description = "Datos del nuevo usuario", required = true)
            @Valid @RequestBody RegistroRequest registroRequest) {
        
        try {
            MessageResponse response = authService.registro(registroRequest);
            
            if (response.isSuccess()) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error al crear usuario: " + e.getMessage(), false));
        }
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

    /**
     * Buscar usuarios por nombres y apellidos
     */
    @Operation(
            summary = "Buscar usuarios por nombres y apellidos",
            description = "Busca usuarios que coincidan parcialmente con el texto proporcionado en nombres o apellidos",
            security = @SecurityRequirement(name = "bearerAuth"),
            tags = {"👨‍💼 Administración"}
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Búsqueda realizada exitosamente",
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
    @GetMapping("/usuarios/buscar")
    public ResponseEntity<List<UsuarioResponse>> buscarUsuarios(
            @Parameter(description = "Texto a buscar en nombres y apellidos", required = true)
            @RequestParam String texto) {
        List<UsuarioResponse> usuarios = authService.buscarUsuariosPorNombre(texto);
        return ResponseEntity.ok(usuarios);
    }

    /**
     * Limpiar datos duplicados en la base de datos
     */
    @Operation(
            summary = "Limpiar datos duplicados",
            description = "Elimina registros duplicados de la base de datos basándose en campos únicos como username, email, DNI, etc.",
            security = @SecurityRequirement(name = "bearerAuth"),
            tags = {"👨‍💼 Administración"}
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Limpieza de duplicados completada exitosamente",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = MessageResponse.class),
                            examples = @ExampleObject(
                                    name = "Limpieza exitosa",
                                    value = """
                                            {
                                              "message": "Limpieza de duplicados completada exitosamente",
                                              "success": true
                                            }
                                            """
                            )
                    )
            ),
            @ApiResponse(
                    responseCode = "500",
                    description = "Error durante la limpieza",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = MessageResponse.class),
                            examples = @ExampleObject(
                                    name = "Error de limpieza",
                                    value = """
                                            {
                                              "message": "Error al limpiar duplicados: <detalle del error>",
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
    @PostMapping("/limpiar-duplicados")
    public ResponseEntity<MessageResponse> limpiarDuplicados() {
        try {
            if (dataCleanupService.existenDuplicados()) {
                dataCleanupService.limpiarDuplicados();
                return ResponseEntity.ok(new MessageResponse("Limpieza de duplicados completada exitosamente"));
            } else {
                return ResponseEntity.ok(new MessageResponse("No se encontraron registros duplicados"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(new MessageResponse("Error al limpiar duplicados: " + e.getMessage(), false));
        }
    }

    /**
     * Exportar usuarios a Excel
     */
    @Operation(
            summary = "Exportar usuarios a Excel",
            description = "Exporta todos los usuarios del sistema a un archivo Excel",
            security = @SecurityRequirement(name = "bearerAuth"),
            tags = {"👨‍💼 Administración"}
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Archivo Excel generado exitosamente",
                    content = @Content(
                            mediaType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
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
            ),
            @ApiResponse(
                    responseCode = "500",
                    description = "Error interno del servidor",
                    content = @Content(mediaType = "application/json")
            )
    })
    @GetMapping("/usuarios/exportar-excel")
    public ResponseEntity<InputStreamResource> exportarUsuariosExcel() {
        try {
            List<UsuarioResponse> usuarios = authService.getAllUsuariosIncluyendoInactivos();
            ByteArrayInputStream in = excelService.exportUsuariosToExcel(usuarios);
            
            HttpHeaders headers = new HttpHeaders();
            headers.add("Content-Disposition", "attachment; filename=usuarios_" + 
                    LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss")) + ".xlsx");
            
            return ResponseEntity.ok()
                    .headers(headers)
                    .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                    .body(new InputStreamResource(in));
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Importar usuarios desde Excel
     */
    @Operation(
            summary = "Importar usuarios desde Excel",
            description = "Importa usuarios al sistema desde un archivo Excel. El archivo debe seguir el formato de la plantilla.",
            security = @SecurityRequirement(name = "bearerAuth"),
            tags = {"👨‍💼 Administración"}
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Importación completada",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = MessageResponse.class),
                            examples = @ExampleObject(
                                    name = "Importación exitosa",
                                    value = """
                                            {
                                              "message": "Importación completada.\\nUsuarios creados exitosamente: 5\\nErrores encontrados: 1",
                                              "success": true
                                            }
                                            """
                            )
                    )
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Archivo inválido o formato incorrecto",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = MessageResponse.class),
                            examples = @ExampleObject(
                                    name = "Error de formato",
                                    value = """
                                            {
                                              "message": "Error al procesar el archivo Excel: Formato inválido",
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
    @PostMapping(value = "/usuarios/importar-excel", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<MessageResponse> importarUsuariosExcel(
            @Parameter(description = "Archivo Excel con los usuarios a importar", required = true)
            @RequestParam("file") MultipartFile file) {
        
        // Validar archivo
        if (file.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Debe seleccionar un archivo", false));
        }
        
        String filename = file.getOriginalFilename();
        if (filename == null || !filename.endsWith(".xlsx")) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("El archivo debe ser de formato Excel (.xlsx)", false));
        }
        
        try {
            MessageResponse response = excelService.importUsuariosFromExcel(file);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(new MessageResponse("Error al procesar el archivo: " + e.getMessage(), false));
        }
    }

    /**
     * Descargar plantilla Excel para importar usuarios
     */
    @Operation(
            summary = "Descargar plantilla Excel",
            description = "Descarga una plantilla de Excel con el formato correcto para importar usuarios",
            security = @SecurityRequirement(name = "bearerAuth"),
            tags = {"👨‍💼 Administración"}
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Plantilla Excel generada exitosamente",
                    content = @Content(
                            mediaType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
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
            ),
            @ApiResponse(
                    responseCode = "500",
                    description = "Error interno del servidor",
                    content = @Content(mediaType = "application/json")
            )
    })
    @GetMapping("/usuarios/plantilla-excel")
    public ResponseEntity<InputStreamResource> descargarPlantillaExcel() {
        try {
            ByteArrayInputStream in = excelService.generateExcelTemplate();
            
            HttpHeaders headers = new HttpHeaders();
            headers.add("Content-Disposition", "attachment; filename=plantilla_usuarios.xlsx");
            
            return ResponseEntity.ok()
                    .headers(headers)
                    .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                    .body(new InputStreamResource(in));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
