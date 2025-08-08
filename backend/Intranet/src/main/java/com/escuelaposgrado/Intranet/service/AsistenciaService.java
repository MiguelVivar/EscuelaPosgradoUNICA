package com.escuelaposgrado.Intranet.service;

import com.escuelaposgrado.Intranet.dto.AsistenciaDTO;
import com.escuelaposgrado.Intranet.model.Asistencia;
import com.escuelaposgrado.Intranet.model.Usuario;
import com.escuelaposgrado.Intranet.model.Materia;
import com.escuelaposgrado.Intranet.model.EstadoAsistencia;
import com.escuelaposgrado.Intranet.repository.AsistenciaRepository;
import com.escuelaposgrado.Intranet.repository.UsuarioRepository;
import com.escuelaposgrado.Intranet.repository.MateriaRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Servicio para la gestión de asistencias
 */
@Service
@Transactional
public class AsistenciaService {
    
    @Autowired
    private AsistenciaRepository asistenciaRepository;
    
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @Autowired
    private MateriaRepository materiaRepository;
    
    /**
     * Registrar nueva asistencia
     */
    public AsistenciaDTO registrarAsistencia(AsistenciaDTO asistenciaDTO, String registradoPor) {
        // Validar que no exista una asistencia para la misma fecha
        Usuario estudiante = usuarioRepository.findById(asistenciaDTO.getEstudianteId())
            .orElseThrow(() -> new RuntimeException("Estudiante no encontrado"));
        
        Materia materia = materiaRepository.findById(asistenciaDTO.getMateriaId())
            .orElseThrow(() -> new RuntimeException("Materia no encontrada"));
        
        if (asistenciaRepository.existsByEstudianteAndMateriaAndFecha(
                estudiante, materia, asistenciaDTO.getFecha())) {
            throw new RuntimeException("Ya existe un registro de asistencia para esta fecha");
        }
        
        Asistencia asistencia = new Asistencia();
        asistencia.setEstudiante(estudiante);
        asistencia.setMateria(materia);
        asistencia.setFecha(asistenciaDTO.getFecha());
        asistencia.setHoraEntrada(asistenciaDTO.getHoraEntrada());
        asistencia.setHoraSalida(asistenciaDTO.getHoraSalida());
        asistencia.setEstado(EstadoAsistencia.valueOf(asistenciaDTO.getEstado()));
        asistencia.setObservaciones(asistenciaDTO.getObservaciones());
        asistencia.setHorasAcademicas(asistenciaDTO.getHorasAcademicas());
        asistencia.setRegistradoPor(registradoPor);
        
        asistencia = asistenciaRepository.save(asistencia);
        
        return convertirADTO(asistencia);
    }
    
    /**
     * Actualizar asistencia existente
     */
    public AsistenciaDTO actualizarAsistencia(Long id, AsistenciaDTO asistenciaDTO) {
        Asistencia asistencia = asistenciaRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Asistencia no encontrada"));
        
        asistencia.setHoraEntrada(asistenciaDTO.getHoraEntrada());
        asistencia.setHoraSalida(asistenciaDTO.getHoraSalida());
        asistencia.setEstado(EstadoAsistencia.valueOf(asistenciaDTO.getEstado()));
        asistencia.setObservaciones(asistenciaDTO.getObservaciones());
        asistencia.setHorasAcademicas(asistenciaDTO.getHorasAcademicas());
        
        asistencia = asistenciaRepository.save(asistencia);
        
        return convertirADTO(asistencia);
    }
    
    /**
     * Obtener asistencias por estudiante
     */
    @Transactional(readOnly = true)
    public List<AsistenciaDTO> obtenerAsistenciasPorEstudiante(Long estudianteId) {
        Usuario estudiante = usuarioRepository.findById(estudianteId)
            .orElseThrow(() -> new RuntimeException("Estudiante no encontrado"));
        
        return asistenciaRepository.findByEstudiante(estudiante)
            .stream()
            .map(this::convertirADTO)
            .collect(Collectors.toList());
    }
    
