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
import com.escuelaposgrado.Matricula.dto.request.ProgramaEstudioRequest;
import com.escuelaposgrado.Matricula.dto.response.ProgramaEstudioResponse;
import com.escuelaposgrado.Matricula.service.ProgramaEstudioService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

/**
 * Controlador REST para gestionar los programas de estudio
 */
@RestController
@RequestMapping("/api/matricula/programas-estudio")
@Tag(name = "Programas de Estudio", description = "API para gestionar programas de estudio")
public class ProgramaEstudioController {

    @Autowired
    private ProgramaEstudioService programaEstudioService;

    /**
     * Obtener todos los programas de estudio
     */
    @GetMapping
    @Operation(summary = "Obtener todos los programas de estudio", description = "Obtiene la lista de todos los programas de estudio")
    @ApiResponse(responseCode = "200", description = "Lista de programas obtenida exitosamente")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<List<ProgramaEstudioResponse>> getAllProgramas() {
        List<ProgramaEstudioResponse> programas = programaEstudioService.findAll();
        return ResponseEntity.ok(programas);
    }

    /**
     * Obtener todos los programas activos
     */
    @GetMapping("/activos")
    @Operation(summary = "Obtener programas activos", description = "Obtiene la lista de programas activos")
    @ApiResponse(responseCode = "200", description = "Lista de programas activos obtenida exitosamente")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<List<ProgramaEstudioResponse>> getProgramasActivos() {
        List<ProgramaEstudioResponse> programas = programaEstudioService.findAllActive();
        return ResponseEntity.ok(programas);
    }

    /**
     * Obtener programas disponibles para matrícula
     */
    @GetMapping("/disponibles")
    @Operation(summary = "Obtener programas disponibles", description = "Obtiene la lista de programas disponibles para matrícula")
    @ApiResponse(responseCode = "200", description = "Lista de programas disponibles obtenida exitosamente")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<List<ProgramaEstudioResponse>> getProgramasDisponibles() {
        List<ProgramaEstudioResponse> programas = programaEstudioService.findAllAvailable();
        return ResponseEntity.ok(programas);
    }

    /**
     * Obtener programas por facultad
     */
    @GetMapping("/facultad/{facultadId}")
    @Operation(summary = "Obtener programas por facultad", description = "Obtiene los programas de una facultad específica")
    @ApiResponse(responseCode = "200", description = "Lista de programas de la facultad obtenida exitosamente")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<List<ProgramaEstudioResponse>> getProgramasByFacultad(
            @Parameter(description = "ID de la facultad", required = true)
            @PathVariable Long facultadId) {
        List<ProgramaEstudioResponse> programas = programaEstudioService.findByFacultadId(facultadId);
        return ResponseEntity.ok(programas);
    }

    /**
     * Obtener programas por nivel
     */
    @GetMapping("/nivel/{nivel}")
    @Operation(summary = "Obtener programas por nivel", description = "Obtiene los programas de un nivel específico")
    @ApiResponse(responseCode = "200", description = "Lista de programas del nivel obtenida exitosamente")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<List<ProgramaEstudioResponse>> getProgramasByNivel(
            @Parameter(description = "Nivel del programa", required = true)
            @PathVariable String nivel) {
        List<ProgramaEstudioResponse> programas = programaEstudioService.findByNivel(nivel);
        return ResponseEntity.ok(programas);
    }

    /**
     * Obtener programa por ID
     */
    @GetMapping("/{id}")
    @Operation(summary = "Obtener programa por ID", description = "Obtiene un programa específico por su ID")
    @ApiResponse(responseCode = "200", description = "Programa encontrado exitosamente")
    @ApiResponse(responseCode = "404", description = "Programa no encontrado")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<ProgramaEstudioResponse> getProgramaById(
            @Parameter(description = "ID del programa", required = true)
            @PathVariable Long id) {
        ProgramaEstudioResponse programa = programaEstudioService.findById(id);
        return ResponseEntity.ok(programa);
    }

