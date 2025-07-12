package com.escuelaposgrado.Matricula.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.escuelaposgrado.Matricula.dto.common.MessageResponse;
import com.escuelaposgrado.Matricula.dto.request.ComisionUnidadPosgradoRequest;
import com.escuelaposgrado.Matricula.dto.response.ComisionUnidadPosgradoResponse;
import com.escuelaposgrado.Matricula.service.ComisionUnidadPosgradoService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

/**
 * Controlador REST para la gestión de ComisionUnidadPosgrado
 */
@RestController
@RequestMapping("/api/comisiones")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"}, 
             allowCredentials = "true", maxAge = 3600)
@Tag(name = "Comisiones Unidad Posgrado", description = "API para la gestión de comisiones de unidades de posgrado")
public class ComisionUnidadPosgradoController {

    @Autowired
    private ComisionUnidadPosgradoService comisionService;

    /**
     * Obtiene todas las comisiones
     */
    @GetMapping
    @Operation(summary = "Obtener todas las comisiones", 
               description = "Retorna la lista completa de comisiones de unidades de posgrado")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Lista obtenida exitosamente"),
        @ApiResponse(responseCode = "403", description = "No autorizado"),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @PreAuthorize("hasRole('ADMIN') or hasRole('COORDINADOR')")
    public ResponseEntity<List<ComisionUnidadPosgradoResponse>> getAllComisiones() {
        List<ComisionUnidadPosgradoResponse> comisiones = comisionService.findAll();
        return ResponseEntity.ok(comisiones);
    }

    /**
     * Obtiene una comisión por ID
     */
    @GetMapping("/{id}")
    @Operation(summary = "Obtener comisión por ID", 
               description = "Retorna una comisión específica por su identificador")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Comisión encontrada"),
        @ApiResponse(responseCode = "404", description = "Comisión no encontrada"),
        @ApiResponse(responseCode = "403", description = "No autorizado"),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @PreAuthorize("hasRole('ADMIN') or hasRole('COORDINADOR')")
    public ResponseEntity<ComisionUnidadPosgradoResponse> getComisionById(
            @Parameter(description = "ID de la comisión") @PathVariable Long id) {
        ComisionUnidadPosgradoResponse comision = comisionService.findById(id);
        return ResponseEntity.ok(comision);
    }

    /**
     * Obtiene comisiones por facultad
     */
    @GetMapping("/facultad/{facultadId}")
    @Operation(summary = "Obtener comisiones por facultad", 
               description = "Retorna todas las comisiones de una facultad específica")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Lista obtenida exitosamente"),
        @ApiResponse(responseCode = "403", description = "No autorizado"),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @PreAuthorize("hasRole('ADMIN') or hasRole('COORDINADOR')")
    public ResponseEntity<List<ComisionUnidadPosgradoResponse>> getComisionesByFacultad(
            @Parameter(description = "ID de la facultad") @PathVariable Long facultadId) {
        List<ComisionUnidadPosgradoResponse> comisiones = comisionService.findByFacultadId(facultadId);
        return ResponseEntity.ok(comisiones);
    }

    /**
     * Obtiene comisiones activas
     */
    @GetMapping("/activas")
    @Operation(summary = "Obtener comisiones activas", 
               description = "Retorna todas las comisiones que están activas")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Lista obtenida exitosamente"),
        @ApiResponse(responseCode = "403", description = "No autorizado"),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @PreAuthorize("hasRole('ADMIN') or hasRole('COORDINADOR')")
    public ResponseEntity<List<ComisionUnidadPosgradoResponse>> getComisionesActivas() {
        List<ComisionUnidadPosgradoResponse> comisiones = comisionService.findByActivoTrue();
        return ResponseEntity.ok(comisiones);
    }

