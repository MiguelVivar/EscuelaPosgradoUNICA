package com.escuelaposgrado.Autenticacion.dto.request;

import com.escuelaposgrado.Autenticacion.model.enums.Role;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * DTO para el registro de nuevos usuarios
 */
@Schema(description = "Datos requeridos para registrar un nuevo usuario")
public class RegistroRequest {

    @Schema(description = "Nombre de usuario único", example = "juan.perez", required = true)
    @NotBlank(message = "El nombre de usuario es obligatorio")
    @Size(min = 3, max = 50, message = "El nombre de usuario debe tener entre 3 y 50 caracteres")
    private String username;

    @Schema(description = "Correo electrónico institucional", example = "juan.perez@unica.edu.pe", required = true)
    @NotBlank(message = "El email es obligatorio")
    @Email(message = "El email debe tener un formato válido")
    private String email;

    @Schema(description = "Contraseña (mínimo 6 caracteres)", example = "password123", required = true)
    @NotBlank(message = "La contraseña es obligatoria")
    @Size(min = 6, message = "La contraseña debe tener al menos 6 caracteres")
    private String password;

    @Schema(description = "Nombres del usuario", example = "Juan Carlos", required = true)
    @NotBlank(message = "El nombre es obligatorio")
    private String nombres;

    @Schema(description = "Apellidos del usuario", example = "Pérez García", required = true)
    @NotBlank(message = "Los apellidos son obligatorios")
    private String apellidos;

    private String dni;

    private String telefono;

    @NotNull(message = "El rol es obligatorio")
    private Role role;

    // Campos opcionales según el rol
    private String codigoEstudiante;
    private String codigoDocente;
    private String especialidad;
    private String programaInteres;

    // Constructores
    public RegistroRequest() {}

    // Getters y Setters
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getNombres() {
        return nombres;
    }

    public void setNombres(String nombres) {
        this.nombres = nombres;
    }

    public String getApellidos() {
        return apellidos;
    }

    public void setApellidos(String apellidos) {
        this.apellidos = apellidos;
    }

    public String getDni() {
        return dni;
    }

    public void setDni(String dni) {
        this.dni = dni;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public String getCodigoEstudiante() {
        return codigoEstudiante;
    }

    public void setCodigoEstudiante(String codigoEstudiante) {
        this.codigoEstudiante = codigoEstudiante;
    }

    public String getCodigoDocente() {
        return codigoDocente;
    }

    public void setCodigoDocente(String codigoDocente) {
        this.codigoDocente = codigoDocente;
    }

    public String getEspecialidad() {
        return especialidad;
    }

    public void setEspecialidad(String especialidad) {
        this.especialidad = especialidad;
    }

    public String getProgramaInteres() {
        return programaInteres;
    }

    public void setProgramaInteres(String programaInteres) {
        this.programaInteres = programaInteres;
    }
}
