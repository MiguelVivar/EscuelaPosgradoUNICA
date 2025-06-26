package com.escuelaposgrado.Autenticacion.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * DTO para cambiar la contraseña del usuario
 */
@Schema(description = "Datos requeridos para cambiar la contraseña del usuario")
public class CambiarPasswordRequest {

    @Schema(description = "Contraseña actual del usuario", example = "password123", required = true)
    @NotBlank(message = "La contraseña actual es obligatoria")
    private String passwordActual;

    @Schema(description = "Nueva contraseña (mínimo 6 caracteres)", example = "nuevaPassword123", required = true)
    @NotBlank(message = "La nueva contraseña es obligatoria")
    @Size(min = 6, message = "La nueva contraseña debe tener al menos 6 caracteres")
    private String nuevaPassword;

    @Schema(description = "Confirmar nueva contraseña", example = "nuevaPassword123", required = true)
    @NotBlank(message = "La confirmación de la nueva contraseña es obligatoria")
    private String confirmarNuevaPassword;

    // Constructores
    public CambiarPasswordRequest() {}

    public CambiarPasswordRequest(String passwordActual, String nuevaPassword, String confirmarNuevaPassword) {
        this.passwordActual = passwordActual;
        this.nuevaPassword = nuevaPassword;
        this.confirmarNuevaPassword = confirmarNuevaPassword;
    }

    // Getters y Setters
    public String getPasswordActual() {
        return passwordActual;
    }

    public void setPasswordActual(String passwordActual) {
        this.passwordActual = passwordActual;
    }

    public String getNuevaPassword() {
        return nuevaPassword;
    }

    public void setNuevaPassword(String nuevaPassword) {
        this.nuevaPassword = nuevaPassword;
    }

    public String getConfirmarNuevaPassword() {
        return confirmarNuevaPassword;
    }

    public void setConfirmarNuevaPassword(String confirmarNuevaPassword) {
        this.confirmarNuevaPassword = confirmarNuevaPassword;
    }

    /**
     * Valida que las nuevas contraseñas coincidan
     */
    public boolean isPasswordValid() {
        return nuevaPassword != null && nuevaPassword.equals(confirmarNuevaPassword);
    }
}
