package com.escuelaposgrado.Autenticacion.dto.response;

import java.time.LocalDateTime;

import com.escuelaposgrado.Autenticacion.model.enums.Role;

/**
 * DTO para mostrar información de usuario (sin información sensible)
 */
public class UsuarioResponse {

    private Long id;
    private String username;
    private String email;
    private String nombres;
    private String apellidos;
    private String dni;
    private String telefono;
    private String direccion;
    private Role role;
    private Boolean activo;
    private LocalDateTime fechaCreacion;
    private LocalDateTime ultimoAcceso;

    // Campos adicionales según el rol
    private String codigoEstudiante;
    private String codigoDocente;
    private String especialidad;
    private String programaInteres;

    // Constructores
    public UsuarioResponse() {}

    // Getters y Setters
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

    public Boolean getActivo() {
        return activo;
    }

    public void setActivo(Boolean activo) {
        this.activo = activo;
    }

    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
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
