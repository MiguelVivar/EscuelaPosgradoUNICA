package com.escuelaposgrado.Matricula.dto.common;

/**
 * DTO para respuestas simples con mensaje
 */
public class MessageResponse {
    
    private String message;
    private boolean success;
    private Object data;

    public MessageResponse() {}

    public MessageResponse(String message) {
        this.message = message;
        this.success = true;
    }

    public MessageResponse(String message, boolean success) {
        this.message = message;
        this.success = success;
    }

    public MessageResponse(String message, boolean success, Object data) {
        this.message = message;
        this.success = success;
        this.data = data;
    }

    // Métodos estáticos para crear respuestas comunes
    public static MessageResponse success(String message) {
        return new MessageResponse(message, true);
    }

    public static MessageResponse success(String message, Object data) {
        return new MessageResponse(message, true, data);
    }

    public static MessageResponse error(String message) {
        return new MessageResponse(message, false);
    }

    // Getters y Setters
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public Object getData() { return data; }
    public void setData(Object data) { this.data = data; }
}