    /**
     * Busca comisiones por nombre
     */
    @GetMapping("/buscar")
    @Operation(summary = "Buscar comisiones por nombre", 
               description = "Busca comisiones que contengan el texto especificado en el nombre")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Búsqueda realizada exitosamente"),
        @ApiResponse(responseCode = "403", description = "No autorizado"),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @PreAuthorize("hasRole('ADMIN') or hasRole('COORDINADOR')")
    public ResponseEntity<List<ComisionUnidadPosgradoResponse>> searchComisionesByNombre(
            @Parameter(description = "Texto a buscar en el nombre") @RequestParam String nombre) {
        List<ComisionUnidadPosgradoResponse> comisiones = comisionService.findByNombreContaining(nombre);
        return ResponseEntity.ok(comisiones);
    }

    /**
     * Crea una nueva comisión
     */
    @PostMapping
    @Operation(summary = "Crear nueva comisión", 
               description = "Crea una nueva comisión de unidad de posgrado")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Comisión creada exitosamente"),
        @ApiResponse(responseCode = "400", description = "Datos de entrada inválidos"),
        @ApiResponse(responseCode = "403", description = "No autorizado"),
        @ApiResponse(responseCode = "409", description = "Conflicto - código ya existe"),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> createComision(
            @Parameter(description = "Datos de la nueva comisión") @Valid @RequestBody ComisionUnidadPosgradoRequest request) {
        try {
            ComisionUnidadPosgradoResponse newComision = comisionService.create(request);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(MessageResponse.success("Comisión creada exitosamente", newComision));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(MessageResponse.error("Error al crear comisión: " + e.getMessage()));
        }
    }

    /**
     * Actualiza una comisión existente
     */
    @PutMapping("/{id}")
    @Operation(summary = "Actualizar comisión", 
               description = "Actualiza los datos de una comisión existente")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Comisión actualizada exitosamente"),
        @ApiResponse(responseCode = "400", description = "Datos de entrada inválidos"),
        @ApiResponse(responseCode = "403", description = "No autorizado"),
        @ApiResponse(responseCode = "404", description = "Comisión no encontrada"),
        @ApiResponse(responseCode = "409", description = "Conflicto - código ya existe"),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> updateComision(
            @Parameter(description = "ID de la comisión") @PathVariable Long id,
            @Parameter(description = "Nuevos datos de la comisión") @Valid @RequestBody ComisionUnidadPosgradoRequest request) {
        try {
            ComisionUnidadPosgradoResponse updatedComision = comisionService.update(id, request);
            return ResponseEntity.ok(MessageResponse.success("Comisión actualizada exitosamente", updatedComision));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(MessageResponse.error("Error al actualizar comisión: " + e.getMessage()));
        }
    }

    /**
     * Elimina una comisión
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar comisión", 
               description = "Elimina una comisión de unidad de posgrado")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Comisión eliminada exitosamente"),
        @ApiResponse(responseCode = "403", description = "No autorizado"),
        @ApiResponse(responseCode = "404", description = "Comisión no encontrada"),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> deleteComision(
            @Parameter(description = "ID de la comisión") @PathVariable Long id) {
        comisionService.delete(id);
        return ResponseEntity.ok(MessageResponse.success("Comisión eliminada exitosamente"));
    }

    /**
     * Activa o desactiva una comisión
     */
    @PatchMapping("/{id}/toggle-activo")
    @Operation(summary = "Activar/Desactivar comisión", 
               description = "Cambia el estado activo/inactivo de una comisión")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Estado cambiado exitosamente"),
        @ApiResponse(responseCode = "403", description = "No autorizado"),
        @ApiResponse(responseCode = "404", description = "Comisión no encontrada"),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> toggleActivoComision(
            @Parameter(description = "ID de la comisión") @PathVariable Long id,
            @Parameter(description = "Nuevo estado activo") @RequestParam Boolean activo) {
        ComisionUnidadPosgradoResponse updatedComision = comisionService.toggleActivo(id, activo);
        String message = activo ? "Comisión activada exitosamente" : "Comisión desactivada exitosamente";
        return ResponseEntity.ok(MessageResponse.success(message, updatedComision));
    }
}
