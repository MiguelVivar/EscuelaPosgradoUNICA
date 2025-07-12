package com.escuelaposgrado.Matricula.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * DTO para las solicitudes de creación/actualización de menciones
 */
public class MencionRequest {

    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 200, message = "El nombre no puede exceder 200 caracteres")
    private String nombre;

    @NotBlank(message = "El código es obligatorio")
    @Size(max = 20, message = "El código no puede exceder 20 caracteres")
    private String codigo;

    @Size(max = 1000, message = "La descripción no puede exceder 1000 caracteres")
    private String descripcion;

    @Size(max = 500, message = "Los requisitos no pueden exceder 500 caracteres")
    private String requisitos;

    @NotNull(message = "El programa de estudio es obligatorio")
    private Long programaEstudioId;

    // Constructores
    public MencionRequest() {}

    public MencionRequest(String nombre, String codigo, Long programaEstudioId) {
        this.nombre = nombre;
        this.codigo = codigo;
        this.programaEstudioId = programaEstudioId;
    }

    // Getters y Setters
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getCodigo() { return codigo; }
    public void setCodigo(String codigo) { this.codigo = codigo; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public String getRequisitos() { return requisitos; }
    public void setRequisitos(String requisitos) { this.requisitos = requisitos; }

    public Long getProgramaEstudioId() { return programaEstudioId; }
    public void setProgramaEstudioId(Long programaEstudioId) { this.programaEstudioId = programaEstudioId; }
}
