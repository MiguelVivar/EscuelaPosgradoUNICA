package com.escuelaposgrado.Intranet.dto;

import java.math.BigDecimal;
import java.util.List;

/**
 * DTO para reportes académicos de estudiantes
 */
public class ReporteAcademicoDTO {
    
    private Long estudianteId;
    private String estudianteNombre;
    private String estudianteCodigo;
    private String estudianteEmail;
    
    // Estadísticas de asistencia
    private Integer totalClases;
    private Integer clasesAsistidas;
    private Integer faltas;
    private Integer tardanzas;
    private Double porcentajeAsistencia;
    
    // Estadísticas de calificaciones
    private BigDecimal promedioGeneral;
    private BigDecimal notaMaxima;
    private BigDecimal notaMinima;
    private Integer materiasAprobadas;
    private Integer materiasDesaprobadas;
    private Integer totalMaterias;
    
    // Lista de calificaciones por materia
    private List<CalificacionPorMateriaDTO> calificacionesPorMateria;
    
    // Lista de asistencias por materia
    private List<AsistenciaPorMateriaDTO> asistenciasPorMateria;
    
    // Estado académico
    private String estadoAcademico; // "REGULAR", "EN_RIESGO", "CRITICO"
    private Boolean requiereAtencion;
    private String observaciones;
    
    // Constructors
    public ReporteAcademicoDTO() {}
    
    public ReporteAcademicoDTO(Long estudianteId, String estudianteNombre, String estudianteCodigo) {
        this.estudianteId = estudianteId;
        this.estudianteNombre = estudianteNombre;
        this.estudianteCodigo = estudianteCodigo;
    }
    
    // Getters y Setters
    public Long getEstudianteId() { return estudianteId; }
    public void setEstudianteId(Long estudianteId) { this.estudianteId = estudianteId; }
    
    public String getEstudianteNombre() { return estudianteNombre; }
    public void setEstudianteNombre(String estudianteNombre) { this.estudianteNombre = estudianteNombre; }
    
    public String getEstudianteCodigo() { return estudianteCodigo; }
    public void setEstudianteCodigo(String estudianteCodigo) { this.estudianteCodigo = estudianteCodigo; }
    
    public String getEstudianteEmail() { return estudianteEmail; }
    public void setEstudianteEmail(String estudianteEmail) { this.estudianteEmail = estudianteEmail; }
    
    public Integer getTotalClases() { return totalClases; }
    public void setTotalClases(Integer totalClases) { this.totalClases = totalClases; }
    
    public Integer getClasesAsistidas() { return clasesAsistidas; }
    public void setClasesAsistidas(Integer clasesAsistidas) { this.clasesAsistidas = clasesAsistidas; }
    
    public Integer getFaltas() { return faltas; }
    public void setFaltas(Integer faltas) { this.faltas = faltas; }
    
    public Integer getTardanzas() { return tardanzas; }
    public void setTardanzas(Integer tardanzas) { this.tardanzas = tardanzas; }
    
    public Double getPorcentajeAsistencia() { return porcentajeAsistencia; }
    public void setPorcentajeAsistencia(Double porcentajeAsistencia) { this.porcentajeAsistencia = porcentajeAsistencia; }
    
    public BigDecimal getPromedioGeneral() { return promedioGeneral; }
    public void setPromedioGeneral(BigDecimal promedioGeneral) { this.promedioGeneral = promedioGeneral; }
    
    public BigDecimal getNotaMaxima() { return notaMaxima; }
    public void setNotaMaxima(BigDecimal notaMaxima) { this.notaMaxima = notaMaxima; }
    
    public BigDecimal getNotaMinima() { return notaMinima; }
    public void setNotaMinima(BigDecimal notaMinima) { this.notaMinima = notaMinima; }
    
    public Integer getMateriasAprobadas() { return materiasAprobadas; }
    public void setMateriasAprobadas(Integer materiasAprobadas) { this.materiasAprobadas = materiasAprobadas; }
    
    public Integer getMateriasDesaprobadas() { return materiasDesaprobadas; }
    public void setMateriasDesaprobadas(Integer materiasDesaprobadas) { this.materiasDesaprobadas = materiasDesaprobadas; }
    
    public Integer getTotalMaterias() { return totalMaterias; }
    public void setTotalMaterias(Integer totalMaterias) { this.totalMaterias = totalMaterias; }
    
