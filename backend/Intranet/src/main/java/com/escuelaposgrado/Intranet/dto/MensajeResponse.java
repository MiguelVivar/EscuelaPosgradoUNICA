package com.escuelaposgrado.Intranet.dto;

/**
 * DTO para respuestas de mensaje
 */
public class MensajeResponse {
    private String mensaje;
    
    public MensajeResponse(String mensaje) {
        this.mensaje = mensaje;
    }
    
    public String getMensaje() {
        return mensaje;
    }
    
    public void setMensaje(String mensaje) {
        this.mensaje = mensaje;
    }
}
