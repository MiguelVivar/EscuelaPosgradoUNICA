package com.escuelaposgrado.Intranet.service;

import com.escuelaposgrado.Intranet.dto.EncuestaDTO;
import com.escuelaposgrado.Intranet.dto.PreguntaEncuestaDTO;
import com.escuelaposgrado.Intranet.model.Encuesta;
import com.escuelaposgrado.Intranet.model.PreguntaEncuesta;
import com.escuelaposgrado.Intranet.model.RespuestaEncuesta;
import com.escuelaposgrado.Intranet.model.Usuario;
import com.escuelaposgrado.Intranet.model.Materia;
import com.escuelaposgrado.Intranet.model.TipoEncuesta;
import com.escuelaposgrado.Intranet.model.TipoPregunta;
import com.escuelaposgrado.Intranet.repository.EncuestaRepository;
import com.escuelaposgrado.Intranet.repository.PreguntaEncuestaRepository;
import com.escuelaposgrado.Intranet.repository.RespuestaEncuestaRepository;
import com.escuelaposgrado.Intranet.repository.UsuarioRepository;
import com.escuelaposgrado.Intranet.repository.MateriaRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;

/**
 * Servicio para la gestión de encuestas
 */
@Service
@Transactional
public class EncuestaService {
    
    @Autowired
    private EncuestaRepository encuestaRepository;
    
    @Autowired
    private PreguntaEncuestaRepository preguntaRepository;
    
    @Autowired
    private RespuestaEncuestaRepository respuestaRepository;
    
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @Autowired
    private MateriaRepository materiaRepository;
    
    /**
     * Crear nueva encuesta
     */
    public EncuestaDTO crearEncuesta(EncuestaDTO encuestaDTO, String creadoPor) {
        Encuesta encuesta = new Encuesta();
        encuesta.setTitulo(encuestaDTO.getTitulo());
        encuesta.setDescripcion(encuestaDTO.getDescripcion());
        encuesta.setTipo(TipoEncuesta.valueOf(encuestaDTO.getTipo()));
        encuesta.setFechaInicio(encuestaDTO.getFechaInicio());
        encuesta.setFechaFin(encuestaDTO.getFechaFin());
        encuesta.setActiva(encuestaDTO.getActiva() != null ? encuestaDTO.getActiva() : true);
        encuesta.setAnonima(encuestaDTO.getAnonima() != null ? encuestaDTO.getAnonima() : false);
        encuesta.setCreadoPor(creadoPor);
        
        // Asociar materia si es especificada
        if (encuestaDTO.getMateriaId() != null) {
            Materia materia = materiaRepository.findById(encuestaDTO.getMateriaId())
                .orElseThrow(() -> new RuntimeException("Materia no encontrada"));
            encuesta.setMateria(materia);
        }
        
        encuesta = encuestaRepository.save(encuesta);
        
        return convertirADTO(encuesta);
    }
    
    /**
     * Actualizar encuesta existente
     */
    public EncuestaDTO actualizarEncuesta(Long id, EncuestaDTO encuestaDTO) {
        Encuesta encuesta = encuestaRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Encuesta no encontrada"));
        
        encuesta.setTitulo(encuestaDTO.getTitulo());
        encuesta.setDescripcion(encuestaDTO.getDescripcion());
        encuesta.setTipo(TipoEncuesta.valueOf(encuestaDTO.getTipo()));
        encuesta.setFechaInicio(encuestaDTO.getFechaInicio());
        encuesta.setFechaFin(encuestaDTO.getFechaFin());
        encuesta.setActiva(encuestaDTO.getActiva());
        encuesta.setAnonima(encuestaDTO.getAnonima());
        
        encuesta = encuestaRepository.save(encuesta);
        
        return convertirADTO(encuesta);
    }
    
    /**
     * Agregar pregunta a encuesta
     */
    public PreguntaEncuestaDTO agregarPregunta(Long encuestaId, PreguntaEncuestaDTO preguntaDTO) {
        Encuesta encuesta = encuestaRepository.findById(encuestaId)
            .orElseThrow(() -> new RuntimeException("Encuesta no encontrada"));
        
        PreguntaEncuesta pregunta = new PreguntaEncuesta();
        pregunta.setEncuesta(encuesta);
        pregunta.setTexto(preguntaDTO.getTexto());
        pregunta.setTipo(TipoPregunta.valueOf(preguntaDTO.getTipo()));
        pregunta.setOrden(preguntaDTO.getOrden());
        pregunta.setObligatoria(preguntaDTO.getObligatoria() != null ? preguntaDTO.getObligatoria() : true);
        pregunta.setOpciones(preguntaDTO.getOpciones());
        
        pregunta = preguntaRepository.save(pregunta);
        
        return convertirPreguntaADTO(pregunta);
    }
    
