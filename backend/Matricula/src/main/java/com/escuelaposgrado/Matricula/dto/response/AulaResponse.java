package com.escuelaposgrado.Matricula.dto.response;

import com.escuelaposgrado.Matricula.dto.response.nested.SedeBasicResponse;
import java.time.LocalDateTime;

/**
 * DTO para respuestas de operaciones de Aula
 */
public class AulaResponse {

    private Long id;
    private String nombre;
    private String codigo;
    private Integer capacidad;
    private String tipo;
    private String equipamiento;
    private String descripcion;
    private Boolean activo;
    private SedeBasicResponse sede;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaActualizacion;

    // Constructors
    public AulaResponse() {}

    public AulaResponse(Long id, String nombre, String codigo, Integer capacidad, String tipo, String equipamiento, String descripcion, Boolean activo) {
        this.id = id;
        this.nombre = nombre;
        this.codigo = codigo;
        this.capacidad = capacidad;
        this.tipo = tipo;
        this.equipamiento = equipamiento;
        this.descripcion = descripcion;
        this.activo = activo;
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

    public Integer getCapacidad() {
        return capacidad;
    }

    public void setCapacidad(Integer capacidad) {
        this.capacidad = capacidad;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public String getEquipamiento() {
        return equipamiento;
    }

    public void setEquipamiento(String equipamiento) {
        this.equipamiento = equipamiento;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public Boolean getActivo() {
        return activo;
    }

    public void setActivo(Boolean activo) {
        this.activo = activo;
    }

    public SedeBasicResponse getSede() {
        return sede;
    }

    public void setSede(SedeBasicResponse sede) {
        this.sede = sede;
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
