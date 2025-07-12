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
import com.escuelaposgrado.Matricula.dto.request.TurnoMatriculaRequest;
import com.escuelaposgrado.Matricula.dto.response.TurnoMatriculaResponse;
import com.escuelaposgrado.Matricula.service.TurnoMatriculaService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

/**
 * Controlador REST para gestionar los turnos de matrícula
 */
@RestController
@RequestMapping("/api/matricula/turnos-matricula")
@Tag(name = "Turnos de Matrícula", description = "API para gestionar turnos de matrícula")
public class TurnoMatriculaController {

    @Autowired
    private TurnoMatriculaService turnoMatriculaService;

    /**
     * Obtener todos los turnos de matrícula
     */
    @GetMapping
    @Operation(summary = "Obtener todos los turnos", description = "Obtiene la lista de todos los turnos de matrícula")
    @ApiResponse(responseCode = "200", description = "Lista de turnos obtenida exitosamente")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<List<TurnoMatriculaResponse>> getAllTurnos() {
        List<TurnoMatriculaResponse> turnos = turnoMatriculaService.findAll();
        return ResponseEntity.ok(turnos);
    }

    /**
     * Obtener todos los turnos activos
     */
    @GetMapping("/activos")
    @Operation(summary = "Obtener turnos activos", description = "Obtiene la lista de turnos activos")
    @ApiResponse(responseCode = "200", description = "Lista de turnos activos obtenida exitosamente")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<List<TurnoMatriculaResponse>> getTurnosActivos() {
        List<TurnoMatriculaResponse> turnos = turnoMatriculaService.findAllActive();
        return ResponseEntity.ok(turnos);
    }

    /**
     * Obtener todos los turnos habilitados
     */
    @GetMapping("/habilitados")
    @Operation(summary = "Obtener turnos habilitados", description = "Obtiene la lista de turnos habilitados para matrícula")
    @ApiResponse(responseCode = "200", description = "Lista de turnos habilitados obtenida exitosamente")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<List<TurnoMatriculaResponse>> getTurnosHabilitados() {
        List<TurnoMatriculaResponse> turnos = turnoMatriculaService.findAllEnabled();
        return ResponseEntity.ok(turnos);
    }

    /**
     * Obtener turnos por período académico
     */
    @GetMapping("/periodo/{periodoId}")
    @Operation(summary = "Obtener turnos por período", description = "Obtiene los turnos de un período académico específico")
    @ApiResponse(responseCode = "200", description = "Lista de turnos del período obtenida exitosamente")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<List<TurnoMatriculaResponse>> getTurnosByPeriodo(
            @Parameter(description = "ID del período académico", required = true)
            @PathVariable Long periodoId) {
        List<TurnoMatriculaResponse> turnos = turnoMatriculaService.findByPeriodoAcademico(periodoId);
        return ResponseEntity.ok(turnos);
    }

    /**
     * Obtener turnos por programa de estudio
     */
    @GetMapping("/programa/{programaId}")
    @Operation(summary = "Obtener turnos por programa", description = "Obtiene los turnos de un programa de estudio específico")
    @ApiResponse(responseCode = "200", description = "Lista de turnos del programa obtenida exitosamente")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<List<TurnoMatriculaResponse>> getTurnosByPrograma(
            @Parameter(description = "ID del programa de estudio", required = true)
            @PathVariable Long programaId) {
        List<TurnoMatriculaResponse> turnos = turnoMatriculaService.findByProgramaEstudio(programaId);
        return ResponseEntity.ok(turnos);
    }

    /**
     * Obtener turnos por período y programa
     */
    @GetMapping("/periodo/{periodoId}/programa/{programaId}")
    @Operation(summary = "Obtener turnos por período y programa", description = "Obtiene los turnos de un período académico y programa específicos")
    @ApiResponse(responseCode = "200", description = "Lista de turnos obtenida exitosamente")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<List<TurnoMatriculaResponse>> getTurnosByPeriodoAndPrograma(
            @Parameter(description = "ID del período académico", required = true)
            @PathVariable Long periodoId,
            @Parameter(description = "ID del programa de estudio", required = true)
            @PathVariable Long programaId) {
        List<TurnoMatriculaResponse> turnos = turnoMatriculaService.findByPeriodoAndPrograma(periodoId, programaId);
        return ResponseEntity.ok(turnos);
    }

    /**
     * Obtener turno por ID
     */
    @GetMapping("/{id}")
    @Operation(summary = "Obtener turno por ID", description = "Obtiene un turno específico por su ID")
    @ApiResponse(responseCode = "200", description = "Turno encontrado exitosamente")
    @ApiResponse(responseCode = "404", description = "Turno no encontrado")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<TurnoMatriculaResponse> getTurnoById(
            @Parameter(description = "ID del turno", required = true)
            @PathVariable Long id) {
        TurnoMatriculaResponse turno = turnoMatriculaService.findById(id);
        return ResponseEntity.ok(turno);
    }

