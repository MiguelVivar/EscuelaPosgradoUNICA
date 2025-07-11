package com.escuelaposgrado.Matricula.model.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

/**
 * Entidad que representa las comisiones de unidades de posgrado
 * de cada facultad
 */
@Entity
@Table(name = "comisiones_unidad_posgrado")
public class ComisionUnidadPosgrado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    @NotBlank(message = "El nombre de la comisión es obligatorio")
    @Size(max = 200, message = "El nombre no puede exceder 200 caracteres")
    private String nombre;

    @Column(nullable = false, length = 20)
    @NotBlank(message = "El código es obligatorio")
    @Size(max = 20, message = "El código no puede exceder 20 caracteres")
    private String codigo;

    @Column(length = 50)
    private String tipo; // POSGRADO, SEGUNDA_ESPECIALIDAD

    @Column(length = 100)
    private String presidente;

    @Column(length = 100)
    private String secretario;

    @Column(length = 500)
    private String miembros; // Lista de miembros separados por comas

    @Column(nullable = false)
    private Boolean activo = true;

    @Column(length = 1000)
    private String descripcion;

    @Column(length = 500)
    private String funciones;

    @Column(name = "fecha_inicio_gestion")
    private LocalDateTime fechaInicioGestion;

    @Column(name = "fecha_fin_gestion")
    private LocalDateTime fechaFinGestion;

    @Column(name = "fecha_creacion", nullable = false, updatable = false)
    private LocalDateTime fechaCreacion;

    @Column(name = "fecha_actualizacion")
    private LocalDateTime fechaActualizacion;

    // Relación con facultad
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "facultad_id", nullable = false)
    @NotNull(message = "La facultad es obligatoria")
    private Facultad facultad;

    @PrePersist
    protected void onCreate() {
        fechaCreacion = LocalDateTime.now();
        fechaActualizacion = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        fechaActualizacion = LocalDateTime.now();
    }

    // Constructores
    public ComisionUnidadPosgrado() {}

    public ComisionUnidadPosgrado(String nombre, String codigo, String tipo, Facultad facultad) {
        this.nombre = nombre;
        this.codigo = codigo;
        this.tipo = tipo;
        this.facultad = facultad;
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getCodigo() { return codigo; }
    public void setCodigo(String codigo) { this.codigo = codigo; }

    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }

    public String getPresidente() { return presidente; }
    public void setPresidente(String presidente) { this.presidente = presidente; }

    public String getSecretario() { return secretario; }
    public void setSecretario(String secretario) { this.secretario = secretario; }

    public String getMiembros() { return miembros; }
    public void setMiembros(String miembros) { this.miembros = miembros; }

    public Boolean getActivo() { return activo; }
    public void setActivo(Boolean activo) { this.activo = activo; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public String getFunciones() { return funciones; }
    public void setFunciones(String funciones) { this.funciones = funciones; }

    public LocalDateTime getFechaInicioGestion() { return fechaInicioGestion; }
    public void setFechaInicioGestion(LocalDateTime fechaInicioGestion) { this.fechaInicioGestion = fechaInicioGestion; }

    public LocalDateTime getFechaFinGestion() { return fechaFinGestion; }
    public void setFechaFinGestion(LocalDateTime fechaFinGestion) { this.fechaFinGestion = fechaFinGestion; }

    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }

    public LocalDateTime getFechaActualizacion() { return fechaActualizacion; }
    public void setFechaActualizacion(LocalDateTime fechaActualizacion) { this.fechaActualizacion = fechaActualizacion; }

    public Facultad getFacultad() { return facultad; }
    public void setFacultad(Facultad facultad) { this.facultad = facultad; }
}
