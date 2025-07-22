package com.escuelaposgrado.Intranet.controller;

import com.escuelaposgrado.Intranet.dto.AsistenciaDTO;
import com.escuelaposgrado.Intranet.service.AsistenciaService;
import com.escuelaposgrado.Intranet.security.jwt.JwtUtils;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/**
 * Controlador REST para la gestión de asistencias
 */
@RestController
@RequestMapping("/api/asistencias")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AsistenciaController {
    
    @Autowired
    private AsistenciaService asistenciaService;
    
    @Autowired
    private JwtUtils jwtUtils;
    
    /**
     * Registrar nueva asistencia
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('COORDINADOR') or hasRole('DOCENTE')")
    public ResponseEntity<?> registrarAsistencia(
            @Valid @RequestBody AsistenciaDTO asistenciaDTO,
            @RequestHeader("Authorization") String token) {
        try {
            String jwt = token.substring(7);
            String username = jwtUtils.getUserNameFromJwtToken(jwt);
            
            AsistenciaDTO nuevaAsistencia = asistenciaService.registrarAsistencia(asistenciaDTO, username);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevaAsistencia);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MensajeResponse("Error: " + e.getMessage()));
        }
    }
    
    /**
     * Actualizar asistencia
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('COORDINADOR') or hasRole('DOCENTE')")
    public ResponseEntity<?> actualizarAsistencia(
            @PathVariable Long id, 
            @Valid @RequestBody AsistenciaDTO asistenciaDTO) {
        try {
            AsistenciaDTO asistenciaActualizada = asistenciaService.actualizarAsistencia(id, asistenciaDTO);
            return ResponseEntity.ok(asistenciaActualizada);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MensajeResponse("Error: " + e.getMessage()));
        }
    }
    
    /**
     * Obtener asistencias por estudiante
     */
    @GetMapping("/estudiante/{estudianteId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('COORDINADOR') or hasRole('DOCENTE') or @usuarioService.esUsuarioActual(#estudianteId, authentication.name)")
    public ResponseEntity<List<AsistenciaDTO>> obtenerAsistenciasPorEstudiante(@PathVariable Long estudianteId) {
        try {
            List<AsistenciaDTO> asistencias = asistenciaService.obtenerAsistenciasPorEstudiante(estudianteId);
            return ResponseEntity.ok(asistencias);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Obtener asistencias por materia
     */
    @GetMapping("/materia/{materiaId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('COORDINADOR') or hasRole('DOCENTE')")
    public ResponseEntity<List<AsistenciaDTO>> obtenerAsistenciasPorMateria(@PathVariable Long materiaId) {
        try {
            List<AsistenciaDTO> asistencias = asistenciaService.obtenerAsistenciasPorMateria(materiaId);
            return ResponseEntity.ok(asistencias);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Obtener asistencias por estudiante y materia
     */
    @GetMapping("/estudiante/{estudianteId}/materia/{materiaId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('COORDINADOR') or hasRole('DOCENTE') or @usuarioService.esUsuarioActual(#estudianteId, authentication.name)")
    public ResponseEntity<List<AsistenciaDTO>> obtenerAsistenciasPorEstudianteYMateria(
            @PathVariable Long estudianteId, 
            @PathVariable Long materiaId) {
        try {
            List<AsistenciaDTO> asistencias = asistenciaService.obtenerAsistenciasPorEstudianteYMateria(estudianteId, materiaId);
            return ResponseEntity.ok(asistencias);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Obtener asistencias por rango de fechas
     */
    @GetMapping("/fechas")
    @PreAuthorize("hasRole('ADMIN') or hasRole('COORDINADOR') or hasRole('DOCENTE')")
    public ResponseEntity<List<AsistenciaDTO>> obtenerAsistenciasPorFechas(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin) {
        try {
            List<AsistenciaDTO> asistencias = asistenciaService.obtenerAsistenciasPorFechas(fechaInicio, fechaFin);
            return ResponseEntity.ok(asistencias);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Obtener asistencias del día
     */
    @GetMapping("/hoy")
    @PreAuthorize("hasRole('ADMIN') or hasRole('COORDINADOR') or hasRole('DOCENTE')")
    public ResponseEntity<List<AsistenciaDTO>> obtenerAsistenciasDelDia() {
        List<AsistenciaDTO> asistencias = asistenciaService.obtenerAsistenciasDelDia(LocalDate.now());
        return ResponseEntity.ok(asistencias);
    }
    
    /**
     * Calcular porcentaje de asistencia
     */
    @GetMapping("/porcentaje/estudiante/{estudianteId}/materia/{materiaId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('COORDINADOR') or hasRole('DOCENTE') or @usuarioService.esUsuarioActual(#estudianteId, authentication.name)")
    public ResponseEntity<Double> calcularPorcentajeAsistencia(
            @PathVariable Long estudianteId, 
            @PathVariable Long materiaId) {
        try {
            Double porcentaje = asistenciaService.calcularPorcentajeAsistencia(estudianteId, materiaId);
            return ResponseEntity.ok(porcentaje);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Obtener estadísticas de asistencia por estudiante
     */
    @GetMapping("/estadisticas/estudiante/{estudianteId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('COORDINADOR') or hasRole('DOCENTE') or @usuarioService.esUsuarioActual(#estudianteId, authentication.name)")
    public ResponseEntity<?> obtenerEstadisticasEstudiante(@PathVariable Long estudianteId) {
        try {
            var estadisticas = asistenciaService.obtenerEstadisticasEstudiante(estudianteId);
            return ResponseEntity.ok(estadisticas);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Obtener reporte de asistencia por materia y fecha
     */
    @GetMapping("/reporte/materia/{materiaId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('COORDINADOR') or hasRole('DOCENTE')")
    public ResponseEntity<List<AsistenciaDTO>> obtenerReporteAsistencia(
            @PathVariable Long materiaId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {
        try {
            List<AsistenciaDTO> reporte = asistenciaService.obtenerReporteAsistencia(materiaId, fecha);
            return ResponseEntity.ok(reporte);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Eliminar asistencia
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('COORDINADOR')")
    public ResponseEntity<?> eliminarAsistencia(@PathVariable Long id) {
        try {
            asistenciaService.eliminarAsistencia(id);
            return ResponseEntity.ok(new MensajeResponse("Asistencia eliminada correctamente"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MensajeResponse("Error: " + e.getMessage()));
        }
    }
}

/**
 * Clase para respuestas con mensaje
 */
class MensajeResponse {
    private String mensaje;
    
    public MensajeResponse(String mensaje) {
        this.mensaje = mensaje;
    }
    
    public String getMensaje() { return mensaje; }
    public void setMensaje(String mensaje) { this.mensaje = mensaje; }
}
