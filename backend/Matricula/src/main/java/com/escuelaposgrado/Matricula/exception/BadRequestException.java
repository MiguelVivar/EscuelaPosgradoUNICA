package com.escuelaposgrado.Matricula.exception;

/**
 * Excepción para solicitudes incorrectas
 */
public class BadRequestException extends RuntimeException {
    
    public BadRequestException(String message) {
        super(message);
    }
    
    public BadRequestException(String message, Throwable cause) {
        super(message, cause);
    }
}
