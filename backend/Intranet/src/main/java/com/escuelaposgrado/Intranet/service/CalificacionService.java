package com.escuelaposgrado.Intranet.service;

import com.escuelaposgrado.Intranet.dto.CalificacionDTO;
import com.escuelaposgrado.Intranet.model.Calificacion;
import com.escuelaposgrado.Intranet.model.Usuario;
import com.escuelaposgrado.Intranet.model.Materia;
import com.escuelaposgrado.Intranet.model.TipoEvaluacion;
import com.escuelaposgrado.Intranet.model.Ciclo;
import com.escuelaposgrado.Intranet.repository.CalificacionRepository;
import com.escuelaposgrado.Intranet.repository.UsuarioRepository;
import com.escuelaposgrado.Intranet.repository.MateriaRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;
import java.util.stream.Collectors;

/**
 * Servicio para la gestión de calificaciones
 */
@Service
@Transactional
public class CalificacionService {
    
    @Autowired
    private CalificacionRepository calificacionRepository;
    
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @Autowired
    private MateriaRepository materiaRepository;
    
    /**
     * Registrar nueva calificación
     */
    public CalificacionDTO registrarCalificacion(CalificacionDTO calificacionDTO, String registradoPor) {
        Usuario estudiante = usuarioRepository.findById(calificacionDTO.getEstudianteId())
            .orElseThrow(() -> new RuntimeException("Estudiante no encontrado"));
        
        Materia materia = materiaRepository.findById(calificacionDTO.getMateriaId())
            .orElseThrow(() -> new RuntimeException("Materia no encontrada"));
        
        // Validar que no exista la misma evaluación para el estudiante
        if (calificacionRepository.existsByEstudianteAndMateriaAndTipoEvaluacionAndFechaEvaluacion(
                estudiante, materia, TipoEvaluacion.valueOf(calificacionDTO.getTipoEvaluacion()), 
                calificacionDTO.getFechaEvaluacion())) {
            throw new RuntimeException("Ya existe una calificación de este tipo para esta fecha");
        }
        
        Calificacion calificacion = new Calificacion();
        calificacion.setEstudiante(estudiante);
        calificacion.setMateria(materia);
        calificacion.setNota(calificacionDTO.getNota());
        calificacion.setTipoEvaluacion(TipoEvaluacion.valueOf(calificacionDTO.getTipoEvaluacion()));
        calificacion.setFechaEvaluacion(calificacionDTO.getFechaEvaluacion());
        calificacion.setPeso(calificacionDTO.getPeso());
        calificacion.setObservaciones(calificacionDTO.getObservaciones());
        calificacion.setCiclo(Ciclo.valueOf(calificacionDTO.getCiclo()));
        calificacion.setAnio(calificacionDTO.getAnio());
        calificacion.setRegistradoPor(registradoPor);
        
        calificacion = calificacionRepository.save(calificacion);
        
        return convertirADTO(calificacion);
    }
    
    /**
     * Actualizar calificación existente
     */
    public CalificacionDTO actualizarCalificacion(Long id, CalificacionDTO calificacionDTO) {
        Calificacion calificacion = calificacionRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Calificación no encontrada"));
        
        calificacion.setNota(calificacionDTO.getNota());
        calificacion.setTipoEvaluacion(TipoEvaluacion.valueOf(calificacionDTO.getTipoEvaluacion()));
        calificacion.setFechaEvaluacion(calificacionDTO.getFechaEvaluacion());
        calificacion.setPeso(calificacionDTO.getPeso());
        calificacion.setObservaciones(calificacionDTO.getObservaciones());
        calificacion.setCiclo(Ciclo.valueOf(calificacionDTO.getCiclo()));
        calificacion.setAnio(calificacionDTO.getAnio());
        
        calificacion = calificacionRepository.save(calificacion);
        
        return convertirADTO(calificacion);
    }
    
