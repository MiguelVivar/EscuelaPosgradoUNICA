package com.escuelaposgrado.Matricula.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

/**
 * DTO para requests de PeriodoAcademico
 */
public class PeriodoAcademicoRequest {

    @NotBlank(message = "El nombre del período es obligatorio")
    @Size(max = 50, message = "El nombre no puede exceder 50 caracteres")
    private String nombre;

    @Size(max = 20, message = "El código no puede exceder 20 caracteres")
    private String codigo; // Opcional, se auto-genera si no se proporciona

    @NotBlank(message = "El año es obligatorio")
    private String anio;

    @NotBlank(message = "El semestre es obligatorio")
    private String semestre;

    @NotNull(message = "La fecha de inicio es obligatoria")
    private LocalDateTime fechaInicio;

    @NotNull(message = "La fecha de fin es obligatoria")
    private LocalDateTime fechaFin;

    @NotNull(message = "La fecha de inicio de matrícula es obligatoria")
    private LocalDateTime fechaInicioMatricula;

    @NotNull(message = "La fecha de fin de matrícula es obligatoria")
    private LocalDateTime fechaFinMatricula;

    private Boolean habilitado = false;

    @Size(max = 500, message = "La descripción no puede exceder 500 caracteres")
    private String descripcion;

    // Constructores
    public PeriodoAcademicoRequest() {}

    // Getters y Setters
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

    public Boolean getHabilitado() { return habilitado; }
    public void setHabilitado(Boolean habilitado) { this.habilitado = habilitado; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
}
