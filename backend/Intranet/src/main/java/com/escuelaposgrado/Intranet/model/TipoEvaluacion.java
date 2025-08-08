package com.escuelaposgrado.Intranet.model;

/**
 * Enum para los tipos de evaluación
 */
public enum TipoEvaluacion {
    EXAMEN_PARCIAL("Examen Parcial"),
    EXAMEN_FINAL("Examen Final"),
    PRACTICA_CALIFICADA("Práctica Calificada"),
    TRABAJO_INDIVIDUAL("Trabajo Individual"),
    TRABAJO_GRUPAL("Trabajo Grupal"),
    EXPOSICION("Exposición"),
    LABORATORIO("Laboratorio"),
    TALLER("Taller"),
    PROYECTO("Proyecto"),
    ENSAYO("Ensayo"),
    INVESTIGACION("Investigación"),
    PARTICIPACION("Participación");
    
    private final String descripcion;
    
    TipoEvaluacion(String descripcion) {
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
