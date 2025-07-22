package com.escuelaposgrado.Intranet.model;

/**
 * Enum para los tipos de encuesta
 */
public enum TipoEncuesta {
    EVALUACION_DOCENTE("Evaluación Docente"),
    SATISFACCION_CURSO("Satisfacción del Curso"),
    INFRAESTRUCTURA("Infraestructura"),
    SERVICIOS_ACADEMICOS("Servicios Académicos"),
    CLIMA_INSTITUCIONAL("Clima Institucional"),
    OPINION_GENERAL("Opinión General"),
    SEGUIMIENTO_EGRESADOS("Seguimiento de Egresados");
    
    private final String descripcion;
    
    TipoEncuesta(String descripcion) {
        this.descripcion = descripcion;
    }
    
    public String getDescripcion() {
        return descripcion;
    }
    
    @Override
    public String toString() {
        return descripcion;
    }
}