    /**
     * Responder encuesta
     */
    public void responderEncuesta(Long encuestaId, Long usuarioId, Map<Long, String> respuestas) {
        Encuesta encuesta = encuestaRepository.findById(encuestaId)
            .orElseThrow(() -> new RuntimeException("Encuesta no encontrada"));
        
        Usuario usuario = usuarioRepository.findById(usuarioId)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        // Verificar que la encuesta esté activa
        if (!encuesta.getActiva()) {
            throw new RuntimeException("La encuesta no está activa");
        }
        
        // Verificar fechas
        LocalDate hoy = LocalDate.now();
        if (hoy.isBefore(encuesta.getFechaInicio()) || hoy.isAfter(encuesta.getFechaFin())) {
            throw new RuntimeException("La encuesta no está en el periodo válido");
        }
        
        // Verificar si ya respondió (si no es anónima)
        if (!encuesta.getAnonima() && respuestaRepository.existsByEncuestaAndUsuario(encuesta, usuario)) {
            throw new RuntimeException("Ya has respondido esta encuesta");
        }
        
        // Guardar respuestas
        for (Map.Entry<Long, String> entry : respuestas.entrySet()) {
            PreguntaEncuesta pregunta = preguntaRepository.findById(entry.getKey())
                .orElseThrow(() -> new RuntimeException("Pregunta no encontrada"));
            
            if (!pregunta.getEncuesta().getId().equals(encuestaId)) {
                throw new RuntimeException("La pregunta no pertenece a esta encuesta");
            }
            
            RespuestaEncuesta respuesta = new RespuestaEncuesta();
            respuesta.setEncuesta(encuesta);
            respuesta.setPregunta(pregunta);
            respuesta.setRespuesta(entry.getValue());
            
            if (!encuesta.getAnonima()) {
                respuesta.setUsuario(usuario);
            }
            
            respuestaRepository.save(respuesta);
        }
    }
    
    /**
     * Obtener encuestas activas
     */
    @Transactional(readOnly = true)
    public List<EncuestaDTO> obtenerEncuestasActivas() {
        return encuestaRepository.findEncuestasActivas()
            .stream()
            .map(this::convertirADTO)
            .collect(Collectors.toList());
    }
    
    /**
     * Obtener encuestas por tipo
     */
    @Transactional(readOnly = true)
    public List<EncuestaDTO> obtenerEncuestasPorTipo(String tipo) {
        return encuestaRepository.findByTipo(TipoEncuesta.valueOf(tipo))
            .stream()
            .map(this::convertirADTO)
            .collect(Collectors.toList());
    }
    
    /**
     * Obtener encuestas por materia
     */
    @Transactional(readOnly = true)
    public List<EncuestaDTO> obtenerEncuestasPorMateria(Long materiaId) {
        Materia materia = materiaRepository.findById(materiaId)
            .orElseThrow(() -> new RuntimeException("Materia no encontrada"));
        
        return encuestaRepository.findByMateria(materia)
            .stream()
            .map(this::convertirADTO)
            .collect(Collectors.toList());
    }
    
    /**
     * Obtener preguntas de una encuesta
     */
    @Transactional(readOnly = true)
    public List<PreguntaEncuestaDTO> obtenerPreguntasEncuesta(Long encuestaId) {
        Encuesta encuesta = encuestaRepository.findById(encuestaId)
            .orElseThrow(() -> new RuntimeException("Encuesta no encontrada"));
        
        return preguntaRepository.findByEncuestaOrderByOrden(encuesta)
            .stream()
            .map(this::convertirPreguntaADTO)
            .collect(Collectors.toList());
    }
    
    /**
     * Obtener resultados de encuesta
     */
    @Transactional(readOnly = true)
    public ResultadosEncuestaDTO obtenerResultadosEncuesta(Long encuestaId) {
        Encuesta encuesta = encuestaRepository.findById(encuestaId)
            .orElseThrow(() -> new RuntimeException("Encuesta no encontrada"));
        
        List<RespuestaEncuesta> respuestas = respuestaRepository.findByEncuesta(encuesta);
        List<PreguntaEncuesta> preguntas = preguntaRepository.findByEncuestaOrderByOrden(encuesta);
        
        ResultadosEncuestaDTO resultados = new ResultadosEncuestaDTO();
        resultados.setEncuestaId(encuestaId);
        resultados.setEncuestaTitulo(encuesta.getTitulo());
        resultados.setTotalRespuestas((long) respuestas.size());
        
        Map<Long, EstadisticasPreguntaDTO> estadisticasPorPregunta = new HashMap<>();
        
        for (PreguntaEncuesta pregunta : preguntas) {
            List<RespuestaEncuesta> respuestasPregunta = respuestas.stream()
                .filter(r -> r.getPregunta().getId().equals(pregunta.getId()))
                .collect(Collectors.toList());
            
            EstadisticasPreguntaDTO estadisticas = new EstadisticasPreguntaDTO();
            estadisticas.setPreguntaId(pregunta.getId());
            estadisticas.setPreguntaTexto(pregunta.getTexto());
            estadisticas.setTipoPregunta(pregunta.getTipo().name());
            estadisticas.setTotalRespuestas((long) respuestasPregunta.size());
            
            // Contar respuestas por opción
            Map<String, Long> conteoRespuestas = respuestasPregunta.stream()
                .collect(Collectors.groupingBy(
                    RespuestaEncuesta::getRespuesta,
                    Collectors.counting()
                ));
            
            estadisticas.setConteoRespuestas(conteoRespuestas);
            estadisticasPorPregunta.put(pregunta.getId(), estadisticas);
        }
        
        resultados.setEstadisticasPorPregunta(estadisticasPorPregunta);
        
        return resultados;
    }
    
