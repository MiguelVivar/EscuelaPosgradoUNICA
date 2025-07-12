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
import com.escuelaposgrado.Matricula.dto.request.FacultadRequest;
import com.escuelaposgrado.Matricula.dto.response.FacultadResponse;
import com.escuelaposgrado.Matricula.service.FacultadService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

/**
 * Controlador REST para gestionar las facultades
 */
@RestController
@RequestMapping("/api/matricula/facultades")
@Tag(name = "Facultades", description = "API para gestionar facultades")
public class FacultadController {

    @Autowired
    private FacultadService facultadService;

    /**
     * Obtener todas las facultades
     */
    @GetMapping
    @Operation(summary = "Obtener todas las facultades", description = "Obtiene la lista de todas las facultades")
    @ApiResponse(responseCode = "200", description = "Lista de facultades obtenida exitosamente")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<List<FacultadResponse>> getAllFacultades() {
        List<FacultadResponse> facultades = facultadService.findAll();
        return ResponseEntity.ok(facultades);
    }

    /**
     * Obtener todas las facultades activas
     */
    @GetMapping("/activas")
    @Operation(summary = "Obtener facultades activas", description = "Obtiene la lista de facultades activas")
    @ApiResponse(responseCode = "200", description = "Lista de facultades activas obtenida exitosamente")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<List<FacultadResponse>> getFacultadesActivas() {
        List<FacultadResponse> facultades = facultadService.findAllActive();
        return ResponseEntity.ok(facultades);
    }

    /**
     * Obtener facultades con programas activos
     */
    @GetMapping("/con-programas")
    @Operation(summary = "Obtener facultades con programas activos", description = "Obtiene las facultades que tienen programas de estudio activos")
    @ApiResponse(responseCode = "200", description = "Lista de facultades con programas obtenida exitosamente")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<List<FacultadResponse>> getFacultadesConProgramas() {
        List<FacultadResponse> facultades = facultadService.findFacultadesConProgramasActivos();
        return ResponseEntity.ok(facultades);
    }

    /**
     * Obtener facultad por ID
     */
    @GetMapping("/{id}")
    @Operation(summary = "Obtener facultad por ID", description = "Obtiene una facultad específica por su ID")
    @ApiResponse(responseCode = "200", description = "Facultad encontrada exitosamente")
    @ApiResponse(responseCode = "404", description = "Facultad no encontrada")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<FacultadResponse> getFacultadById(
            @Parameter(description = "ID de la facultad", required = true)
            @PathVariable Long id) {
        FacultadResponse facultad = facultadService.findById(id);
        return ResponseEntity.ok(facultad);
    }

    /**
     * Crear nueva facultad
     */
    @PostMapping
    @Operation(summary = "Crear nueva facultad", description = "Crea una nueva facultad en el sistema")
    @ApiResponse(responseCode = "201", description = "Facultad creada exitosamente")
    @ApiResponse(responseCode = "400", description = "Datos de entrada inválidos")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> createFacultad(
            @Parameter(description = "Datos de la nueva facultad", required = true)
            @Valid @RequestBody FacultadRequest request) {
        FacultadResponse nuevaFacultad = facultadService.create(request);
        MessageResponse response = MessageResponse.success("Facultad creada exitosamente", nuevaFacultad);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * Actualizar facultad existente
     */
    @PutMapping("/{id}")
    @Operation(summary = "Actualizar facultad", description = "Actualiza una facultad existente")
    @ApiResponse(responseCode = "200", description = "Facultad actualizada exitosamente")
    @ApiResponse(responseCode = "404", description = "Facultad no encontrada")
    @ApiResponse(responseCode = "400", description = "Datos de entrada inválidos")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> updateFacultad(
            @Parameter(description = "ID de la facultad", required = true)
            @PathVariable Long id,
            @Parameter(description = "Datos actualizados de la facultad", required = true)
            @Valid @RequestBody FacultadRequest request) {
        FacultadResponse facultadActualizada = facultadService.update(id, request);
        MessageResponse response = MessageResponse.success("Facultad actualizada exitosamente", facultadActualizada);
        return ResponseEntity.ok(response);
    }

    /**
     * Activar/desactivar facultad
     */
    @PatchMapping("/{id}/toggle-active")
    @Operation(summary = "Activar/desactivar facultad", description = "Cambia el estado activo de una facultad")
    @ApiResponse(responseCode = "200", description = "Estado de la facultad cambiado exitosamente")
    @ApiResponse(responseCode = "404", description = "Facultad no encontrada")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> toggleActive(
            @Parameter(description = "ID de la facultad", required = true)
            @PathVariable Long id) {
        FacultadResponse facultadActualizada = facultadService.toggleActive(id);
        String mensaje = facultadActualizada.getActivo() ? "Facultad activada exitosamente" : "Facultad desactivada exitosamente";
        MessageResponse response = MessageResponse.success(mensaje, facultadActualizada);
        return ResponseEntity.ok(response);
    }

    /**
     * Eliminar facultad (borrado lógico)
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar facultad", description = "Realiza el borrado lógico de una facultad")
    @ApiResponse(responseCode = "200", description = "Facultad eliminada exitosamente")
    @ApiResponse(responseCode = "404", description = "Facultad no encontrada")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> deleteFacultad(
            @Parameter(description = "ID de la facultad", required = true)
            @PathVariable Long id) {
        facultadService.delete(id);
        MessageResponse response = MessageResponse.success("Facultad eliminada exitosamente");
        return ResponseEntity.ok(response);
    }

    /**
     * Buscar facultades por nombre
     */
    @GetMapping("/buscar")
    @Operation(summary = "Buscar facultades por nombre", description = "Busca facultades que contengan el texto especificado en su nombre")
    @ApiResponse(responseCode = "200", description = "Búsqueda realizada exitosamente")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<List<FacultadResponse>> buscarFacultadesPorNombre(
            @Parameter(description = "Texto a buscar en el nombre", required = true)
            @RequestParam String nombre) {
        List<FacultadResponse> facultades = facultadService.findByNombreContaining(nombre);
        return ResponseEntity.ok(facultades);
    }

    /**
     * Buscar facultades por decano
     */
    @GetMapping("/buscar-por-decano")
    @Operation(summary = "Buscar facultades por decano", description = "Busca facultades que contengan el texto especificado en el nombre del decano")
    @ApiResponse(responseCode = "200", description = "Búsqueda realizada exitosamente")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<List<FacultadResponse>> buscarFacultadesPorDecano(
            @Parameter(description = "Texto a buscar en el nombre del decano", required = true)
            @RequestParam String decano) {
        List<FacultadResponse> facultades = facultadService.findByDecanoContaining(decano);
        return ResponseEntity.ok(facultades);
    }
}