    /**
     * Obtener asistencias por materia
     */
    @Transactional(readOnly = true)
    public List<AsistenciaDTO> obtenerAsistenciasPorMateria(Long materiaId) {
        Materia materia = materiaRepository.findById(materiaId)
            .orElseThrow(() -> new RuntimeException("Materia no encontrada"));
        
        return asistenciaRepository.findByMateria(materia)
            .stream()
            .map(this::convertirADTO)
            .collect(Collectors.toList());
    }
    
    /**
     * Obtener asistencias por estudiante y materia
     */
    @Transactional(readOnly = true)
    public List<AsistenciaDTO> obtenerAsistenciasPorEstudianteYMateria(Long estudianteId, Long materiaId) {
        Usuario estudiante = usuarioRepository.findById(estudianteId)
            .orElseThrow(() -> new RuntimeException("Estudiante no encontrado"));
        
        Materia materia = materiaRepository.findById(materiaId)
            .orElseThrow(() -> new RuntimeException("Materia no encontrada"));
        
        return asistenciaRepository.findByEstudianteAndMateria(estudiante, materia)
            .stream()
            .map(this::convertirADTO)
            .collect(Collectors.toList());
    }
    
    /**
     * Obtener asistencias por rango de fechas
     */
    @Transactional(readOnly = true)
    public List<AsistenciaDTO> obtenerAsistenciasPorFechas(LocalDate fechaInicio, LocalDate fechaFin) {
        return asistenciaRepository.findByFechaBetween(fechaInicio, fechaFin)
            .stream()
            .map(this::convertirADTO)
            .collect(Collectors.toList());
    }
    
    /**
     * Obtener asistencias del día
     */
    @Transactional(readOnly = true)
    public List<AsistenciaDTO> obtenerAsistenciasDelDia(LocalDate fecha) {
        return asistenciaRepository.findAsistenciasDelDia(fecha)
            .stream()
            .map(this::convertirADTO)
            .collect(Collectors.toList());
    }
    
    /**
     * Calcular porcentaje de asistencia de un estudiante en una materia
     */
    @Transactional(readOnly = true)
    public Double calcularPorcentajeAsistencia(Long estudianteId, Long materiaId) {
        Usuario estudiante = usuarioRepository.findById(estudianteId)
            .orElseThrow(() -> new RuntimeException("Estudiante no encontrado"));
        
        Materia materia = materiaRepository.findById(materiaId)
            .orElseThrow(() -> new RuntimeException("Materia no encontrada"));
        
        long totalAsistencias = asistenciaRepository.countTotalAsistencias(estudiante, materia);
        long asistenciasPresente = asistenciaRepository.countAsistenciasPresente(estudiante, materia);
        
        if (totalAsistencias == 0) {
            return 0.0;
        }
        
        return (asistenciasPresente * 100.0) / totalAsistencias;
    }
    
    /**
     * Obtener estadísticas de asistencia por estudiante
     */
    @Transactional(readOnly = true)
    public EstadisticasAsistenciaDTO obtenerEstadisticasEstudiante(Long estudianteId) {
        Usuario estudiante = usuarioRepository.findById(estudianteId)
            .orElseThrow(() -> new RuntimeException("Estudiante no encontrado"));
        
        long totalPresente = asistenciaRepository.countByEstudianteAndEstado(estudiante, EstadoAsistencia.PRESENTE);
        long totalAusente = asistenciaRepository.countByEstudianteAndEstado(estudiante, EstadoAsistencia.AUSENTE);
        long totalTardanza = asistenciaRepository.countByEstudianteAndEstado(estudiante, EstadoAsistencia.TARDANZA);
        long totalJustificado = asistenciaRepository.countByEstudianteAndEstado(estudiante, EstadoAsistencia.JUSTIFICADO);
        
        long total = totalPresente + totalAusente + totalTardanza + totalJustificado;
        double porcentaje = total > 0 ? (totalPresente * 100.0) / total : 0.0;
        
        EstadisticasAsistenciaDTO estadisticas = new EstadisticasAsistenciaDTO();
        estadisticas.setEstudianteId(estudianteId);
        estadisticas.setEstudianteNombre(estudiante.getNombreCompleto());
        estadisticas.setTotalPresente(totalPresente);
        estadisticas.setTotalAusente(totalAusente);
        estadisticas.setTotalTardanza(totalTardanza);
        estadisticas.setTotalJustificado(totalJustificado);
        estadisticas.setTotalClases(total);
        estadisticas.setPorcentajeAsistencia(porcentaje);
        
        return estadisticas;
    }
    
