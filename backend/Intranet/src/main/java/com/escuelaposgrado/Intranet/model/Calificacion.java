package com.escuelaposgrado.Intranet.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.math.RoundingMode;

/**
 * Entidad para registrar las calificaciones de estudiantes
 */
@Entity
@Table(name = "calificaciones")
public class Calificacion {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull(message = "El tipo de evaluación es obligatorio")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoEvaluacion tipoEvaluacion;
    
    @NotBlank(message = "La descripción es obligatoria")
    @Size(max = 200, message = "La descripción no puede exceder 200 caracteres")
    @Column(nullable = false)
    private String descripcion;
    
    @NotNull(message = "La nota es obligatoria")
    @DecimalMin(value = "0.0", message = "La nota mínima es 0.0")
    @DecimalMax(value = "20.0", message = "La nota máxima es 20.0")
    @Column(precision = 4, scale = 2, nullable = false)
    private BigDecimal nota;
    
    @NotNull(message = "El peso es obligatorio")
    @DecimalMin(value = "0.0", message = "El peso mínimo es 0.0")
    @DecimalMax(value = "100.0", message = "El peso máximo es 100.0")
    @Column(precision = 5, scale = 2, nullable = false)
    private BigDecimal peso; // Peso en porcentaje para el promedio final
    
    @NotNull(message = "La fecha de evaluación es obligatoria")
    @Column(name = "fecha_evaluacion", nullable = false)
    private LocalDate fechaEvaluacion;
    
    @Size(max = 500, message = "Las observaciones no pueden exceder 500 caracteres")
    private String observaciones;
    
    @Column(nullable = false)
    private Boolean publicada = false; // Si la nota está publicada para el estudiante
    
    @Column(nullable = false)
    private Boolean recuperable = false; // Si la evaluación es recuperable
    
    @Column(name = "nota_anterior", precision = 4, scale = 2)
    private BigDecimal notaAnterior; // Para registrar correcciones
    
    @Column(name = "fecha_correcion")
    private LocalDateTime fechaCorreccion;
    
    @Column(name = "motivo_correcion")
    private String motivoCorreccion;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Ciclo ciclo;
    
    @Column(nullable = false)
    private Integer anio;
    
    // Relaciones
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "estudiante_id", nullable = false)
    @NotNull(message = "El estudiante es obligatorio")
    private Usuario estudiante;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "materia_id", nullable = false)
    @NotNull(message = "La materia es obligatoria")
    private Materia materia;
    
    @Column(name = "fecha_registro", nullable = false, updatable = false)
    private LocalDateTime fechaRegistro;
    
    @Column(name = "fecha_actualizacion")
    private LocalDateTime fechaActualizacion;
    
    @Column(name = "registrado_por")
    private String registradoPor; // Username del docente que registró la nota
    
    @Column(name = "corregido_por")
    private String corregidoPor; // Username del usuario que hizo la corrección
    
    // Constructors
    public Calificacion() {}
    
    public Calificacion(TipoEvaluacion tipoEvaluacion, String descripcion, BigDecimal nota, 
                       BigDecimal peso, LocalDate fechaEvaluacion, Usuario estudiante, Materia materia) {
        this.tipoEvaluacion = tipoEvaluacion;
        this.descripcion = descripcion;
        this.nota = nota;
        this.peso = peso;
        this.fechaEvaluacion = fechaEvaluacion;
        this.estudiante = estudiante;
        this.materia = materia;
    }
    
    // Métodos del ciclo de vida de JPA
    @PrePersist
    protected void onCreate() {
        fechaRegistro = LocalDateTime.now();
        fechaActualizacion = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        fechaActualizacion = LocalDateTime.now();
    }
    
    // Métodos utilitarios
    public boolean esAprobatoria() {
        return nota.compareTo(new BigDecimal("11.0")) >= 0;
    }
    
    public boolean esDesaprobatoria() {
        return nota.compareTo(new BigDecimal("11.0")) < 0;
    }
    
    public boolean fueCorregida() {
        return notaAnterior != null;
    }
    
    public String getEstadoTexto() {
        if (esAprobatoria()) {
            return "Aprobado";
        } else {
            return "Desaprobado";
        }
    }
    
    public BigDecimal getNotaContribucion() {
        return nota.multiply(peso).divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP);
    }
    
    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public TipoEvaluacion getTipoEvaluacion() { return tipoEvaluacion; }
    public void setTipoEvaluacion(TipoEvaluacion tipoEvaluacion) { this.tipoEvaluacion = tipoEvaluacion; }
    
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
    
    public LocalDateTime getFechaCorreccion() { return fechaCorreccion; }
    public void setFechaCorreccion(LocalDateTime fechaCorreccion) { this.fechaCorreccion = fechaCorreccion; }
    
    public String getMotivoCorreccion() { return motivoCorreccion; }
    public void setMotivoCorreccion(String motivoCorreccion) { this.motivoCorreccion = motivoCorreccion; }
    
    public Usuario getEstudiante() { return estudiante; }
    public void setEstudiante(Usuario estudiante) { this.estudiante = estudiante; }
    
    public Materia getMateria() { return materia; }
    public void setMateria(Materia materia) { this.materia = materia; }
    
    public LocalDateTime getFechaRegistro() { return fechaRegistro; }
    public void setFechaRegistro(LocalDateTime fechaRegistro) { this.fechaRegistro = fechaRegistro; }
    
    public LocalDateTime getFechaActualizacion() { return fechaActualizacion; }
    public void setFechaActualizacion(LocalDateTime fechaActualizacion) { this.fechaActualizacion = fechaActualizacion; }
    
    public String getRegistradoPor() { return registradoPor; }
    public void setRegistradoPor(String registradoPor) { this.registradoPor = registradoPor; }
    
    public String getCorregidoPor() { return corregidoPor; }
    public void setCorregidoPor(String corregidoPor) { this.corregidoPor = corregidoPor; }
    
    public Ciclo getCiclo() { return ciclo; }
    public void setCiclo(Ciclo ciclo) { this.ciclo = ciclo; }
    
    public Integer getAnio() { return anio; }
    public void setAnio(Integer anio) { this.anio = anio; }
}
