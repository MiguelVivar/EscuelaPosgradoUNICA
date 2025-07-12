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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.escuelaposgrado.Matricula.dto.common.MessageResponse;
import com.escuelaposgrado.Matricula.dto.request.AulaRequest;
import com.escuelaposgrado.Matricula.dto.response.AulaResponse;
import com.escuelaposgrado.Matricula.service.AulaService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

/**
 * Controlador REST para gestionar las aulas
 */
@RestController
@RequestMapping("/api/matricula/aulas")
@Tag(name = "Aulas", description = "API para gestionar aulas")
public class AulaController {

    @Autowired
    private AulaService aulaService;

    /**
     * Obtener todas las aulas
     */
    @GetMapping
    @Operation(summary = "Obtener todas las aulas", description = "Obtiene la lista de todas las aulas")
    @ApiResponse(responseCode = "200", description = "Lista de aulas obtenida exitosamente")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<List<AulaResponse>> getAllAulas() {
        List<AulaResponse> aulas = aulaService.findAll();
        return ResponseEntity.ok(aulas);
    }

    /**
     * Obtener todas las aulas activas
     */
    @GetMapping("/activas")
    @Operation(summary = "Obtener aulas activas", description = "Obtiene la lista de aulas activas")
    @ApiResponse(responseCode = "200", description = "Lista de aulas activas obtenida exitosamente")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<List<AulaResponse>> getAulasActivas() {
        List<AulaResponse> aulas = aulaService.findAllActive();
        return ResponseEntity.ok(aulas);
    }

    /**
     * Obtener aulas por sede
     */
    @GetMapping("/sede/{sedeId}")
    @Operation(summary = "Obtener aulas por sede", description = "Obtiene las aulas de una sede específica")
    @ApiResponse(responseCode = "200", description = "Lista de aulas de la sede obtenida exitosamente")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<List<AulaResponse>> getAulasBySede(
            @Parameter(description = "ID de la sede", required = true)
            @PathVariable Long sedeId) {
        List<AulaResponse> aulas = aulaService.findBySedeId(sedeId);
        return ResponseEntity.ok(aulas);
    }

    /**
     * Obtener aula por ID
     */
    @GetMapping("/{id}")
    @Operation(summary = "Obtener aula por ID", description = "Obtiene un aula específica por su ID")
    @ApiResponse(responseCode = "200", description = "Aula encontrada exitosamente")
    @ApiResponse(responseCode = "404", description = "Aula no encontrada")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<AulaResponse> getAulaById(
            @Parameter(description = "ID del aula", required = true)
            @PathVariable Long id) {
        AulaResponse aula = aulaService.findById(id);
        return ResponseEntity.ok(aula);
    }

    /**
     * Crear nueva aula
     */
    @PostMapping
    @Operation(summary = "Crear nueva aula", description = "Crea una nueva aula en el sistema")
    @ApiResponse(responseCode = "201", description = "Aula creada exitosamente")
    @ApiResponse(responseCode = "400", description = "Datos de entrada inválidos")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> createAula(
            @Parameter(description = "Datos de la nueva aula", required = true)
            @Valid @RequestBody AulaRequest request) {
        AulaResponse nuevaAula = aulaService.create(request);
        MessageResponse response = MessageResponse.success("Aula creada exitosamente", nuevaAula);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * Actualizar aula existente
     */
    @PutMapping("/{id}")
    @Operation(summary = "Actualizar aula", description = "Actualiza un aula existente")
    @ApiResponse(responseCode = "200", description = "Aula actualizada exitosamente")
    @ApiResponse(responseCode = "404", description = "Aula no encontrada")
    @ApiResponse(responseCode = "400", description = "Datos de entrada inválidos")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> updateAula(
            @Parameter(description = "ID del aula", required = true)
            @PathVariable Long id,
            @Parameter(description = "Datos actualizados del aula", required = true)
            @Valid @RequestBody AulaRequest request) {
        AulaResponse aulaActualizada = aulaService.update(id, request);
        MessageResponse response = MessageResponse.success("Aula actualizada exitosamente", aulaActualizada);
        return ResponseEntity.ok(response);
    }

    /**
     * Activar/desactivar aula
     */
    @PatchMapping("/{id}/toggle-active")
    @Operation(summary = "Activar/desactivar aula", description = "Cambia el estado activo de un aula")
    @ApiResponse(responseCode = "200", description = "Estado del aula cambiado exitosamente")
    @ApiResponse(responseCode = "404", description = "Aula no encontrada")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> toggleActive(
            @Parameter(description = "ID del aula", required = true)
            @PathVariable Long id) {
        AulaResponse aulaActualizada = aulaService.toggleActive(id);
        String mensaje = aulaActualizada.getActivo() ? "Aula activada exitosamente" : "Aula desactivada exitosamente";
        MessageResponse response = MessageResponse.success(mensaje, aulaActualizada);
        return ResponseEntity.ok(response);
    }

    /**
     * Eliminar aula (borrado lógico)
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar aula", description = "Realiza el borrado lógico de un aula")
    @ApiResponse(responseCode = "200", description = "Aula eliminada exitosamente")
    @ApiResponse(responseCode = "404", description = "Aula no encontrada")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> deleteAula(
            @Parameter(description = "ID del aula", required = true)
            @PathVariable Long id) {
        aulaService.delete(id);
        MessageResponse response = MessageResponse.success("Aula eliminada exitosamente");
        return ResponseEntity.ok(response);
    }

    /**
     * Buscar aulas por nombre
     */
    @GetMapping("/buscar")
    @Operation(summary = "Buscar aulas por nombre", description = "Busca aulas que contengan el texto especificado en su nombre")
    @ApiResponse(responseCode = "200", description = "Búsqueda realizada exitosamente")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<List<AulaResponse>> buscarAulasPorNombre(
            @Parameter(description = "Texto a buscar en el nombre", required = true)
            @RequestParam String nombre) {
        List<AulaResponse> aulas = aulaService.findByNombreContaining(nombre);
        return ResponseEntity.ok(aulas);
    }

    /**
     * Buscar aulas por capacidad mínima
     */
    @GetMapping("/capacidad-minima")
    @Operation(summary = "Buscar aulas por capacidad mínima", description = "Busca aulas con capacidad mayor o igual al valor especificado")
    @ApiResponse(responseCode = "200", description = "Búsqueda realizada exitosamente")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<List<AulaResponse>> buscarAulasPorCapacidadMinima(
            @Parameter(description = "Capacidad mínima requerida", required = true)
            @RequestParam Integer capacidad) {
        List<AulaResponse> aulas = aulaService.findByCapacidadMinima(capacidad);
        return ResponseEntity.ok(aulas);
    }
}
