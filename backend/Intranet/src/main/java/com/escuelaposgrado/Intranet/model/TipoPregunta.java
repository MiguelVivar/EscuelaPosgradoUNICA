package com.escuelaposgrado.Intranet.model;

/**
 * Enum para los tipos de pregunta
 */
public enum TipoPregunta {
    TEXTO_CORTO("Texto Corto"),
    TEXTO_LARGO("Texto Largo"),
    OPCION_MULTIPLE("Opción Múltiple"),
    SELECCION_MULTIPLE("Selección Múltiple"),
    ESCALA_NUMERICA("Escala Numérica"),
    ESCALA_LIKERT("Escala Likert"),
    SI_NO("Sí/No"),
    FECHA("Fecha"),
    NUMERO("Número");
    
    private final String descripcion;
    
    TipoPregunta(String descripcion) {
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
