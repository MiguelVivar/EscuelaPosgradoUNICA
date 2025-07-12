package com.escuelaposgrado.Matricula.dto.response.nested;

/**
 * DTO básico para información de Período Académico en respuestas anidadas
 */
public class PeriodoAcademicoBasicResponse {

    private Long id;
    private String nombre;
    private String codigo;

    // Constructors
    public PeriodoAcademicoBasicResponse() {}

    public PeriodoAcademicoBasicResponse(Long id, String nombre, String codigo) {
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
