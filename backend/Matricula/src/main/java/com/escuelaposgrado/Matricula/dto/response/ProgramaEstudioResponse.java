package com.escuelaposgrado.Matricula.dto.response;

import java.time.LocalDateTime;

import com.escuelaposgrado.Matricula.dto.response.nested.FacultadBasicResponse;

/**
 * DTO para respuestas de operaciones de Programa de Estudio
 */
public class ProgramaEstudioResponse {

    private Long id;
    private String nombre;
    private String codigo;
    private String nivel;
    private String modalidad;
    private Integer duracionSemestres;
    private Integer creditosTotales;
    private Boolean activo;
    private Boolean disponible;
    private String descripcion;
    private String objetivos;
    private FacultadBasicResponse facultad;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaActualizacion;

    // Constructors
    public ProgramaEstudioResponse() {}

    public ProgramaEstudioResponse(Long id, String nombre, String codigo, String nivel, String modalidad, 
                                   Integer duracionSemestres, Integer creditosTotales, Boolean activo, 
                                   Boolean disponible, String descripcion, String objetivos) {
        this.id = id;
        this.nombre = nombre;
        this.codigo = codigo;
        this.nivel = nivel;
        this.modalidad = modalidad;
        this.duracionSemestres = duracionSemestres;
        this.creditosTotales = creditosTotales;
        this.activo = activo;
        this.disponible = disponible;
        this.descripcion = descripcion;
        this.objetivos = objetivos;
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

    public String getNivel() {
        return nivel;
    }

    public void setNivel(String nivel) {
        this.nivel = nivel;
    }

    public String getModalidad() {
        return modalidad;
    }

    public void setModalidad(String modalidad) {
        this.modalidad = modalidad;
    }

    public Integer getDuracionSemestres() {
        return duracionSemestres;
    }

    public void setDuracionSemestres(Integer duracionSemestres) {
        this.duracionSemestres = duracionSemestres;
    }

    public Integer getCreditosTotales() {
        return creditosTotales;
    }

    public void setCreditosTotales(Integer creditosTotales) {
        this.creditosTotales = creditosTotales;
    }

    public Boolean getActivo() {
        return activo;
    }

    public void setActivo(Boolean activo) {
        this.activo = activo;
    }

    public Boolean getDisponible() {
        return disponible;
    }

    public void setDisponible(Boolean disponible) {
        this.disponible = disponible;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getObjetivos() {
        return objetivos;
    }

    public void setObjetivos(String objetivos) {
        this.objetivos = objetivos;
    }

    public FacultadBasicResponse getFacultad() {
        return facultad;
    }

    public void setFacultad(FacultadBasicResponse facultad) {
        this.facultad = facultad;
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
