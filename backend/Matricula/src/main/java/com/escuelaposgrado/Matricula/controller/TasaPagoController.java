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
import com.escuelaposgrado.Matricula.dto.request.TasaPagoRequest;
import com.escuelaposgrado.Matricula.dto.response.TasaPagoResponse;
import com.escuelaposgrado.Matricula.service.TasaPagoService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

/**
 * Controlador REST para gestionar las tasas de pago
 */
@RestController
@RequestMapping("/api/matricula/tasas-pago")
@Tag(name = "Tasas de Pago", description = "API para gestionar tasas de pago")
public class TasaPagoController {

    @Autowired
    private TasaPagoService tasaPagoService;

    /**
     * Obtener todas las tasas de pago
     */
    @GetMapping
    @Operation(summary = "Obtener todas las tasas de pago", description = "Obtiene la lista de todas las tasas de pago")
    @ApiResponse(responseCode = "200", description = "Lista de tasas obtenida exitosamente")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<List<TasaPagoResponse>> getAllTasasPago() {
        List<TasaPagoResponse> tasas = tasaPagoService.findAll();
        return ResponseEntity.ok(tasas);
    }

    /**
     * Obtener todas las tasas activas
     */
    @GetMapping("/activas")
    @Operation(summary = "Obtener tasas activas", description = "Obtiene la lista de tasas activas")
    @ApiResponse(responseCode = "200", description = "Lista de tasas activas obtenida exitosamente")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<List<TasaPagoResponse>> getTasasActivas() {
        List<TasaPagoResponse> tasas = tasaPagoService.findAllActive();
        return ResponseEntity.ok(tasas);
    }

    /**
     * Obtener tasas obligatorias
     */
    @GetMapping("/obligatorias")
    @Operation(summary = "Obtener tasas obligatorias", description = "Obtiene la lista de tasas obligatorias")
    @ApiResponse(responseCode = "200", description = "Lista de tasas obligatorias obtenida exitosamente")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<List<TasaPagoResponse>> getTasasObligatorias() {
        List<TasaPagoResponse> tasas = tasaPagoService.findAllObligatory();
        return ResponseEntity.ok(tasas);
    }

    /**
     * Obtener tasas por programa de estudio
     */
    @GetMapping("/programa/{programaId}")
    @Operation(summary = "Obtener tasas por programa", description = "Obtiene las tasas de un programa específico")
    @ApiResponse(responseCode = "200", description = "Lista de tasas del programa obtenida exitosamente")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<List<TasaPagoResponse>> getTasasByPrograma(
            @Parameter(description = "ID del programa de estudio", required = true)
            @PathVariable Long programaId) {
        List<TasaPagoResponse> tasas = tasaPagoService.findByProgramaEstudioId(programaId);
        return ResponseEntity.ok(tasas);
    }

    /**
     * Obtener tasas por tipo
     */
    @GetMapping("/tipo/{tipo}")
    @Operation(summary = "Obtener tasas por tipo", description = "Obtiene las tasas de un tipo específico")
    @ApiResponse(responseCode = "200", description = "Lista de tasas del tipo obtenida exitosamente")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<List<TasaPagoResponse>> getTasasByTipo(
            @Parameter(description = "Tipo de tasa", required = true)
            @PathVariable String tipo) {
        List<TasaPagoResponse> tasas = tasaPagoService.findByTipo(tipo);
        return ResponseEntity.ok(tasas);
    }

    /**
     * Obtener tipos de tasas disponibles
     */
    @GetMapping("/tipos")
    @Operation(summary = "Obtener tipos de tasas", description = "Obtiene la lista de tipos de tasas disponibles")
    @ApiResponse(responseCode = "200", description = "Lista de tipos obtenida exitosamente")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<List<String>> getTiposTasas() {
        List<String> tipos = tasaPagoService.findDistinctTipos();
        return ResponseEntity.ok(tipos);
    }

    /**
     * Obtener tasa por ID
     */
    @GetMapping("/{id}")
    @Operation(summary = "Obtener tasa por ID", description = "Obtiene una tasa específica por su ID")
    @ApiResponse(responseCode = "200", description = "Tasa encontrada exitosamente")
    @ApiResponse(responseCode = "404", description = "Tasa no encontrada")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<TasaPagoResponse> getTasaById(
            @Parameter(description = "ID de la tasa", required = true)
            @PathVariable Long id) {
        TasaPagoResponse tasa = tasaPagoService.findById(id);
        return ResponseEntity.ok(tasa);
    }

    /**
     * Buscar tasas por concepto
     */
    @GetMapping("/buscar")
    @Operation(summary = "Buscar tasas", description = "Busca tasas por concepto")
    @ApiResponse(responseCode = "200", description = "Búsqueda realizada exitosamente")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<List<TasaPagoResponse>> searchTasas(
            @Parameter(description = "Término de búsqueda", required = true)
            @RequestParam String q) {
        List<TasaPagoResponse> tasas = tasaPagoService.searchByConcepto(q);
        return ResponseEntity.ok(tasas);
    }

    /**
     * Crear nueva tasa de pago
     */
    @PostMapping
    @Operation(summary = "Crear tasa", description = "Crea una nueva tasa de pago")
    @ApiResponse(responseCode = "201", description = "Tasa creada exitosamente")
    @ApiResponse(responseCode = "400", description = "Datos de entrada inválidos")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> createTasa(@Valid @RequestBody TasaPagoRequest request) {
        tasaPagoService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new MessageResponse("Tasa de pago creada exitosamente", true));
    }

    /**
     * Actualizar tasa existente
     */
    @PutMapping("/{id}")
    @Operation(summary = "Actualizar tasa", description = "Actualiza una tasa de pago existente")
    @ApiResponse(responseCode = "200", description = "Tasa actualizada exitosamente")
    @ApiResponse(responseCode = "404", description = "Tasa no encontrada")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> updateTasa(
            @Parameter(description = "ID de la tasa", required = true)
            @PathVariable Long id,
            @Valid @RequestBody TasaPagoRequest request) {
        tasaPagoService.update(id, request);
        return ResponseEntity.ok(new MessageResponse("Tasa de pago actualizada exitosamente", true));
    }

    /**
     * Cambiar estado activo/inactivo
     */
    @PatchMapping("/{id}/toggle-active")
    @Operation(summary = "Cambiar estado de la tasa", description = "Activa o desactiva una tasa de pago")
    @ApiResponse(responseCode = "200", description = "Estado cambiado exitosamente")
    @ApiResponse(responseCode = "404", description = "Tasa no encontrada")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> toggleActive(
            @Parameter(description = "ID de la tasa", required = true)
            @PathVariable Long id) {
        tasaPagoService.toggleActive(id);
        return ResponseEntity.ok(new MessageResponse("Estado de la tasa cambiado exitosamente", true));
    }

    /**
     * Eliminar tasa de pago
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar tasa", description = "Elimina una tasa de pago")
    @ApiResponse(responseCode = "200", description = "Tasa eliminada exitosamente")
    @ApiResponse(responseCode = "404", description = "Tasa no encontrada")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> deleteTasa(
            @Parameter(description = "ID de la tasa", required = true)
            @PathVariable Long id) {
        tasaPagoService.delete(id);
        return ResponseEntity.ok(new MessageResponse("Tasa de pago eliminada exitosamente", true));
    }
}