    /**
     * Corregir calificación (historial de cambios)
     */
    public CalificacionDTO corregirCalificacion(Long id, BigDecimal nuevaNota, String motivoCorreccion, String corregidoPor) {
        Calificacion calificacion = calificacionRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Calificación no encontrada"));
        
        // Guardar la nota anterior en observaciones con historial
        String observacionesActuales = calificacion.getObservaciones() != null ? calificacion.getObservaciones() : "";
        String historialCorreccion = String.format("[CORRECCIÓN %s] Nota anterior: %s -> Nueva nota: %s. Motivo: %s. Corregido por: %s\n%s",
            LocalDate.now(), calificacion.getNota(), nuevaNota, motivoCorreccion, corregidoPor, observacionesActuales);
        
        calificacion.setNota(nuevaNota);
        calificacion.setObservaciones(historialCorreccion);
        
        calificacion = calificacionRepository.save(calificacion);
        
        return convertirADTO(calificacion);
    }
    
    /**
     * Obtener calificaciones por estudiante
     */
    @Transactional(readOnly = true)
    public List<CalificacionDTO> obtenerCalificacionesPorEstudiante(Long estudianteId) {
        Usuario estudiante = usuarioRepository.findById(estudianteId)
            .orElseThrow(() -> new RuntimeException("Estudiante no encontrado"));
        
        return calificacionRepository.findByEstudiante(estudiante)
            .stream()
            .map(this::convertirADTO)
            .collect(Collectors.toList());
    }
    
    /**
     * Obtener calificaciones por materia
     */
    @Transactional(readOnly = true)
    public List<CalificacionDTO> obtenerCalificacionesPorMateria(Long materiaId) {
        Materia materia = materiaRepository.findById(materiaId)
            .orElseThrow(() -> new RuntimeException("Materia no encontrada"));
        
        return calificacionRepository.findByMateria(materia)
            .stream()
            .map(this::convertirADTO)
            .collect(Collectors.toList());
    }
    
    /**
     * Obtener calificaciones por estudiante y materia
     */
    @Transactional(readOnly = true)
    public List<CalificacionDTO> obtenerCalificacionesPorEstudianteYMateria(Long estudianteId, Long materiaId) {
        Usuario estudiante = usuarioRepository.findById(estudianteId)
            .orElseThrow(() -> new RuntimeException("Estudiante no encontrado"));
        
        Materia materia = materiaRepository.findById(materiaId)
            .orElseThrow(() -> new RuntimeException("Materia no encontrada"));
        
        return calificacionRepository.findByEstudianteAndMateria(estudiante, materia)
            .stream()
            .map(this::convertirADTO)
            .collect(Collectors.toList());
    }
    
    /**
     * Obtener calificaciones por ciclo y año
     */
    @Transactional(readOnly = true)
    public List<CalificacionDTO> obtenerCalificacionesPorCicloYAnio(String ciclo, Integer anio) {
        return calificacionRepository.findByCicloAndAnio(Ciclo.valueOf(ciclo), anio)
            .stream()
            .map(this::convertirADTO)
            .collect(Collectors.toList());
    }
    
    /**
     * Calcular promedio de un estudiante en una materia
     */
    @Transactional(readOnly = true)
    public BigDecimal calcularPromedioEstudianteMateria(Long estudianteId, Long materiaId) {
        Usuario estudiante = usuarioRepository.findById(estudianteId)
            .orElseThrow(() -> new RuntimeException("Estudiante no encontrado"));
        
        Materia materia = materiaRepository.findById(materiaId)
            .orElseThrow(() -> new RuntimeException("Materia no encontrada"));
        
        BigDecimal promedio = calificacionRepository.calcularPromedioEstudianteMateria(estudiante, materia);
        return promedio != null ? promedio.setScale(2, RoundingMode.HALF_UP) : BigDecimal.ZERO;
    }
    
