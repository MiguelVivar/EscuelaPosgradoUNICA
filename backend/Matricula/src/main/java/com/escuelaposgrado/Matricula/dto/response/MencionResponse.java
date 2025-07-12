package com.escuelaposgrado.Matricula.dto.response;

import java.time.LocalDateTime;

import com.escuelaposgrado.Matricula.dto.response.nested.ProgramaEstudioBasicResponse;

/**
 * DTO para las respuestas de menciones
 */
public class MencionResponse {
    
    private Long id;
    private String nombre;
    private String codigo;
    private Boolean activo;
    private Boolean disponible;
    private String descripcion;
    private String requisitos;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaActualizacion;
    private ProgramaEstudioBasicResponse programaEstudio;

    // Constructores
    public MencionResponse() {}

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getCodigo() { return codigo; }
    public void setCodigo(String codigo) { this.codigo = codigo; }

    public Boolean getActivo() { return activo; }
    public void setActivo(Boolean activo) { this.activo = activo; }

    public Boolean getDisponible() { return disponible; }
    public void setDisponible(Boolean disponible) { this.disponible = disponible; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public String getRequisitos() { return requisitos; }
    public void setRequisitos(String requisitos) { this.requisitos = requisitos; }

    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }

    public LocalDateTime getFechaActualizacion() { return fechaActualizacion; }
    public void setFechaActualizacion(LocalDateTime fechaActualizacion) { this.fechaActualizacion = fechaActualizacion; }

    public ProgramaEstudioBasicResponse getProgramaEstudio() { return programaEstudio; }
    public void setProgramaEstudio(ProgramaEstudioBasicResponse programaEstudio) { this.programaEstudio = programaEstudio; }
}
