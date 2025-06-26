package com.escuelaposgrado.Autenticacion.dto.request;

import com.escuelaposgrado.Autenticacion.model.enums.Role;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * DTO para actualizar información de usuario por parte del administrador
 * Incluye todos los campos que el admin puede modificar
 */
@Schema(description = "Datos que el administrador puede actualizar de un usuario")
public class ActualizarUsuarioAdminRequest {

    @Schema(description = "Nombre de usuario único", example = "juan.perez", required = true)
    @NotBlank(message = "El nombre de usuario es obligatorio")
    @Size(min = 3, max = 50, message = "El nombre de usuario debe tener entre 3 y 50 caracteres")
    private String username;

    @Schema(description = "Correo electrónico institucional", example = "juan.perez@unica.edu.pe", required = true)
    @NotBlank(message = "El email es obligatorio")
    @Email(message = "El email debe tener un formato válido")
    private String email;

    @Schema(description = "Nombres del usuario", example = "Juan Carlos", required = true)
    @NotBlank(message = "El nombre es obligatorio")
    private String nombres;

    @Schema(description = "Apellidos del usuario", example = "Pérez García", required = true)
    @NotBlank(message = "Los apellidos son obligatorios")
    private String apellidos;

    @Schema(description = "Documento Nacional de Identidad", example = "12345678")
    private String dni;

    @Schema(description = "Número de teléfono del usuario", example = "987654321")
    @Size(max = 15, message = "El teléfono no puede tener más de 15 caracteres")
    private String telefono;

    @Schema(description = "Dirección del usuario", example = "Av. Ejemplo 123, Ica")
    @Size(max = 500, message = "La dirección no puede tener más de 500 caracteres")
    private String direccion;

    @Schema(description = "Rol del usuario", example = "ALUMNO", required = true)
    @NotNull(message = "El rol es obligatorio")
    private Role role;

    @Schema(description = "Código de estudiante (para alumnos)", example = "2023100001")
    private String codigoEstudiante;

    @Schema(description = "Código de docente (para docentes)", example = "DOC001")
    private String codigoDocente;

    @Schema(description = "Especialidad del usuario", example = "Ingeniería de Sistemas")
    private String especialidad;

    @Schema(description = "Programa de interés", example = "Maestría en Ciencias de la Computación")
    private String programaInteres;

    @Schema(description = "Nueva contraseña (opcional, mínimo 6 caracteres)", example = "nuevaPassword123")
    @Size(min = 6, message = "La contraseña debe tener al menos 6 caracteres")
    private String password;

    // Constructores
    public ActualizarUsuarioAdminRequest() {}

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

    public String getDireccion() {
        return direccion;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
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

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    /**
     * Verifica si se va a actualizar la contraseña
     */
    public boolean isUpdatingPassword() {
        return password != null && !password.trim().isEmpty();
    }
}
