package com.escuelaposgrado.Intranet.controller;

import com.escuelaposgrado.Intranet.dto.EncuestaDTO;
import com.escuelaposgrado.Intranet.dto.PreguntaEncuestaDTO;
import com.escuelaposgrado.Intranet.service.EncuestaService;
import com.escuelaposgrado.Intranet.security.jwt.JwtUtils;
import com.escuelaposgrado.Intranet.service.UsuarioService;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Controlador REST para la gestión de encuestas
 */
@RestController
@RequestMapping("/api/encuestas")
@CrossOrigin(origins = "*", maxAge = 3600)
public class EncuestaController {
    
    @Autowired
    private EncuestaService encuestaService;
    
    @Autowired
    private UsuarioService usuarioService;
    
    @Autowired
    private JwtUtils jwtUtils;
    
    /**
     * Crear nueva encuesta
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('COORDINADOR')")
    public ResponseEntity<?> crearEncuesta(
            @Valid @RequestBody EncuestaDTO encuestaDTO,
            @RequestHeader("Authorization") String token) {
        try {
            String jwt = token.substring(7);
            String username = jwtUtils.getUserNameFromJwtToken(jwt);
            
            EncuestaDTO nuevaEncuesta = encuestaService.crearEncuesta(encuestaDTO, username);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevaEncuesta);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MensajeResponse("Error: " + e.getMessage()));
        }
    }
    
    /**
     * Actualizar encuesta
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('COORDINADOR')")
    public ResponseEntity<?> actualizarEncuesta(
            @PathVariable Long id, 
            @Valid @RequestBody EncuestaDTO encuestaDTO) {
        try {
            EncuestaDTO encuestaActualizada = encuestaService.actualizarEncuesta(id, encuestaDTO);
            return ResponseEntity.ok(encuestaActualizada);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MensajeResponse("Error: " + e.getMessage()));
        }
    }
    
    /**
     * Agregar pregunta a encuesta
     */
    @PostMapping("/{encuestaId}/preguntas")
    @PreAuthorize("hasRole('ADMIN') or hasRole('COORDINADOR')")
    public ResponseEntity<?> agregarPregunta(
            @PathVariable Long encuestaId,
            @Valid @RequestBody PreguntaEncuestaDTO preguntaDTO) {
        try {
            PreguntaEncuestaDTO nuevaPregunta = encuestaService.agregarPregunta(encuestaId, preguntaDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevaPregunta);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MensajeResponse("Error: " + e.getMessage()));
        }
    }
    
    /**
     * Responder encuesta
     */
    @PostMapping("/{encuestaId}/responder")
    @PreAuthorize("hasRole('ALUMNO') or hasRole('DOCENTE')")
    public ResponseEntity<?> responderEncuesta(
            @PathVariable Long encuestaId,
            @RequestBody Map<Long, String> respuestas,
            @RequestHeader("Authorization") String token) {
        try {
            String jwt = token.substring(7);
            String username = jwtUtils.getUserNameFromJwtToken(jwt);
            
            // Obtener el usuario actual por username
            var usuarioOptional = usuarioService.obtenerUsuarioEntidadPorEmail(username);
            if (usuarioOptional.isEmpty()) {
                return ResponseEntity.badRequest().body(new MensajeResponse("Usuario no encontrado"));
            }
            
            Long usuarioId = usuarioOptional.get().getId();
            encuestaService.responderEncuesta(encuestaId, usuarioId, respuestas);
            
            return ResponseEntity.ok(new MensajeResponse("Encuesta respondida correctamente"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MensajeResponse("Error: " + e.getMessage()));
        }
    }
    
    /**
     * Obtener encuestas activas
     */
    @GetMapping("/activas")
    @PreAuthorize("hasRole('ALUMNO') or hasRole('DOCENTE') or hasRole('COORDINADOR') or hasRole('ADMIN')")
    public ResponseEntity<List<EncuestaDTO>> obtenerEncuestasActivas() {
        List<EncuestaDTO> encuestas = encuestaService.obtenerEncuestasActivas();
        return ResponseEntity.ok(encuestas);
    }
    
    /**
     * Obtener encuestas por tipo
     */
    @GetMapping("/tipo/{tipo}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('COORDINADOR') or hasRole('DOCENTE')")
    public ResponseEntity<List<EncuestaDTO>> obtenerEncuestasPorTipo(@PathVariable String tipo) {
        try {
            List<EncuestaDTO> encuestas = encuestaService.obtenerEncuestasPorTipo(tipo);
            return ResponseEntity.ok(encuestas);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Obtener encuestas por materia
     */
    @GetMapping("/materia/{materiaId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('COORDINADOR') or hasRole('DOCENTE')")
    public ResponseEntity<List<EncuestaDTO>> obtenerEncuestasPorMateria(@PathVariable Long materiaId) {
        try {
            List<EncuestaDTO> encuestas = encuestaService.obtenerEncuestasPorMateria(materiaId);
            return ResponseEntity.ok(encuestas);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Obtener preguntas de una encuesta
     */
    @GetMapping("/{encuestaId}/preguntas")
    @PreAuthorize("hasRole('ALUMNO') or hasRole('DOCENTE') or hasRole('COORDINADOR') or hasRole('ADMIN')")
    public ResponseEntity<List<PreguntaEncuestaDTO>> obtenerPreguntasEncuesta(@PathVariable Long encuestaId) {
        try {
            List<PreguntaEncuestaDTO> preguntas = encuestaService.obtenerPreguntasEncuesta(encuestaId);
            return ResponseEntity.ok(preguntas);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Obtener resultados de encuesta
     */
    @GetMapping("/{encuestaId}/resultados")
    @PreAuthorize("hasRole('ADMIN') or hasRole('COORDINADOR')")
    public ResponseEntity<?> obtenerResultadosEncuesta(@PathVariable Long encuestaId) {
        try {
            var resultados = encuestaService.obtenerResultadosEncuesta(encuestaId);
            return ResponseEntity.ok(resultados);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Activar/Desactivar encuesta
     */
    @PatchMapping("/{id}/estado")
    @PreAuthorize("hasRole('ADMIN') or hasRole('COORDINADOR')")
    public ResponseEntity<?> cambiarEstadoEncuesta(
            @PathVariable Long id, 
            @RequestParam Boolean activa) {
        try {
            encuestaService.cambiarEstadoEncuesta(id, activa);
            String mensaje = activa ? "Encuesta activada" : "Encuesta desactivada";
            return ResponseEntity.ok(new MensajeResponse(mensaje + " correctamente"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MensajeResponse("Error: " + e.getMessage()));
        }
    }
    
    /**
     * Obtener todas las encuestas (para administradores)
     */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('COORDINADOR')")
    public ResponseEntity<List<EncuestaDTO>> obtenerTodasLasEncuestas() {
        List<EncuestaDTO> encuestas = encuestaService.obtenerEncuestasActivas(); // Puedes crear un método para obtener todas
        return ResponseEntity.ok(encuestas);
    }
    
    /**
     * Eliminar encuesta
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> eliminarEncuesta(@PathVariable Long id) {
        try {
            encuestaService.eliminarEncuesta(id);
            return ResponseEntity.ok(new MensajeResponse("Encuesta eliminada correctamente"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MensajeResponse("Error: " + e.getMessage()));
        }
    }
}