    /**
     * Obtener niveles únicos
     */
    @GetMapping("/niveles")
    @Operation(summary = "Obtener niveles disponibles", description = "Obtiene la lista de niveles únicos")
    @ApiResponse(responseCode = "200", description = "Lista de niveles obtenida exitosamente")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<List<String>> getNiveles() {
        List<String> niveles = programaEstudioService.findDistinctNiveles();
        return ResponseEntity.ok(niveles);
    }

    /**
     * Obtener modalidades únicas
     */
    @GetMapping("/modalidades")
    @Operation(summary = "Obtener modalidades disponibles", description = "Obtiene la lista de modalidades únicas")
    @ApiResponse(responseCode = "200", description = "Lista de modalidades obtenida exitosamente")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<List<String>> getModalidades() {
        List<String> modalidades = programaEstudioService.findDistinctModalidades();
        return ResponseEntity.ok(modalidades);
    }

    /**
     * Crear nuevo programa
     */
    @PostMapping
    @Operation(summary = "Crear nuevo programa", description = "Crea un nuevo programa de estudio")
    @ApiResponse(responseCode = "201", description = "Programa creado exitosamente")
    @ApiResponse(responseCode = "400", description = "Datos de entrada inválidos")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> createPrograma(@Valid @RequestBody ProgramaEstudioRequest request) {
        programaEstudioService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new MessageResponse("Programa de estudio creado exitosamente", true));
    }

    /**
     * Actualizar programa
     */
    @PutMapping("/{id}")
    @Operation(summary = "Actualizar programa", description = "Actualiza un programa de estudio existente")
    @ApiResponse(responseCode = "200", description = "Programa actualizado exitosamente")
    @ApiResponse(responseCode = "404", description = "Programa no encontrado")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> updatePrograma(
            @Parameter(description = "ID del programa", required = true)
            @PathVariable Long id,
            @Valid @RequestBody ProgramaEstudioRequest request) {
        programaEstudioService.update(id, request);
        return ResponseEntity.ok(new MessageResponse("Programa de estudio actualizado exitosamente", true));
    }

    /**
     * Cambiar estado activo/inactivo
     */
    @PatchMapping("/{id}/toggle-active")
    @Operation(summary = "Cambiar estado del programa", description = "Activa o desactiva un programa de estudio")
    @ApiResponse(responseCode = "200", description = "Estado cambiado exitosamente")
    @ApiResponse(responseCode = "404", description = "Programa no encontrado")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> toggleActive(
            @Parameter(description = "ID del programa", required = true)
            @PathVariable Long id) {
        programaEstudioService.toggleActive(id);
        return ResponseEntity.ok(new MessageResponse("Estado del programa cambiado exitosamente", true));
    }

    /**
     * Cambiar disponibilidad para matrícula
     */
    @PatchMapping("/{id}/toggle-disponible")
    @Operation(summary = "Cambiar disponibilidad del programa", description = "Activa o desactiva la disponibilidad para matrícula")
    @ApiResponse(responseCode = "200", description = "Disponibilidad cambiada exitosamente")
    @ApiResponse(responseCode = "404", description = "Programa no encontrado")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> toggleDisponible(
            @Parameter(description = "ID del programa", required = true)
            @PathVariable Long id) {
        programaEstudioService.toggleDisponible(id);
        return ResponseEntity.ok(new MessageResponse("Disponibilidad del programa cambiada exitosamente", true));
    }

    /**
     * Eliminar programa
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar programa", description = "Elimina un programa de estudio")
    @ApiResponse(responseCode = "200", description = "Programa eliminado exitosamente")
    @ApiResponse(responseCode = "404", description = "Programa no encontrado")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> deletePrograma(
            @Parameter(description = "ID del programa", required = true)
            @PathVariable Long id) {
        programaEstudioService.delete(id);
        return ResponseEntity.ok(new MessageResponse("Programa de estudio eliminado exitosamente", true));
    }
}
