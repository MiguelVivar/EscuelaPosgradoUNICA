package com.escuelaposgrado.Matricula.model.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Entidad que representa un período académico
 * para habilitar los procesos de matrícula
 */
@Entity
@Table(name = "periodos_academicos")
public class PeriodoAcademico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    @NotBlank(message = "El nombre del período es obligatorio")
    @Size(max = 50, message = "El nombre no puede exceder 50 caracteres")
    private String nombre;

    @Column(nullable = false, length = 10)
    @NotBlank(message = "El año es obligatorio")
    private String anio;

    @Column(nullable = false, length = 20)
    @NotBlank(message = "El semestre es obligatorio")
    private String semestre; // "I", "II", "VERANO"

    @Column(name = "fecha_inicio", nullable = false)
    private LocalDateTime fechaInicio;

    @Column(name = "fecha_fin", nullable = false)
    private LocalDateTime fechaFin;

    @Column(name = "fecha_inicio_matricula", nullable = false)
    private LocalDateTime fechaInicioMatricula;

    @Column(name = "fecha_fin_matricula", nullable = false)
    private LocalDateTime fechaFinMatricula;

    @Column(nullable = false)
    private Boolean activo = true;

    @Column(nullable = false)
    private Boolean habilitado = false; // Si está habilitado para matrícula

    @Column(length = 500)
    private String descripcion;

    @Column(name = "fecha_creacion", nullable = false, updatable = false)
    private LocalDateTime fechaCreacion;

    @Column(name = "fecha_actualizacion")
    private LocalDateTime fechaActualizacion;

    // Relación con turnos de matrícula
    @OneToMany(mappedBy = "periodoAcademico", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<TurnoMatricula> turnosMatricula;

    @PrePersist
    protected void onCreate() {
        fechaCreacion = LocalDateTime.now();
        fechaActualizacion = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        fechaActualizacion = LocalDateTime.now();
    }

    // Constructores
    public PeriodoAcademico() {}

    public PeriodoAcademico(String nombre, String anio, String semestre, 
                           LocalDateTime fechaInicio, LocalDateTime fechaFin,
                           LocalDateTime fechaInicioMatricula, LocalDateTime fechaFinMatricula) {
        this.nombre = nombre;
        this.anio = anio;
        this.semestre = semestre;
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
        this.fechaInicioMatricula = fechaInicioMatricula;
        this.fechaFinMatricula = fechaFinMatricula;
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getAnio() { return anio; }
    public void setAnio(String anio) { this.anio = anio; }

    public String getSemestre() { return semestre; }
    public void setSemestre(String semestre) { this.semestre = semestre; }

    public LocalDateTime getFechaInicio() { return fechaInicio; }
    public void setFechaInicio(LocalDateTime fechaInicio) { this.fechaInicio = fechaInicio; }

    public LocalDateTime getFechaFin() { return fechaFin; }
    public void setFechaFin(LocalDateTime fechaFin) { this.fechaFin = fechaFin; }

    public LocalDateTime getFechaInicioMatricula() { return fechaInicioMatricula; }
    public void setFechaInicioMatricula(LocalDateTime fechaInicioMatricula) { this.fechaInicioMatricula = fechaInicioMatricula; }

    public LocalDateTime getFechaFinMatricula() { return fechaFinMatricula; }
    public void setFechaFinMatricula(LocalDateTime fechaFinMatricula) { this.fechaFinMatricula = fechaFinMatricula; }

    public Boolean getActivo() { return activo; }
    public void setActivo(Boolean activo) { this.activo = activo; }

    public Boolean getHabilitado() { return habilitado; }
    public void setHabilitado(Boolean habilitado) { this.habilitado = habilitado; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }

    public LocalDateTime getFechaActualizacion() { return fechaActualizacion; }
    public void setFechaActualizacion(LocalDateTime fechaActualizacion) { this.fechaActualizacion = fechaActualizacion; }

    public List<TurnoMatricula> getTurnosMatricula() { return turnosMatricula; }
    public void setTurnosMatricula(List<TurnoMatricula> turnosMatricula) { this.turnosMatricula = turnosMatricula; }
}
