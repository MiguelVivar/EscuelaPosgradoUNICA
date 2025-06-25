package com.escuelaposgrado.Autenticacion.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

/**
 * DTO para las peticiones de login
 */
@Schema(description = "Datos requeridos para el login de usuario")
public class LoginRequest {

    @Schema(description = "Nombre de usuario o email", example = "admin", required = true)
    @NotBlank(message = "El username o email es obligatorio")
    private String usernameOrEmail;

    @Schema(description = "Contraseña del usuario", example = "admin123", required = true)
    @NotBlank(message = "La contraseña es obligatoria")
    private String password;

    // Constructores
    public LoginRequest() {}

    public LoginRequest(String usernameOrEmail, String password) {
        this.usernameOrEmail = usernameOrEmail;
        this.password = password;
    }

    // Getters y Setters
    public String getUsernameOrEmail() {
        return usernameOrEmail;
    }

    public void setUsernameOrEmail(String usernameOrEmail) {
        this.usernameOrEmail = usernameOrEmail;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
