package com.escuelaposgrado.Matricula.dto.request;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * DTO para solicitudes de operaciones de ComisionUnidadPosgrado
 */
public class ComisionUnidadPosgradoRequest {

    @NotBlank(message = "El nombre de la comisión es obligatorio")
    @Size(max = 200, message = "El nombre no puede exceder 200 caracteres")
    private String nombre;

    @NotBlank(message = "El código es obligatorio")
    @Size(max = 20, message = "El código no puede exceder 20 caracteres")
    private String codigo;

    @Size(max = 50, message = "El tipo no puede exceder 50 caracteres")
    private String tipo;

    @Size(max = 100, message = "El presidente no puede exceder 100 caracteres")
    private String presidente;

    @Size(max = 100, message = "El secretario no puede exceder 100 caracteres")
    private String secretario;

    @Size(max = 500, message = "Los miembros no pueden exceder 500 caracteres")
    private String miembros;

    @Size(max = 1000, message = "La descripción no puede exceder 1000 caracteres")
    private String descripcion;

    @Size(max = 500, message = "Las funciones no pueden exceder 500 caracteres")
    private String funciones;

    private LocalDateTime fechaInicioGestion;

    private LocalDateTime fechaFinGestion;

    @NotNull(message = "La facultad es obligatoria")
    private Long facultadId;

    // Constructors
    public ComisionUnidadPosgradoRequest() {}

    public ComisionUnidadPosgradoRequest(String nombre, String codigo, String tipo, Long facultadId) {
        this.nombre = nombre;
        this.codigo = codigo;
        this.tipo = tipo;
        this.facultadId = facultadId;
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

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public String getPresidente() {
        return presidente;
    }

    public void setPresidente(String presidente) {
        this.presidente = presidente;
    }

    public String getSecretario() {
        return secretario;
    }

    public void setSecretario(String secretario) {
        this.secretario = secretario;
    }

    public String getMiembros() {
        return miembros;
    }

    public void setMiembros(String miembros) {
        this.miembros = miembros;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getFunciones() {
        return funciones;
    }

    public void setFunciones(String funciones) {
        this.funciones = funciones;
    }

    public LocalDateTime getFechaInicioGestion() {
        return fechaInicioGestion;
    }

    public void setFechaInicioGestion(LocalDateTime fechaInicioGestion) {
        this.fechaInicioGestion = fechaInicioGestion;
    }

    public LocalDateTime getFechaFinGestion() {
        return fechaFinGestion;
    }

    public void setFechaFinGestion(LocalDateTime fechaFinGestion) {
        this.fechaFinGestion = fechaFinGestion;
    }

    public Long getFacultadId() {
        return facultadId;
    }

    public void setFacultadId(Long facultadId) {
        this.facultadId = facultadId;
    }
}
