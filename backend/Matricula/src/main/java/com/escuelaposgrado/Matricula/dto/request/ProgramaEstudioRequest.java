package com.escuelaposgrado.Matricula.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

/**
 * DTO para solicitudes de operaciones de Programa de Estudio
 */
public class ProgramaEstudioRequest {

    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 200, message = "El nombre no puede superar los 200 caracteres")
    private String nombre;

    @NotBlank(message = "El código es obligatorio")
    @Size(max = 20, message = "El código no puede superar los 20 caracteres")
    private String codigo;

    @Size(max = 50, message = "El nivel no puede superar los 50 caracteres")
    private String nivel; // MAESTRIA, DOCTORADO, SEGUNDA_ESPECIALIDAD

    @Size(max = 50, message = "La modalidad no puede superar los 50 caracteres")
    private String modalidad; // PRESENCIAL, SEMIPRESENCIAL, VIRTUAL

    @Positive(message = "La duración en semestres debe ser un número positivo")
    private Integer duracionSemestres;

    @Positive(message = "Los créditos totales debe ser un número positivo")
    private Integer creditosTotales;

    @Size(max = 1000, message = "La descripción no puede superar los 1000 caracteres")
    private String descripcion;

    @Size(max = 500, message = "Los objetivos no pueden superar los 500 caracteres")
    private String objetivos;

    @NotNull(message = "La facultad es obligatoria")
    private Long facultadId;

    // Constructors
    public ProgramaEstudioRequest() {}

    public ProgramaEstudioRequest(String nombre, String codigo, String nivel, String modalidad, 
                                  Integer duracionSemestres, Integer creditosTotales, 
                                  String descripcion, String objetivos, Long facultadId) {
        this.nombre = nombre;
        this.codigo = codigo;
        this.nivel = nivel;
        this.modalidad = modalidad;
        this.duracionSemestres = duracionSemestres;
        this.creditosTotales = creditosTotales;
        this.descripcion = descripcion;
        this.objetivos = objetivos;
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

    public Long getFacultadId() {
        return facultadId;
    }

    public void setFacultadId(Long facultadId) {
        this.facultadId = facultadId;
    }
}
