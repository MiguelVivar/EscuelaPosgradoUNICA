package com.escuelaposgrado.Intranet.model;

/**
 * Enum para los roles de usuario en el sistema de intranet
 */
public enum Role {
    ADMIN("Administrador"),
    COORDINADOR("Coordinador Académico"),
    DOCENTE("Docente"),
    ALUMNO("Alumno"),
    POSTULANTE("Postulante");
    
    private final String descripcion;
    
    Role(String descripcion) {
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