    /**
     * Calcular promedio ponderado de un estudiante en una materia
     */
    @Transactional(readOnly = true)
    public BigDecimal calcularPromedioPonderado(Long estudianteId, Long materiaId) {
        Usuario estudiante = usuarioRepository.findById(estudianteId)
            .orElseThrow(() -> new RuntimeException("Estudiante no encontrado"));
        
        Materia materia = materiaRepository.findById(materiaId)
            .orElseThrow(() -> new RuntimeException("Materia no encontrada"));
        
        List<Calificacion> calificaciones = calificacionRepository.findByEstudianteAndMateria(estudiante, materia);
        
        if (calificaciones.isEmpty()) {
            return BigDecimal.ZERO;
        }
        
        BigDecimal sumaNotas = BigDecimal.ZERO;
        BigDecimal sumaPesos = BigDecimal.ZERO;
        
        for (Calificacion calificacion : calificaciones) {
            BigDecimal peso = calificacion.getPeso() != null ? calificacion.getPeso() : BigDecimal.ONE;
            sumaNotas = sumaNotas.add(calificacion.getNota().multiply(peso));
            sumaPesos = sumaPesos.add(peso);
        }
        
        if (sumaPesos.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }
        
        return sumaNotas.divide(sumaPesos, 2, RoundingMode.HALF_UP);
    }
    
    /**
     * Obtener estadísticas de calificaciones por materia
     */
    @Transactional(readOnly = true)
    public EstadisticasCalificacionDTO obtenerEstadisticasMateria(Long materiaId) {
        Materia materia = materiaRepository.findById(materiaId)
            .orElseThrow(() -> new RuntimeException("Materia no encontrada"));
        
        BigDecimal promedio = calificacionRepository.calcularPromedioMateria(materia);
        BigDecimal notaMaxima = calificacionRepository.obtenerNotaMaximaMateria(materia);
        BigDecimal notaMinima = calificacionRepository.obtenerNotaMinimaMateria(materia);
        Long totalCalificaciones = calificacionRepository.countCalificacionesMateria(materia);
        
        EstadisticasCalificacionDTO estadisticas = new EstadisticasCalificacionDTO();
        estadisticas.setMateriaId(materiaId);
        estadisticas.setMateriaNombre(materia.getNombre());
        estadisticas.setPromedio(promedio != null ? promedio.setScale(2, RoundingMode.HALF_UP) : BigDecimal.ZERO);
        estadisticas.setNotaMaxima(notaMaxima != null ? notaMaxima : BigDecimal.ZERO);
        estadisticas.setNotaMinima(notaMinima != null ? notaMinima : BigDecimal.ZERO);
        estadisticas.setTotalCalificaciones(totalCalificaciones);
        
        return estadisticas;
    }
    
    /**
     * Obtener ranking de estudiantes por promedio en una materia
     */
    @Transactional(readOnly = true)
    public List<RankingEstudianteDTO> obtenerRankingEstudiantes(Long materiaId, Integer limite) {
        Materia materia = materiaRepository.findById(materiaId)
            .orElseThrow(() -> new RuntimeException("Materia no encontrada"));
        
        // Obtener todas las calificaciones de la materia
        List<Calificacion> calificaciones = calificacionRepository.findByMateria(materia);
        
        // Agrupar por estudiante y calcular promedio
        Map<Usuario, List<Calificacion>> calificacionesPorEstudiante = calificaciones.stream()
            .collect(Collectors.groupingBy(Calificacion::getEstudiante));
        
        List<RankingEstudianteDTO> ranking = new ArrayList<>();
        
        for (Map.Entry<Usuario, List<Calificacion>> entry : calificacionesPorEstudiante.entrySet()) {
            Usuario estudiante = entry.getKey();
            List<Calificacion> calificacionesEstudiante = entry.getValue();
            
            BigDecimal promedio = calificacionesEstudiante.stream()
                .map(Calificacion::getNota)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .divide(BigDecimal.valueOf(calificacionesEstudiante.size()), 2, RoundingMode.HALF_UP);
            
            RankingEstudianteDTO rankingDTO = new RankingEstudianteDTO();
            rankingDTO.setEstudianteId(estudiante.getId());
            rankingDTO.setEstudianteNombre(estudiante.getNombreCompleto());
            rankingDTO.setPromedio(promedio);
            
            ranking.add(rankingDTO);
        }
        
        // Ordenar por promedio descendente
        ranking.sort((a, b) -> b.getPromedio().compareTo(a.getPromedio()));
        
        // Asignar posiciones
        for (int i = 0; i < ranking.size(); i++) {
            ranking.get(i).setPosicion(i + 1);
        }
        
        // Limitar resultados
        int maxResultados = limite != null ? limite : 10;
        return ranking.stream()
            .limit(maxResultados)
            .collect(Collectors.toList());
    }
    