    public List<CalificacionPorMateriaDTO> getCalificacionesPorMateria() { return calificacionesPorMateria; }
    public void setCalificacionesPorMateria(List<CalificacionPorMateriaDTO> calificacionesPorMateria) { 
        this.calificacionesPorMateria = calificacionesPorMateria; 
    }
    
    public List<AsistenciaPorMateriaDTO> getAsistenciasPorMateria() { return asistenciasPorMateria; }
    public void setAsistenciasPorMateria(List<AsistenciaPorMateriaDTO> asistenciasPorMateria) { 
        this.asistenciasPorMateria = asistenciasPorMateria; 
    }
    
    public String getEstadoAcademico() { return estadoAcademico; }
    public void setEstadoAcademico(String estadoAcademico) { this.estadoAcademico = estadoAcademico; }
    
    public Boolean getRequiereAtencion() { return requiereAtencion; }
    public void setRequiereAtencion(Boolean requiereAtencion) { this.requiereAtencion = requiereAtencion; }
    
    public String getObservaciones() { return observaciones; }
    public void setObservaciones(String observaciones) { this.observaciones = observaciones; }
}

/**
 * DTO auxiliar para calificaciones por materia
 */
class CalificacionPorMateriaDTO {
    private Long materiaId;
    private String materiaNombre;
    private String materiaCodigo;
    private BigDecimal promedio;
    private String estado; // "APROBADO", "DESAPROBADO", "PENDIENTE"
    
    // Constructors y getters/setters básicos
    public CalificacionPorMateriaDTO() {}
    
    public CalificacionPorMateriaDTO(Long materiaId, String materiaNombre, String materiaCodigo, BigDecimal promedio) {
        this.materiaId = materiaId;
        this.materiaNombre = materiaNombre;
        this.materiaCodigo = materiaCodigo;
        this.promedio = promedio;
    }
    
    public Long getMateriaId() { return materiaId; }
    public void setMateriaId(Long materiaId) { this.materiaId = materiaId; }
    
    public String getMateriaNombre() { return materiaNombre; }
    public void setMateriaNombre(String materiaNombre) { this.materiaNombre = materiaNombre; }
    
    public String getMateriaCodigo() { return materiaCodigo; }
    public void setMateriaCodigo(String materiaCodigo) { this.materiaCodigo = materiaCodigo; }
    
    public BigDecimal getPromedio() { return promedio; }
    public void setPromedio(BigDecimal promedio) { this.promedio = promedio; }
    
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
}

/**
 * DTO auxiliar para asistencias por materia
 */
class AsistenciaPorMateriaDTO {
    private Long materiaId;
    private String materiaNombre;
    private String materiaCodigo;
    private Integer totalClases;
    private Integer clasesAsistidas;
    private Double porcentajeAsistencia;
    
    // Constructors y getters/setters básicos
    public AsistenciaPorMateriaDTO() {}
    
    public AsistenciaPorMateriaDTO(Long materiaId, String materiaNombre, String materiaCodigo, 
                                  Integer totalClases, Integer clasesAsistidas) {
        this.materiaId = materiaId;
        this.materiaNombre = materiaNombre;
        this.materiaCodigo = materiaCodigo;
        this.totalClases = totalClases;
        this.clasesAsistidas = clasesAsistidas;
        this.porcentajeAsistencia = totalClases > 0 ? (clasesAsistidas * 100.0 / totalClases) : 0.0;
    }
    
    public Long getMateriaId() { return materiaId; }
    public void setMateriaId(Long materiaId) { this.materiaId = materiaId; }
    
    public String getMateriaNombre() { return materiaNombre; }
    public void setMateriaNombre(String materiaNombre) { this.materiaNombre = materiaNombre; }
    
    public String getMateriaCodigo() { return materiaCodigo; }
    public void setMateriaCodigo(String materiaCodigo) { this.materiaCodigo = materiaCodigo; }
    
    public Integer getTotalClases() { return totalClases; }
    public void setTotalClases(Integer totalClases) { this.totalClases = totalClases; }
    
    public Integer getClasesAsistidas() { return clasesAsistidas; }
    public void setClasesAsistidas(Integer clasesAsistidas) { this.clasesAsistidas = clasesAsistidas; }
    
    public Double getPorcentajeAsistencia() { return porcentajeAsistencia; }
    public void setPorcentajeAsistencia(Double porcentajeAsistencia) { this.porcentajeAsistencia = porcentajeAsistencia; }
}
