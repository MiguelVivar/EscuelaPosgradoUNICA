package com.escuelaposgrado.Autenticacion.dto.response;

import java.time.LocalDateTime;

import com.escuelaposgrado.Autenticacion.model.enums.Role;

/**
 * DTO para las respuestas de autenticación (login exitoso)
 */
public class AuthResponse {

    private String token;
    private String type = "Bearer";
    private Long id;
    private String username;
    private String email;
    private String nombres;
    private String apellidos;
    private Role role;
    private LocalDateTime ultimoAcceso;

    // Campos adicionales según el rol
    private String codigoEstudiante;
    private String codigoDocente;
    private String especialidad;
    private String programaInteres;

    // Constructores
    public AuthResponse() {}

    public AuthResponse(String token, Long id, String username, String email, 
                       String nombres, String apellidos, Role role) {
        this.token = token;
        this.id = id;
        this.username = username;
        this.email = email;
        this.nombres = nombres;
        this.apellidos = apellidos;
        this.role = role;
    }

    // Getters y Setters
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public LocalDateTime getUltimoAcceso() {
        return ultimoAcceso;
    }

    public void setUltimoAcceso(LocalDateTime ultimoAcceso) {
        this.ultimoAcceso = ultimoAcceso;
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

    public String getNombreCompleto() {
        return nombres + " " + apellidos;
    }
}