    /**
     * Obtener calificaciones pendientes de evaluación
     */
    @Transactional(readOnly = true)
    public List<CalificacionDTO> obtenerCalificacionesPendientes() {
        return calificacionRepository.findCalificacionesPendientes()
            .stream()
            .map(this::convertirADTO)
            .collect(Collectors.toList());
    }
    
    /**
     * Eliminar calificación
     */
    public void eliminarCalificacion(Long id) {
        if (!calificacionRepository.existsById(id)) {
            throw new RuntimeException("Calificación no encontrada");
        }
        calificacionRepository.deleteById(id);
    }
    
    /**
     * Convertir entidad a DTO
     */
    private CalificacionDTO convertirADTO(Calificacion calificacion) {
        CalificacionDTO dto = new CalificacionDTO();
        dto.setId(calificacion.getId());
        dto.setEstudianteId(calificacion.getEstudiante().getId());
        dto.setMateriaId(calificacion.getMateria().getId());
        dto.setNota(calificacion.getNota());
        dto.setTipoEvaluacion(calificacion.getTipoEvaluacion().name());
        dto.setFechaEvaluacion(calificacion.getFechaEvaluacion());
        dto.setPeso(calificacion.getPeso());
        dto.setObservaciones(calificacion.getObservaciones());
        dto.setCiclo(calificacion.getCiclo().name());
        dto.setAnio(calificacion.getAnio());
        dto.setEstudianteNombre(calificacion.getEstudiante().getNombreCompleto());
        dto.setMateriaNombre(calificacion.getMateria().getNombre());
        dto.setRegistradoPor(calificacion.getRegistradoPor());
        
        return dto;
    }
}

/**
 * DTO para estadísticas de calificaciones
 */
class EstadisticasCalificacionDTO {
    private Long materiaId;
    private String materiaNombre;
    private BigDecimal promedio;
    private BigDecimal notaMaxima;
    private BigDecimal notaMinima;
    private Long totalCalificaciones;
    
    // Getters y Setters
    public Long getMateriaId() { return materiaId; }
    public void setMateriaId(Long materiaId) { this.materiaId = materiaId; }
    
    public String getMateriaNombre() { return materiaNombre; }
    public void setMateriaNombre(String materiaNombre) { this.materiaNombre = materiaNombre; }
    
    public BigDecimal getPromedio() { return promedio; }
    public void setPromedio(BigDecimal promedio) { this.promedio = promedio; }
    
    public BigDecimal getNotaMaxima() { return notaMaxima; }
    public void setNotaMaxima(BigDecimal notaMaxima) { this.notaMaxima = notaMaxima; }
    
    public BigDecimal getNotaMinima() { return notaMinima; }
    public void setNotaMinima(BigDecimal notaMinima) { this.notaMinima = notaMinima; }
    
    public Long getTotalCalificaciones() { return totalCalificaciones; }
    public void setTotalCalificaciones(Long totalCalificaciones) { this.totalCalificaciones = totalCalificaciones; }
}

/**
 * DTO para ranking de estudiantes
 */
class RankingEstudianteDTO {
    private Long estudianteId;
    private String estudianteNombre;
    private BigDecimal promedio;
    private Integer posicion;
    
    // Getters y Setters
    public Long getEstudianteId() { return estudianteId; }
    public void setEstudianteId(Long estudianteId) { this.estudianteId = estudianteId; }
    
    public String getEstudianteNombre() { return estudianteNombre; }
    public void setEstudianteNombre(String estudianteNombre) { this.estudianteNombre = estudianteNombre; }
    
    public BigDecimal getPromedio() { return promedio; }
    public void setPromedio(BigDecimal promedio) { this.promedio = promedio; }
    
    public Integer getPosicion() { return posicion; }
    public void setPosicion(Integer posicion) { this.posicion = posicion; }
}
