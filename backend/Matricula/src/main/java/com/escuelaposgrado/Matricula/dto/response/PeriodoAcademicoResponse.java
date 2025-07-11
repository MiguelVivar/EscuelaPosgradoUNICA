package com.escuelaposgrado.Matricula.dto.response;

import java.time.LocalDateTime;

/**
 * DTO para responses de PeriodoAcademico
 */
public class PeriodoAcademicoResponse {

    private Long id;
    private String codigo;
    private String nombre;
    private String anio;
    private String semestre;
    private LocalDateTime fechaInicio;
    private LocalDateTime fechaFin;
    private LocalDateTime fechaInicioMatricula;
    private LocalDateTime fechaFinMatricula;
    private Boolean activo;
    private Boolean habilitado;
    private String descripcion;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaActualizacion;

    // Constructores
    public PeriodoAcademicoResponse() {}

    public PeriodoAcademicoResponse(Long id, String codigo, String nombre, String anio, String semestre,
                                   LocalDateTime fechaInicio, LocalDateTime fechaFin,
                                   LocalDateTime fechaInicioMatricula, LocalDateTime fechaFinMatricula,
                                   Boolean activo, Boolean habilitado, String descripcion,
                                   LocalDateTime fechaCreacion, LocalDateTime fechaActualizacion) {
        this.id = id;
        this.codigo = codigo;
        this.nombre = nombre;
        this.anio = anio;
        this.semestre = semestre;
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
        this.fechaInicioMatricula = fechaInicioMatricula;
        this.fechaFinMatricula = fechaFinMatricula;
        this.activo = activo;
        this.habilitado = habilitado;
        this.descripcion = descripcion;
        this.fechaCreacion = fechaCreacion;
        this.fechaActualizacion = fechaActualizacion;
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getCodigo() { return codigo; }
    public void setCodigo(String codigo) { this.codigo = codigo; }

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
}
