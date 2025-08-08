package com.escuelaposgrado.Intranet.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * DTO para el registro de calificaciones
 */
public class CalificacionDTO {
    
    private Long id;
    
    @NotNull(message = "El ID del estudiante es obligatorio")
    private Long estudianteId;
    
    @NotNull(message = "El ID de la materia es obligatorio")
    private Long materiaId;
    
    @NotBlank(message = "El tipo de evaluación es obligatorio")
    private String tipoEvaluacion;
    
    @NotBlank(message = "La descripción es obligatoria")
    @Size(max = 200, message = "La descripción no puede exceder 200 caracteres")
    private String descripcion;
    
    @NotNull(message = "La nota es obligatoria")
    @DecimalMin(value = "0.0", message = "La nota mínima es 0.0")
    @DecimalMax(value = "20.0", message = "La nota máxima es 20.0")
    private BigDecimal nota;
    
    @NotNull(message = "El peso es obligatorio")
    @DecimalMin(value = "0.0", message = "El peso mínimo es 0.0")
    @DecimalMax(value = "100.0", message = "El peso máximo es 100.0")
    private BigDecimal peso;
    
    @NotNull(message = "La fecha de evaluación es obligatoria")
    private LocalDate fechaEvaluacion;
    
    @Size(max = 500, message = "Las observaciones no pueden exceder 500 caracteres")
    private String observaciones;
    
    private Boolean publicada = false;
    private Boolean recuperable = false;
    
    // Campos para corrección de notas
    private BigDecimal notaAnterior;
    private String motivoCorreccion;
    
    // Campos de solo lectura
    private String estudianteNombre;
    private String estudianteCodigo;
    private String materiaNombre;
    private String materiaCodigo;
    private String registradoPor;
    private String corregidoPor;
    private String estadoTexto; // "Aprobado" o "Desaprobado"
    private String ciclo;
    private Integer anio;
    
    // Constructors
    public CalificacionDTO() {}
    
    public CalificacionDTO(Long estudianteId, Long materiaId, String tipoEvaluacion, 
                          String descripcion, BigDecimal nota, BigDecimal peso, LocalDate fechaEvaluacion) {
        this.estudianteId = estudianteId;
        this.materiaId = materiaId;
        this.tipoEvaluacion = tipoEvaluacion;
        this.descripcion = descripcion;
        this.nota = nota;
        this.peso = peso;
        this.fechaEvaluacion = fechaEvaluacion;
    }
    
    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getEstudianteId() { return estudianteId; }
    public void setEstudianteId(Long estudianteId) { this.estudianteId = estudianteId; }
    
    public Long getMateriaId() { return materiaId; }
    public void setMateriaId(Long materiaId) { this.materiaId = materiaId; }
    
    public String getTipoEvaluacion() { return tipoEvaluacion; }
    public void setTipoEvaluacion(String tipoEvaluacion) { this.tipoEvaluacion = tipoEvaluacion; }
    
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    
    public BigDecimal getNota() { return nota; }
    public void setNota(BigDecimal nota) { this.nota = nota; }
    
    public BigDecimal getPeso() { return peso; }
    public void setPeso(BigDecimal peso) { this.peso = peso; }
    
    public LocalDate getFechaEvaluacion() { return fechaEvaluacion; }
    public void setFechaEvaluacion(LocalDate fechaEvaluacion) { this.fechaEvaluacion = fechaEvaluacion; }
    
    public String getObservaciones() { return observaciones; }
    public void setObservaciones(String observaciones) { this.observaciones = observaciones; }
    
    public Boolean getPublicada() { return publicada; }
    public void setPublicada(Boolean publicada) { this.publicada = publicada; }
    
    public Boolean getRecuperable() { return recuperable; }
    public void setRecuperable(Boolean recuperable) { this.recuperable = recuperable; }
    
    public BigDecimal getNotaAnterior() { return notaAnterior; }
    public void setNotaAnterior(BigDecimal notaAnterior) { this.notaAnterior = notaAnterior; }
    
    public String getMotivoCorreccion() { return motivoCorreccion; }
    public void setMotivoCorreccion(String motivoCorreccion) { this.motivoCorreccion = motivoCorreccion; }
    
    public String getEstudianteNombre() { return estudianteNombre; }
    public void setEstudianteNombre(String estudianteNombre) { this.estudianteNombre = estudianteNombre; }
    
    public String getEstudianteCodigo() { return estudianteCodigo; }
    public void setEstudianteCodigo(String estudianteCodigo) { this.estudianteCodigo = estudianteCodigo; }
    
    public String getMateriaNombre() { return materiaNombre; }
    public void setMateriaNombre(String materiaNombre) { this.materiaNombre = materiaNombre; }
    
    public String getMateriaCodigo() { return materiaCodigo; }
    public void setMateriaCodigo(String materiaCodigo) { this.materiaCodigo = materiaCodigo; }
    
    public String getRegistradoPor() { return registradoPor; }
    public void setRegistradoPor(String registradoPor) { this.registradoPor = registradoPor; }
    
    public String getCorregidoPor() { return corregidoPor; }
    public void setCorregidoPor(String corregidoPor) { this.corregidoPor = corregidoPor; }
    
    public String getEstadoTexto() { return estadoTexto; }
    public void setEstadoTexto(String estadoTexto) { this.estadoTexto = estadoTexto; }
    
    public String getCiclo() { return ciclo; }
    public void setCiclo(String ciclo) { this.ciclo = ciclo; }
    
    public Integer getAnio() { return anio; }
    public void setAnio(Integer anio) { this.anio = anio; }
}
