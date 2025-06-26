package com.escuelaposgrado.Autenticacion.model.entity;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.escuelaposgrado.Autenticacion.model.enums.Role;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Entidad Usuario que representa a todos los usuarios del sistema
 * académico de la Escuela de Posgrado UNICA
 */
@Entity
@Table(name = "usuarios")
public class Usuario implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    @NotBlank(message = "El nombre de usuario es obligatorio")
    @Size(min = 3, max = 50, message = "El nombre de usuario debe tener entre 3 y 50 caracteres")
    private String username;

    @Column(nullable = false, unique = true)
    @Email(message = "El email debe tener un formato válido")
    @NotBlank(message = "El email es obligatorio")
    private String email;

    @Column(nullable = false)
    @NotBlank(message = "La contraseña es obligatoria")
    @Size(min = 6, message = "La contraseña debe tener al menos 6 caracteres")
    private String password;

    @Column(name = "nombre", nullable = false, length = 100)
    @NotBlank(message = "El nombre es obligatorio")
    private String nombres;

    @Column(name = "apellido_paterno", nullable = false, length = 100)
    @NotBlank(message = "El apellido paterno es obligatorio")
    private String apellidoPaterno;

    @Column(name = "apellido_materno", length = 100)
    private String apellidoMaterno;

    @Column(length = 8)
    private String dni;

    @Column(length = 15)
    private String telefono;

    @Column(length = 500)
    private String direccion;

    @Enumerated(EnumType.STRING)
    @Column(name = "rol", nullable = false)
    private Role role;

    @Column(nullable = false)
    private Boolean activo = true;

    @Column(nullable = false, length = 20)
    private String estado = "ACTIVO"; // Estado del usuario (ACTIVO, INACTIVO, SUSPENDIDO)

    @Column(name = "fecha_creacion", nullable = false)
    private LocalDateTime fechaCreacion;

    @Column(name = "fecha_actualizacion")
    private LocalDateTime fechaActualizacion;

    @Column(name = "ultimo_acceso")
    private LocalDateTime ultimoAcceso;

    // Información adicional según el rol
    @Column(name = "codigo_estudiante")
    private String codigoEstudiante; // Para ALUMNO y POSTULANTE

    @Column(name = "codigo_docente")
    private String codigoDocente; // Para DOCENTE y COORDINADOR

    @Column(name = "especialidad")
    private String especialidad; // Para DOCENTE

    @Column(name = "programa_interes")
    private String programaInteres; // Para POSTULANTE

    // Constructores
    public Usuario() {
        this.fechaCreacion = LocalDateTime.now();
        this.activo = true;
        this.estado = "ACTIVO";
    }

    public Usuario(String username, String email, String password, String nombres, 
                   String apellidoPaterno, String apellidoMaterno, Role role) {
        this();
        this.username = username;
        this.email = email;
        this.password = password;
        this.nombres = nombres;
        this.apellidoPaterno = apellidoPaterno;
        this.apellidoMaterno = apellidoMaterno;
        this.role = role;
    }

    // Constructor de compatibilidad con apellidos combinados
    public Usuario(String username, String email, String password, String nombres, 
                   String apellidosCompletos, Role role) {
        this();
        this.username = username;
        this.email = email;
        this.password = password;
        this.nombres = nombres;
        this.role = role;
        
        // Dividir apellidos completos en paterno y materno
        if (apellidosCompletos != null && !apellidosCompletos.trim().isEmpty()) {
            String[] apellidosArray = apellidosCompletos.trim().split("\\s+", 2);
            this.apellidoPaterno = apellidosArray[0];
            this.apellidoMaterno = apellidosArray.length > 1 ? apellidosArray[1] : "";
        }
    }

    // Métodos de UserDetails
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return activo;
    }

    @Override
    public boolean isAccountNonLocked() {
        return activo;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return activo;
    }

    @Override
    public boolean isEnabled() {
        return activo;
    }

    // Métodos de ciclo de vida JPA
    @PrePersist
    protected void onCreate() {
        fechaCreacion = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        fechaActualizacion = LocalDateTime.now();
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public void setPassword(String password) {
        this.password = password;
    }

    public String getNombres() {
        return nombres;
    }

    public void setNombres(String nombres) {
        this.nombres = nombres;
    }

    public String getApellidoPaterno() {
        return apellidoPaterno;
    }

    public void setApellidoPaterno(String apellidoPaterno) {
        this.apellidoPaterno = apellidoPaterno;
    }

    public String getApellidoMaterno() {
        return apellidoMaterno;
    }

    public void setApellidoMaterno(String apellidoMaterno) {
        this.apellidoMaterno = apellidoMaterno;
    }

    // Método de compatibilidad para obtener apellidos completos
    @Transient
    public String getApellidos() {
        String resultado = apellidoPaterno != null ? apellidoPaterno : "";
        if (apellidoMaterno != null && !apellidoMaterno.trim().isEmpty()) {
            resultado += " " + apellidoMaterno;
        }
        return resultado.trim();
    }

    // Método de compatibilidad para establecer apellidos completos
    @Transient
    public void setApellidos(String apellidosCompletos) {
        if (apellidosCompletos != null && !apellidosCompletos.trim().isEmpty()) {
            String[] apellidosArray = apellidosCompletos.trim().split("\\s+", 2);
            this.apellidoPaterno = apellidosArray[0];
            this.apellidoMaterno = apellidosArray.length > 1 ? apellidosArray[1] : "";
        } else {
            this.apellidoPaterno = "";
            this.apellidoMaterno = "";
        }
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

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

    public LocalDateTime getFechaActualizacion() {
        return fechaActualizacion;
    }

    public void setFechaActualizacion(LocalDateTime fechaActualizacion) {
        this.fechaActualizacion = fechaActualizacion;
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
        return nombres + " " + getApellidos();
    }
}
