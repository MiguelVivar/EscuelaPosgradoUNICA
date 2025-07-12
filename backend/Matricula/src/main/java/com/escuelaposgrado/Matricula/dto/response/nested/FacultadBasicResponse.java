package com.escuelaposgrado.Matricula.dto.response.nested;

/**
 * DTO básico para Facultad (para usar en respuestas anidadas)
 */
public class FacultadBasicResponse {

    private Long id;
    private String nombre;
    private String codigo;

    // Constructors
    public FacultadBasicResponse() {}

    public FacultadBasicResponse(Long id, String nombre, String codigo) {
        this.id = id;
        this.nombre = nombre;
        this.codigo = codigo;
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
}
