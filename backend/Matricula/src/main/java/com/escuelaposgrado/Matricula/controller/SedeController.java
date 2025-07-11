package com.escuelaposgrado.Matricula.controller;

import com.escuelaposgrado.Matricula.dto.request.SedeRequest;
import com.escuelaposgrado.Matricula.dto.response.SedeResponse;
import com.escuelaposgrado.Matricula.dto.common.MessageResponse;
import com.escuelaposgrado.Matricula.service.SedeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador REST para gestionar las sedes
 */
@RestController
@RequestMapping("/api/matricula/sedes")
@Tag(name = "Sedes", description = "API para gestionar sedes")
@CrossOrigin(origins = "*", maxAge = 3600)
public class SedeController {

    @Autowired
    private SedeService sedeService;

    /**
     * Obtener todas las sedes
     */
    @GetMapping
    @Operation(summary = "Obtener todas las sedes", description = "Obtiene la lista de todas las sedes")
    @ApiResponse(responseCode = "200", description = "Lista de sedes obtenida exitosamente")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<List<SedeResponse>> getAllSedes() {
        List<SedeResponse> sedes = sedeService.findAll();
        return ResponseEntity.ok(sedes);
    }

    /**
     * Obtener todas las sedes activas
     */
    @GetMapping("/activas")
    @Operation(summary = "Obtener sedes activas", description = "Obtiene la lista de sedes activas")
    @ApiResponse(responseCode = "200", description = "Lista de sedes activas obtenida exitosamente")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<List<SedeResponse>> getSedesActivas() {
        List<SedeResponse> sedes = sedeService.findAllActive();
        return ResponseEntity.ok(sedes);
    }

    /**
     * Obtener sede por ID
     */
    @GetMapping("/{id}")
    @Operation(summary = "Obtener sede por ID", description = "Obtiene una sede específica por su ID")
    @ApiResponse(responseCode = "200", description = "Sede encontrada exitosamente")
    @ApiResponse(responseCode = "404", description = "Sede no encontrada")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<SedeResponse> getSedeById(
            @Parameter(description = "ID de la sede", required = true)
            @PathVariable Long id) {
        SedeResponse sede = sedeService.findById(id);
        return ResponseEntity.ok(sede);
    }

    /**
     * Crear nueva sede
     */
    @PostMapping
    @Operation(summary = "Crear nueva sede", description = "Crea una nueva sede en el sistema")
    @ApiResponse(responseCode = "201", description = "Sede creada exitosamente")
    @ApiResponse(responseCode = "400", description = "Datos de entrada inválidos")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> createSede(
            @Parameter(description = "Datos de la nueva sede", required = true)
            @Valid @RequestBody SedeRequest request) {
        SedeResponse nuevaSede = sedeService.create(request);
        MessageResponse response = MessageResponse.success("Sede creada exitosamente", nuevaSede);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * Actualizar sede existente
     */
    @PutMapping("/{id}")
    @Operation(summary = "Actualizar sede", description = "Actualiza una sede existente")
    @ApiResponse(responseCode = "200", description = "Sede actualizada exitosamente")
    @ApiResponse(responseCode = "404", description = "Sede no encontrada")
    @ApiResponse(responseCode = "400", description = "Datos de entrada inválidos")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> updateSede(
            @Parameter(description = "ID de la sede", required = true)
            @PathVariable Long id,
            @Parameter(description = "Datos actualizados de la sede", required = true)
            @Valid @RequestBody SedeRequest request) {
        SedeResponse sedeActualizada = sedeService.update(id, request);
        MessageResponse response = MessageResponse.success("Sede actualizada exitosamente", sedeActualizada);
        return ResponseEntity.ok(response);
    }

    /**
     * Activar/desactivar sede
     */
    @PatchMapping("/{id}/toggle-active")
    @Operation(summary = "Activar/desactivar sede", description = "Cambia el estado activo de una sede")
    @ApiResponse(responseCode = "200", description = "Estado de la sede cambiado exitosamente")
    @ApiResponse(responseCode = "404", description = "Sede no encontrada")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> toggleActive(
            @Parameter(description = "ID de la sede", required = true)
            @PathVariable Long id) {
        SedeResponse sedeActualizada = sedeService.toggleActive(id);
        String mensaje = sedeActualizada.getActivo() ? "Sede activada exitosamente" : "Sede desactivada exitosamente";
        MessageResponse response = MessageResponse.success(mensaje, sedeActualizada);
        return ResponseEntity.ok(response);
    }

    /**
     * Eliminar sede (borrado lógico)
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar sede", description = "Realiza el borrado lógico de una sede")
    @ApiResponse(responseCode = "200", description = "Sede eliminada exitosamente")
    @ApiResponse(responseCode = "404", description = "Sede no encontrada")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> deleteSede(
            @Parameter(description = "ID de la sede", required = true)
            @PathVariable Long id) {
        sedeService.delete(id);
        MessageResponse response = MessageResponse.success("Sede eliminada exitosamente");
        return ResponseEntity.ok(response);
    }

    /**
     * Buscar sedes por nombre
     */
    @GetMapping("/buscar")
    @Operation(summary = "Buscar sedes por nombre", description = "Busca sedes que contengan el texto especificado en su nombre")
    @ApiResponse(responseCode = "200", description = "Búsqueda realizada exitosamente")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<List<SedeResponse>> buscarSedesPorNombre(
            @Parameter(description = "Texto a buscar en el nombre", required = true)
            @RequestParam String nombre) {
        List<SedeResponse> sedes = sedeService.findByNombreContaining(nombre);
        return ResponseEntity.ok(sedes);
    }
}