    /**
     * Activar/Desactivar encuesta
     */
    public void cambiarEstadoEncuesta(Long id, Boolean activa) {
        Encuesta encuesta = encuestaRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Encuesta no encontrada"));
        
        encuesta.setActiva(activa);
        encuestaRepository.save(encuesta);
    }
    
    /**
     * Eliminar encuesta
     */
    public void eliminarEncuesta(Long id) {
        if (!encuestaRepository.existsById(id)) {
            throw new RuntimeException("Encuesta no encontrada");
        }
        encuestaRepository.deleteById(id);
    }
    
    /**
     * Convertir entidad a DTO
     */
    private EncuestaDTO convertirADTO(Encuesta encuesta) {
        EncuestaDTO dto = new EncuestaDTO();
        dto.setId(encuesta.getId());
        dto.setTitulo(encuesta.getTitulo());
        dto.setDescripcion(encuesta.getDescripcion());
        dto.setTipo(encuesta.getTipo().name());
        dto.setFechaInicio(encuesta.getFechaInicio());
        dto.setFechaFin(encuesta.getFechaFin());
        dto.setActiva(encuesta.getActiva());
        dto.setAnonima(encuesta.getAnonima());
        dto.setCreadoPor(encuesta.getCreadoPor());
        
        if (encuesta.getMateria() != null) {
            dto.setMateriaId(encuesta.getMateria().getId());
            dto.setMateriaNombre(encuesta.getMateria().getNombre());
        }
        
        return dto;
    }
    
    /**
     * Convertir pregunta a DTO
     */
    private PreguntaEncuestaDTO convertirPreguntaADTO(PreguntaEncuesta pregunta) {
        PreguntaEncuestaDTO dto = new PreguntaEncuestaDTO();
        dto.setId(pregunta.getId());
        dto.setEncuestaId(pregunta.getEncuesta().getId());
        dto.setTexto(pregunta.getTexto());
        dto.setTipo(pregunta.getTipo().name());
        dto.setOrden(pregunta.getOrden());
        dto.setObligatoria(pregunta.getObligatoria());
        dto.setOpciones(pregunta.getOpciones());
        
        return dto;
    }
}

/**
 * DTO para resultados de encuesta
 */
class ResultadosEncuestaDTO {
    private Long encuestaId;
    private String encuestaTitulo;
    private Long totalRespuestas;
    private Map<Long, EstadisticasPreguntaDTO> estadisticasPorPregunta;
    
    // Getters y Setters
    public Long getEncuestaId() { return encuestaId; }
    public void setEncuestaId(Long encuestaId) { this.encuestaId = encuestaId; }
    
    public String getEncuestaTitulo() { return encuestaTitulo; }
    public void setEncuestaTitulo(String encuestaTitulo) { this.encuestaTitulo = encuestaTitulo; }
    
    public Long getTotalRespuestas() { return totalRespuestas; }
    public void setTotalRespuestas(Long totalRespuestas) { this.totalRespuestas = totalRespuestas; }
    
    public Map<Long, EstadisticasPreguntaDTO> getEstadisticasPorPregunta() { return estadisticasPorPregunta; }
    public void setEstadisticasPorPregunta(Map<Long, EstadisticasPreguntaDTO> estadisticasPorPregunta) { 
        this.estadisticasPorPregunta = estadisticasPorPregunta; 
    }
}

/**
 * DTO para estadísticas de pregunta
 */
class EstadisticasPreguntaDTO {
    private Long preguntaId;
    private String preguntaTexto;
    private String tipoPregunta;
    private Long totalRespuestas;
    private Map<String, Long> conteoRespuestas;
    
    // Getters y Setters
    public Long getPreguntaId() { return preguntaId; }
    public void setPreguntaId(Long preguntaId) { this.preguntaId = preguntaId; }
    
    public String getPreguntaTexto() { return preguntaTexto; }
    public void setPreguntaTexto(String preguntaTexto) { this.preguntaTexto = preguntaTexto; }
    
    public String getTipoPregunta() { return tipoPregunta; }
    public void setTipoPregunta(String tipoPregunta) { this.tipoPregunta = tipoPregunta; }
    
    public Long getTotalRespuestas() { return totalRespuestas; }
    public void setTotalRespuestas(Long totalRespuestas) { this.totalRespuestas = totalRespuestas; }
    
    public Map<String, Long> getConteoRespuestas() { return conteoRespuestas; }
    public void setConteoRespuestas(Map<String, Long> conteoRespuestas) { this.conteoRespuestas = conteoRespuestas; }
}
