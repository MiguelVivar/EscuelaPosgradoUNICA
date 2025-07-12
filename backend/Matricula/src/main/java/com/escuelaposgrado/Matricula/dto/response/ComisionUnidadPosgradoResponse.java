package com.escuelaposgrado.Matricula.dto.response;

import java.time.LocalDateTime;

import com.escuelaposgrado.Matricula.dto.response.nested.FacultadBasicResponse;

/**
 * DTO de respuesta para ComisionUnidadPosgrado
 */
public class ComisionUnidadPosgradoResponse {

    private Long id;
    private String nombre;
    private String codigo;
    private String tipo;
    private String presidente;
    private String secretario;
    private String miembros;
    private Boolean activo;
    private String descripcion;
    private String funciones;
    private LocalDateTime fechaInicioGestion;
    private LocalDateTime fechaFinGestion;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaActualizacion;
    private FacultadBasicResponse facultad;

    // Constructors
    public ComisionUnidadPosgradoResponse() {}

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

    public Boolean getActivo() {
        return activo;
    }

    public void setActivo(Boolean activo) {
        this.activo = activo;
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

    public FacultadBasicResponse getFacultad() {
        return facultad;
    }

    public void setFacultad(FacultadBasicResponse facultad) {
        this.facultad = facultad;
    }
}
