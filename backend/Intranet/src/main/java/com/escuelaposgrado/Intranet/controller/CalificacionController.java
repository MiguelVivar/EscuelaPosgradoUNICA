package com.escuelaposgrado.Intranet.controller;

import com.escuelaposgrado.Intranet.dto.CalificacionDTO;
import com.escuelaposgrado.Intranet.service.CalificacionService;
import com.escuelaposgrado.Intranet.security.jwt.JwtUtils;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

/**
 * Controlador REST para la gestión de calificaciones
 */
@RestController
@RequestMapping("/api/calificaciones")
@CrossOrigin(origins = "*", maxAge = 3600)
public class CalificacionController {
    
    @Autowired
    private CalificacionService calificacionService;
    
    @Autowired
    private JwtUtils jwtUtils;
    
    /**
     * Registrar nueva calificación
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('COORDINADOR') or hasRole('DOCENTE')")
    public ResponseEntity<?> registrarCalificacion(
            @Valid @RequestBody CalificacionDTO calificacionDTO,
            @RequestHeader("Authorization") String token) {
        try {
            String jwt = token.substring(7);
            String username = jwtUtils.getUserNameFromJwtToken(jwt);
            
            CalificacionDTO nuevaCalificacion = calificacionService.registrarCalificacion(calificacionDTO, username);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevaCalificacion);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MensajeResponse("Error: " + e.getMessage()));
        }
    }
    
    /**
     * Actualizar calificación
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('COORDINADOR') or hasRole('DOCENTE')")
    public ResponseEntity<?> actualizarCalificacion(
            @PathVariable Long id, 
            @Valid @RequestBody CalificacionDTO calificacionDTO) {
        try {
            CalificacionDTO calificacionActualizada = calificacionService.actualizarCalificacion(id, calificacionDTO);
            return ResponseEntity.ok(calificacionActualizada);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MensajeResponse("Error: " + e.getMessage()));
        }
    }
    
    /**
     * Corregir calificación
     */
    @PatchMapping("/{id}/corregir")
    @PreAuthorize("hasRole('ADMIN') or hasRole('COORDINADOR')")
    public ResponseEntity<?> corregirCalificacion(
            @PathVariable Long id,
            @RequestBody CorreccionRequest request,
            @RequestHeader("Authorization") String token) {
        try {
            String jwt = token.substring(7);
            String username = jwtUtils.getUserNameFromJwtToken(jwt);
            
            CalificacionDTO calificacionCorregida = calificacionService.corregirCalificacion(
                id, request.getNuevaNota(), request.getMotivo(), username);
            return ResponseEntity.ok(calificacionCorregida);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MensajeResponse("Error: " + e.getMessage()));
        }
    }
    
    /**
     * Obtener calificaciones por estudiante
     */
    @GetMapping("/estudiante/{estudianteId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('COORDINADOR') or hasRole('DOCENTE') or @usuarioService.esUsuarioActual(#estudianteId, authentication.name)")
    public ResponseEntity<List<CalificacionDTO>> obtenerCalificacionesPorEstudiante(@PathVariable Long estudianteId) {
        try {
            List<CalificacionDTO> calificaciones = calificacionService.obtenerCalificacionesPorEstudiante(estudianteId);
            return ResponseEntity.ok(calificaciones);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Obtener calificaciones por materia
     */
    @GetMapping("/materia/{materiaId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('COORDINADOR') or hasRole('DOCENTE')")
    public ResponseEntity<List<CalificacionDTO>> obtenerCalificacionesPorMateria(@PathVariable Long materiaId) {
        try {
            List<CalificacionDTO> calificaciones = calificacionService.obtenerCalificacionesPorMateria(materiaId);
            return ResponseEntity.ok(calificaciones);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Obtener calificaciones por estudiante y materia
     */
    @GetMapping("/estudiante/{estudianteId}/materia/{materiaId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('COORDINADOR') or hasRole('DOCENTE') or @usuarioService.esUsuarioActual(#estudianteId, authentication.name)")
    public ResponseEntity<List<CalificacionDTO>> obtenerCalificacionesPorEstudianteYMateria(
            @PathVariable Long estudianteId, 
            @PathVariable Long materiaId) {
        try {
            List<CalificacionDTO> calificaciones = calificacionService.obtenerCalificacionesPorEstudianteYMateria(estudianteId, materiaId);
            return ResponseEntity.ok(calificaciones);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Obtener calificaciones por ciclo y año
     */
    @GetMapping("/ciclo/{ciclo}/anio/{anio}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('COORDINADOR') or hasRole('DOCENTE')")
    public ResponseEntity<List<CalificacionDTO>> obtenerCalificacionesPorCicloYAnio(
            @PathVariable String ciclo, 
            @PathVariable Integer anio) {
        try {
            List<CalificacionDTO> calificaciones = calificacionService.obtenerCalificacionesPorCicloYAnio(ciclo, anio);
            return ResponseEntity.ok(calificaciones);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Calcular promedio de estudiante en materia
     */
    @GetMapping("/promedio/estudiante/{estudianteId}/materia/{materiaId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('COORDINADOR') or hasRole('DOCENTE') or @usuarioService.esUsuarioActual(#estudianteId, authentication.name)")
    public ResponseEntity<BigDecimal> calcularPromedioEstudianteMateria(
            @PathVariable Long estudianteId, 
            @PathVariable Long materiaId) {
        try {
            BigDecimal promedio = calificacionService.calcularPromedioEstudianteMateria(estudianteId, materiaId);
            return ResponseEntity.ok(promedio);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Calcular promedio ponderado
     */
    @GetMapping("/promedio-ponderado/estudiante/{estudianteId}/materia/{materiaId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('COORDINADOR') or hasRole('DOCENTE') or @usuarioService.esUsuarioActual(#estudianteId, authentication.name)")
    public ResponseEntity<BigDecimal> calcularPromedioPonderado(
            @PathVariable Long estudianteId, 
            @PathVariable Long materiaId) {
        try {
            BigDecimal promedio = calificacionService.calcularPromedioPonderado(estudianteId, materiaId);
            return ResponseEntity.ok(promedio);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Obtener estadísticas de materia
     */
    @GetMapping("/estadisticas/materia/{materiaId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('COORDINADOR') or hasRole('DOCENTE')")
    public ResponseEntity<?> obtenerEstadisticasMateria(@PathVariable Long materiaId) {
        try {
            var estadisticas = calificacionService.obtenerEstadisticasMateria(materiaId);
            return ResponseEntity.ok(estadisticas);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Obtener ranking de estudiantes
     */
    @GetMapping("/ranking/materia/{materiaId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('COORDINADOR') or hasRole('DOCENTE')")
    public ResponseEntity<?> obtenerRankingEstudiantes(
            @PathVariable Long materiaId,
            @RequestParam(defaultValue = "10") Integer limite) {
        try {
            var ranking = calificacionService.obtenerRankingEstudiantes(materiaId, limite);
            return ResponseEntity.ok(ranking);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Obtener calificaciones pendientes
     */
    @GetMapping("/pendientes")
    @PreAuthorize("hasRole('ADMIN') or hasRole('COORDINADOR') or hasRole('DOCENTE')")
    public ResponseEntity<List<CalificacionDTO>> obtenerCalificacionesPendientes() {
        List<CalificacionDTO> pendientes = calificacionService.obtenerCalificacionesPendientes();
        return ResponseEntity.ok(pendientes);
    }
    
    /**
     * Eliminar calificación
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('COORDINADOR')")
    public ResponseEntity<?> eliminarCalificacion(@PathVariable Long id) {
        try {
            calificacionService.eliminarCalificacion(id);
            return ResponseEntity.ok(new MensajeResponse("Calificación eliminada correctamente"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MensajeResponse("Error: " + e.getMessage()));
        }
    }
}

/**
 * Request para corrección de calificaciones
 */
class CorreccionRequest {
    private BigDecimal nuevaNota;
    private String motivo;
    
    public BigDecimal getNuevaNota() { return nuevaNota; }
    public void setNuevaNota(BigDecimal nuevaNota) { this.nuevaNota = nuevaNota; }
    
    public String getMotivo() { return motivo; }
    public void setMotivo(String motivo) { this.motivo = motivo; }
}
