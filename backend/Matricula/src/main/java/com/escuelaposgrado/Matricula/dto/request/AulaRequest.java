package com.escuelaposgrado.Matricula.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

/**
 * DTO para solicitudes de operaciones de Aula
 */
public class AulaRequest {

    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 100, message = "El nombre no puede superar los 100 caracteres")
    private String nombre;

    @NotBlank(message = "El código es obligatorio")
    @Size(max = 10, message = "El código no puede superar los 10 caracteres")
    private String codigo;

    @NotNull(message = "La capacidad es obligatoria")
    @Positive(message = "La capacidad debe ser un número positivo")
    private Integer capacidad;

    @Size(max = 50, message = "El tipo no puede superar los 50 caracteres")
    private String tipo;

    @Size(max = 500, message = "El equipamiento no puede superar los 500 caracteres")
    private String equipamiento;

    @Size(max = 500, message = "La descripción no puede superar los 500 caracteres")
    private String descripcion;

    @NotNull(message = "La sede es obligatoria")
    private Long sedeId;

    // Constructors
    public AulaRequest() {}

    public AulaRequest(String nombre, String codigo, Integer capacidad, String tipo, String equipamiento, String descripcion, Long sedeId) {
        this.nombre = nombre;
        this.codigo = codigo;
        this.capacidad = capacidad;
        this.tipo = tipo;
        this.equipamiento = equipamiento;
        this.descripcion = descripcion;
        this.sedeId = sedeId;
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

    public Long getSedeId() {
        return sedeId;
    }

    public void setSedeId(Long sedeId) {
        this.sedeId = sedeId;
    }
}
