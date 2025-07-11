package com.escuelaposgrado.Matricula.model.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

/**
 * Entidad que representa los turnos de matrícula para definir
 * el calendario de matrículas de cada programa
 */
@Entity
@Table(name = "turnos_matricula")
public class TurnoMatricula {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    @NotBlank(message = "El nombre del turno es obligatorio")
    @Size(max = 100, message = "El nombre no puede exceder 100 caracteres")
    private String nombre;

    @Column(nullable = false, length = 20)
    @NotBlank(message = "El código es obligatorio")
    @Size(max = 20, message = "El código no puede exceder 20 caracteres")
    private String codigo;

    @Column(name = "fecha_inicio", nullable = false)
    @NotNull(message = "La fecha de inicio es obligatoria")
    private LocalDateTime fechaInicio;

    @Column(name = "fecha_fin", nullable = false)
    @NotNull(message = "La fecha de fin es obligatoria")
    private LocalDateTime fechaFin;

    @Column(name = "orden_turno", nullable = false)
    @NotNull(message = "El orden del turno es obligatorio")
    private Integer ordenTurno; // 1, 2, 3... para determinar prioridad

    @Column(nullable = false)
    private Boolean activo = true;

    @Column(nullable = false)
    private Boolean habilitado = false; // Si está habilitado para matrícula

    @Column(length = 500)
    private String descripcion;

    @Column(length = 500)
    private String requisitos;

    @Column(name = "fecha_creacion", nullable = false, updatable = false)
    private LocalDateTime fechaCreacion;

    @Column(name = "fecha_actualizacion")
    private LocalDateTime fechaActualizacion;

    // Relación con período académico
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "periodo_academico_id", nullable = false)
    @NotNull(message = "El período académico es obligatorio")
    private PeriodoAcademico periodoAcademico;

    // Relación con programa de estudio
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "programa_estudio_id", nullable = false)
    @NotNull(message = "El programa de estudio es obligatorio")
    private ProgramaEstudio programaEstudio;

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
    public TurnoMatricula() {}

    public TurnoMatricula(String nombre, String codigo, LocalDateTime fechaInicio, 
                         LocalDateTime fechaFin, Integer ordenTurno,
                         PeriodoAcademico periodoAcademico, ProgramaEstudio programaEstudio) {
        this.nombre = nombre;
        this.codigo = codigo;
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
        this.ordenTurno = ordenTurno;
        this.periodoAcademico = periodoAcademico;
        this.programaEstudio = programaEstudio;
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getCodigo() { return codigo; }
    public void setCodigo(String codigo) { this.codigo = codigo; }

    public LocalDateTime getFechaInicio() { return fechaInicio; }
    public void setFechaInicio(LocalDateTime fechaInicio) { this.fechaInicio = fechaInicio; }

    public LocalDateTime getFechaFin() { return fechaFin; }
    public void setFechaFin(LocalDateTime fechaFin) { this.fechaFin = fechaFin; }

    public Integer getOrdenTurno() { return ordenTurno; }
    public void setOrdenTurno(Integer ordenTurno) { this.ordenTurno = ordenTurno; }

    public Boolean getActivo() { return activo; }
    public void setActivo(Boolean activo) { this.activo = activo; }

    public Boolean getHabilitado() { return habilitado; }
    public void setHabilitado(Boolean habilitado) { this.habilitado = habilitado; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public String getRequisitos() { return requisitos; }
    public void setRequisitos(String requisitos) { this.requisitos = requisitos; }

    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }

    public LocalDateTime getFechaActualizacion() { return fechaActualizacion; }
    public void setFechaActualizacion(LocalDateTime fechaActualizacion) { this.fechaActualizacion = fechaActualizacion; }

    public PeriodoAcademico getPeriodoAcademico() { return periodoAcademico; }
    public void setPeriodoAcademico(PeriodoAcademico periodoAcademico) { this.periodoAcademico = periodoAcademico; }

    public ProgramaEstudio getProgramaEstudio() { return programaEstudio; }
    public void setProgramaEstudio(ProgramaEstudio programaEstudio) { this.programaEstudio = programaEstudio; }
}