    /**
     * Crear nuevo turno
     */
    @PostMapping
    @Operation(summary = "Crear nuevo turno", description = "Crea un nuevo turno de matrícula en el sistema")
    @ApiResponse(responseCode = "201", description = "Turno creado exitosamente")
    @ApiResponse(responseCode = "400", description = "Datos de entrada inválidos")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> createTurno(
            @Parameter(description = "Datos del nuevo turno", required = true)
            @Valid @RequestBody TurnoMatriculaRequest request) {
        TurnoMatriculaResponse nuevoTurno = turnoMatriculaService.create(request);
        MessageResponse response = MessageResponse.success("Turno de matrícula creado exitosamente", nuevoTurno);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * Actualizar turno existente
     */
    @PutMapping("/{id}")
    @Operation(summary = "Actualizar turno", description = "Actualiza un turno de matrícula existente")
    @ApiResponse(responseCode = "200", description = "Turno actualizado exitosamente")
    @ApiResponse(responseCode = "404", description = "Turno no encontrado")
    @ApiResponse(responseCode = "400", description = "Datos de entrada inválidos")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> updateTurno(
            @Parameter(description = "ID del turno", required = true)
            @PathVariable Long id,
            @Parameter(description = "Datos actualizados del turno", required = true)
            @Valid @RequestBody TurnoMatriculaRequest request) {
        TurnoMatriculaResponse turnoActualizado = turnoMatriculaService.update(id, request);
        MessageResponse response = MessageResponse.success("Turno de matrícula actualizado exitosamente", turnoActualizado);
        return ResponseEntity.ok(response);
    }

    /**
     * Activar/desactivar turno
     */
    @PatchMapping("/{id}/toggle-active")
    @Operation(summary = "Activar/desactivar turno", description = "Cambia el estado activo de un turno")
    @ApiResponse(responseCode = "200", description = "Estado del turno cambiado exitosamente")
    @ApiResponse(responseCode = "404", description = "Turno no encontrado")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> toggleActive(
            @Parameter(description = "ID del turno", required = true)
            @PathVariable Long id) {
        TurnoMatriculaResponse turnoActualizado = turnoMatriculaService.toggleActive(id);
        String mensaje = turnoActualizado.getActivo() ? "Turno activado exitosamente" : "Turno desactivado exitosamente";
        MessageResponse response = MessageResponse.success(mensaje, turnoActualizado);
        return ResponseEntity.ok(response);
    }

    /**
     * Habilitar/deshabilitar turno para matrícula
     */
    @PatchMapping("/{id}/toggle-enabled")
    @Operation(summary = "Habilitar/deshabilitar turno", description = "Cambia el estado habilitado de un turno para matrícula")
    @ApiResponse(responseCode = "200", description = "Estado habilitado del turno cambiado exitosamente")
    @ApiResponse(responseCode = "404", description = "Turno no encontrado")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> toggleEnabled(
            @Parameter(description = "ID del turno", required = true)
            @PathVariable Long id) {
        TurnoMatriculaResponse turnoActualizado = turnoMatriculaService.toggleEnabled(id);
        String mensaje = turnoActualizado.getHabilitado() ? "Turno habilitado para matrícula exitosamente" : "Turno deshabilitado para matrícula exitosamente";
        MessageResponse response = MessageResponse.success(mensaje, turnoActualizado);
        return ResponseEntity.ok(response);
    }

    /**
     * Eliminar turno (borrado lógico)
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar turno", description = "Realiza el borrado lógico de un turno")
    @ApiResponse(responseCode = "200", description = "Turno eliminado exitosamente")
    @ApiResponse(responseCode = "404", description = "Turno no encontrado")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> deleteTurno(
            @Parameter(description = "ID del turno", required = true)
            @PathVariable Long id) {
        turnoMatriculaService.delete(id);
        MessageResponse response = MessageResponse.success("Turno de matrícula eliminado exitosamente");
        return ResponseEntity.ok(response);
    }

    /**
     * Buscar turnos por nombre
     */
    @GetMapping("/buscar")
    @Operation(summary = "Buscar turnos por nombre", description = "Busca turnos que contengan el texto especificado en su nombre")
    @ApiResponse(responseCode = "200", description = "Búsqueda realizada exitosamente")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<List<TurnoMatriculaResponse>> buscarTurnosPorNombre(
            @Parameter(description = "Texto a buscar en el nombre", required = true)
            @RequestParam String nombre) {
        List<TurnoMatriculaResponse> turnos = turnoMatriculaService.findByNombreContaining(nombre);
        return ResponseEntity.ok(turnos);
    }
}