    /**
     * Obtener reporte de asistencia por materia y fecha
     */
    @Transactional(readOnly = true)
    public List<AsistenciaDTO> obtenerReporteAsistencia(Long materiaId, LocalDate fecha) {
        Materia materia = materiaRepository.findById(materiaId)
            .orElseThrow(() -> new RuntimeException("Materia no encontrada"));
        
        return asistenciaRepository.findReporteAsistenciaPorMateriaYFecha(materia, fecha)
            .stream()
            .map(this::convertirADTO)
            .collect(Collectors.toList());
    }
    
    /**
     * Eliminar asistencia
     */
    public void eliminarAsistencia(Long id) {
        if (!asistenciaRepository.existsById(id)) {
            throw new RuntimeException("Asistencia no encontrada");
        }
        asistenciaRepository.deleteById(id);
    }
    
    /**
     * Convertir entidad a DTO
     */
    private AsistenciaDTO convertirADTO(Asistencia asistencia) {
        AsistenciaDTO dto = new AsistenciaDTO();
        dto.setId(asistencia.getId());
        dto.setEstudianteId(asistencia.getEstudiante().getId());
        dto.setMateriaId(asistencia.getMateria().getId());
        dto.setFecha(asistencia.getFecha());
        dto.setHoraEntrada(asistencia.getHoraEntrada());
        dto.setHoraSalida(asistencia.getHoraSalida());
        dto.setEstado(asistencia.getEstado().name());
        dto.setObservaciones(asistencia.getObservaciones());
        dto.setHorasAcademicas(asistencia.getHorasAcademicas());
        dto.setEstudianteNombre(asistencia.getEstudiante().getNombreCompleto());
        dto.setMateriaNombre(asistencia.getMateria().getNombre());
        dto.setRegistradoPor(asistencia.getRegistradoPor());
        
        return dto;
    }
}

/**
 * DTO para estadísticas de asistencia
 */
class EstadisticasAsistenciaDTO {
    private Long estudianteId;
    private String estudianteNombre;
    private Long totalPresente;
    private Long totalAusente;
    private Long totalTardanza;
    private Long totalJustificado;
    private Long totalClases;
    private Double porcentajeAsistencia;
    
    // Getters y Setters
    public Long getEstudianteId() { return estudianteId; }
    public void setEstudianteId(Long estudianteId) { this.estudianteId = estudianteId; }
    
    public String getEstudianteNombre() { return estudianteNombre; }
    public void setEstudianteNombre(String estudianteNombre) { this.estudianteNombre = estudianteNombre; }
    
    public Long getTotalPresente() { return totalPresente; }
    public void setTotalPresente(Long totalPresente) { this.totalPresente = totalPresente; }
    
    public Long getTotalAusente() { return totalAusente; }
    public void setTotalAusente(Long totalAusente) { this.totalAusente = totalAusente; }
    
    public Long getTotalTardanza() { return totalTardanza; }
    public void setTotalTardanza(Long totalTardanza) { this.totalTardanza = totalTardanza; }
    
    public Long getTotalJustificado() { return totalJustificado; }
    public void setTotalJustificado(Long totalJustificado) { this.totalJustificado = totalJustificado; }
    
    public Long getTotalClases() { return totalClases; }
    public void setTotalClases(Long totalClases) { this.totalClases = totalClases; }
    
    public Double getPorcentajeAsistencia() { return porcentajeAsistencia; }
    public void setPorcentajeAsistencia(Double porcentajeAsistencia) { this.porcentajeAsistencia = porcentajeAsistencia; }
}
