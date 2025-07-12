package com.escuelaposgrado.Matricula.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.escuelaposgrado.Matricula.dto.common.MessageResponse;
import com.escuelaposgrado.Matricula.dto.request.MencionRequest;
import com.escuelaposgrado.Matricula.dto.response.MencionResponse;
import com.escuelaposgrado.Matricula.service.MencionService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

/**
 * Controlador REST para gestionar las menciones
 */
@RestController
@RequestMapping("/api/matricula/menciones")
@Tag(name = "Menciones", description = "API para gestionar menciones de programas de estudio")
public class MencionController {

    @Autowired
    private MencionService mencionService;

    /**
     * Obtener todas las menciones
     */
    @GetMapping
    @Operation(summary = "Obtener todas las menciones", description = "Obtiene la lista de todas las menciones")
    @ApiResponse(responseCode = "200", description = "Lista de menciones obtenida exitosamente")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<List<MencionResponse>> getAllMenciones() {
        List<MencionResponse> menciones = mencionService.findAll();
        return ResponseEntity.ok(menciones);
    }

    /**
     * Obtener todas las menciones activas
     */
    @GetMapping("/activas")
    @Operation(summary = "Obtener menciones activas", description = "Obtiene la lista de menciones activas")
    @ApiResponse(responseCode = "200", description = "Lista de menciones activas obtenida exitosamente")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<List<MencionResponse>> getMencionesActivas() {
        List<MencionResponse> menciones = mencionService.findAllActive();
        return ResponseEntity.ok(menciones);
    }

    /**
     * Obtener menciones por programa de estudio
     */
    @GetMapping("/programa/{programaId}")
    @Operation(summary = "Obtener menciones por programa", description = "Obtiene las menciones de un programa de estudio específico")
    @ApiResponse(responseCode = "200", description = "Lista de menciones del programa obtenida exitosamente")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<List<MencionResponse>> getMencionesByPrograma(
            @Parameter(description = "ID del programa de estudio", required = true)
            @PathVariable Long programaId) {
        List<MencionResponse> menciones = mencionService.findByProgramaEstudioId(programaId);
        return ResponseEntity.ok(menciones);
    }

    /**
     * Obtener menciones disponibles por programa de estudio
     */
    @GetMapping("/programa/{programaId}/disponibles")
    @Operation(summary = "Obtener menciones disponibles por programa", description = "Obtiene las menciones disponibles de un programa de estudio específico")
    @ApiResponse(responseCode = "200", description = "Lista de menciones disponibles del programa obtenida exitosamente")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<List<MencionResponse>> getMencionesDisponiblesByPrograma(
            @Parameter(description = "ID del programa de estudio", required = true)
            @PathVariable Long programaId) {
        List<MencionResponse> menciones = mencionService.findAvailableByProgramaEstudioId(programaId);
        return ResponseEntity.ok(menciones);
    }

    /**
     * Obtener mención por ID
     */
    @GetMapping("/{id}")
    @Operation(summary = "Obtener mención por ID", description = "Obtiene una mención específica por su ID")
    @ApiResponse(responseCode = "200", description = "Mención encontrada exitosamente")
    @ApiResponse(responseCode = "404", description = "Mención no encontrada")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<MencionResponse> getMencionById(
            @Parameter(description = "ID de la mención", required = true)
            @PathVariable Long id) {
        MencionResponse mencion = mencionService.findById(id);
        return ResponseEntity.ok(mencion);
    }

    /**
     * Crear nueva mención
     */
    @PostMapping
    @Operation(summary = "Crear nueva mención", description = "Crea una nueva mención en el sistema")
    @ApiResponse(responseCode = "201", description = "Mención creada exitosamente")
    @ApiResponse(responseCode = "400", description = "Datos de entrada inválidos")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> createMencion(
            @Parameter(description = "Datos de la nueva mención", required = true)
            @Valid @RequestBody MencionRequest request) {
        MencionResponse nuevaMencion = mencionService.create(request);
        MessageResponse response = MessageResponse.success("Mención creada exitosamente", nuevaMencion);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * Actualizar mención existente
     */
    @PutMapping("/{id}")
    @Operation(summary = "Actualizar mención", description = "Actualiza una mención existente")
    @ApiResponse(responseCode = "200", description = "Mención actualizada exitosamente")
    @ApiResponse(responseCode = "404", description = "Mención no encontrada")
    @ApiResponse(responseCode = "400", description = "Datos de entrada inválidos")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> updateMencion(
            @Parameter(description = "ID de la mención", required = true)
            @PathVariable Long id,
            @Parameter(description = "Datos actualizados de la mención", required = true)
            @Valid @RequestBody MencionRequest request) {
        MencionResponse mencionActualizada = mencionService.update(id, request);
        MessageResponse response = MessageResponse.success("Mención actualizada exitosamente", mencionActualizada);
        return ResponseEntity.ok(response);
    }

    /**
     * Activar/desactivar mención
     */
    @PatchMapping("/{id}/toggle-active")
    @Operation(summary = "Activar/desactivar mención", description = "Cambia el estado activo de una mención")
    @ApiResponse(responseCode = "200", description = "Estado de la mención cambiado exitosamente")
    @ApiResponse(responseCode = "404", description = "Mención no encontrada")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> toggleActive(
            @Parameter(description = "ID de la mención", required = true)
            @PathVariable Long id) {
        MencionResponse mencionActualizada = mencionService.toggleActive(id);
        String mensaje = mencionActualizada.getActivo() ? "Mención activada exitosamente" : "Mención desactivada exitosamente";
        MessageResponse response = MessageResponse.success(mensaje, mencionActualizada);
        return ResponseEntity.ok(response);
    }

    /**
     * Activar/desactivar disponibilidad de mención
     */
    @PatchMapping("/{id}/toggle-disponible")
    @Operation(summary = "Activar/desactivar disponibilidad", description = "Cambia el estado de disponibilidad de una mención")
    @ApiResponse(responseCode = "200", description = "Estado de disponibilidad cambiado exitosamente")
    @ApiResponse(responseCode = "404", description = "Mención no encontrada")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> toggleDisponible(
            @Parameter(description = "ID de la mención", required = true)
            @PathVariable Long id) {
        MencionResponse mencionActualizada = mencionService.toggleDisponible(id);
        String mensaje = mencionActualizada.getDisponible() ? "Mención disponible para asignación" : "Mención no disponible para asignación";
        MessageResponse response = MessageResponse.success(mensaje, mencionActualizada);
        return ResponseEntity.ok(response);
    }

    /**
     * Eliminar mención (borrado lógico)
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar mención", description = "Realiza el borrado lógico de una mención")
    @ApiResponse(responseCode = "200", description = "Mención eliminada exitosamente")
    @ApiResponse(responseCode = "404", description = "Mención no encontrada")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> deleteMencion(
            @Parameter(description = "ID de la mención", required = true)
            @PathVariable Long id) {
        mencionService.delete(id);
        MessageResponse response = MessageResponse.success("Mención eliminada exitosamente");
        return ResponseEntity.ok(response);
    }
}
