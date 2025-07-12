package com.escuelaposgrado.Matricula.dto.response;

import java.time.LocalDateTime;

import com.escuelaposgrado.Matricula.dto.response.nested.PeriodoAcademicoBasicResponse;
import com.escuelaposgrado.Matricula.dto.response.nested.ProgramaEstudioBasicResponse;

/**
 * DTO para respuestas de operaciones de TurnoMatricula
 */
public class TurnoMatriculaResponse {

    private Long id;
    private String nombre;
    private String codigo;
    private LocalDateTime fechaInicio;
    private LocalDateTime fechaFin;
    private Integer ordenTurno;
    private Boolean activo;
    private Boolean habilitado;
    private String descripcion;
    private String requisitos;
    private PeriodoAcademicoBasicResponse periodoAcademico;
    private ProgramaEstudioBasicResponse programaEstudio;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaActualizacion;

    // Constructors
    public TurnoMatriculaResponse() {}

    public TurnoMatriculaResponse(Long id, String nombre, String codigo, LocalDateTime fechaInicio, 
                                 LocalDateTime fechaFin, Integer ordenTurno, Boolean activo, 
                                 Boolean habilitado, String descripcion, String requisitos) {
        this.id = id;
        this.nombre = nombre;
        this.codigo = codigo;
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
        this.ordenTurno = ordenTurno;
        this.activo = activo;
        this.habilitado = habilitado;
        this.descripcion = descripcion;
        this.requisitos = requisitos;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public Boolean getActivo() {
        return activo;
    }

    public void setActivo(Boolean activo) {
        this.activo = activo;
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

    public PeriodoAcademicoBasicResponse getPeriodoAcademico() {
        return periodoAcademico;
    }

    public void setPeriodoAcademico(PeriodoAcademicoBasicResponse periodoAcademico) {
        this.periodoAcademico = periodoAcademico;
    }

    public ProgramaEstudioBasicResponse getProgramaEstudio() {
        return programaEstudio;
    }

    public void setProgramaEstudio(ProgramaEstudioBasicResponse programaEstudio) {
        this.programaEstudio = programaEstudio;
    }

    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

    public LocalDateTime getFechaActualizacion() {
        return fechaActualizacion;
    }

    public void setFechaActualizacion(LocalDateTime fechaActualizacion) {
        this.fechaActualizacion = fechaActualizacion;
    }
}
