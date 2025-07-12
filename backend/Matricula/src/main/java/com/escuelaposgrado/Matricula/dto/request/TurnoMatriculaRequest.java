package com.escuelaposgrado.Matricula.dto.request;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

/**
 * DTO para solicitudes de operaciones de TurnoMatricula
 */
public class TurnoMatriculaRequest {

    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 100, message = "El nombre no puede superar los 100 caracteres")
    private String nombre;

    @NotBlank(message = "El código es obligatorio")
    @Size(max = 20, message = "El código no puede superar los 20 caracteres")
    private String codigo;

    @NotNull(message = "La fecha de inicio es obligatoria")
    private LocalDateTime fechaInicio;

    @NotNull(message = "La fecha de fin es obligatoria")
    private LocalDateTime fechaFin;

    @NotNull(message = "El orden del turno es obligatorio")
    @Positive(message = "El orden del turno debe ser un número positivo")
    private Integer ordenTurno;

    private Boolean habilitado = false;

    @Size(max = 500, message = "La descripción no puede superar los 500 caracteres")
    private String descripcion;

    @Size(max = 500, message = "Los requisitos no pueden superar los 500 caracteres")
    private String requisitos;

    @NotNull(message = "El período académico es obligatorio")
    private Long periodoAcademicoId;

    @NotNull(message = "El programa de estudio es obligatorio")
    private Long programaEstudioId;

    // Constructors
    public TurnoMatriculaRequest() {}

    public TurnoMatriculaRequest(String nombre, String codigo, LocalDateTime fechaInicio, 
                                LocalDateTime fechaFin, Integer ordenTurno, Boolean habilitado,
                                String descripcion, String requisitos, Long periodoAcademicoId, 
                                Long programaEstudioId) {
        this.nombre = nombre;
        this.codigo = codigo;
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
        this.ordenTurno = ordenTurno;
        this.habilitado = habilitado;
        this.descripcion = descripcion;
        this.requisitos = requisitos;
        this.periodoAcademicoId = periodoAcademicoId;
        this.programaEstudioId = programaEstudioId;
    }

    // Getters and Setters
    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public LocalDateTime getFechaInicio() {
        return fechaInicio;
    }

    public void setFechaInicio(LocalDateTime fechaInicio) {
        this.fechaInicio = fechaInicio;
    }

    public LocalDateTime getFechaFin() {
        return fechaFin;
    }

    public void setFechaFin(LocalDateTime fechaFin) {
        this.fechaFin = fechaFin;
    }

    public Integer getOrdenTurno() {
        return ordenTurno;
    }

    public void setOrdenTurno(Integer ordenTurno) {
        this.ordenTurno = ordenTurno;
    }

    public Boolean getHabilitado() {
        return habilitado;
    }

    public void setHabilitado(Boolean habilitado) {
        this.habilitado = habilitado;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getRequisitos() {
        return requisitos;
    }

    public void setRequisitos(String requisitos) {
        this.requisitos = requisitos;
    }

    public Long getPeriodoAcademicoId() {
        return periodoAcademicoId;
    }

    public void setPeriodoAcademicoId(Long periodoAcademicoId) {
        this.periodoAcademicoId = periodoAcademicoId;
    }

    public Long getProgramaEstudioId() {
        return programaEstudioId;
    }

    public void setProgramaEstudioId(Long programaEstudioId) {
        this.programaEstudioId = programaEstudioId;
    }
}
