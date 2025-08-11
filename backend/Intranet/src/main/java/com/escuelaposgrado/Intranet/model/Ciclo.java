package com.escuelaposgrado.Intranet.model;

/**
 * Enum para los ciclos académicos
 */
public enum Ciclo {
    I("Primer Ciclo"),
    II("Segundo Ciclo"),
    III("Tercer Ciclo"),
    IV("Cuarto Ciclo");
    
    private final String descripcion;
    
    Ciclo(String descripcion) {
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
