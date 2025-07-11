package com.escuelaposgrado.Matricula.model.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Entidad que representa los programas de estudio asociados a las facultades
 */
@Entity
@Table(name = "programas_estudio")
public class ProgramaEstudio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    @NotBlank(message = "El nombre del programa es obligatorio")
    @Size(max = 200, message = "El nombre no puede exceder 200 caracteres")
    private String nombre;

    @Column(nullable = false, unique = true, length = 20)
    @NotBlank(message = "El código es obligatorio")
    @Size(max = 20, message = "El código no puede exceder 20 caracteres")
    private String codigo;

    @Column(length = 50)
    private String nivel; // MAESTRIA, DOCTORADO, SEGUNDA_ESPECIALIDAD

    @Column(length = 50)
    private String modalidad; // PRESENCIAL, SEMIPRESENCIAL, VIRTUAL

    @Column(name = "duracion_semestres")
    private Integer duracionSemestres;

    @Column(name = "creditos_totales")
    private Integer creditosTotales;

    @Column(nullable = false)
    private Boolean activo = true;

    @Column(nullable = false)
    private Boolean disponible = true; // Si está disponible para matrícula

    @Column(length = 1000)
    private String descripcion;

    @Column(length = 500)
    private String objetivos;

    @Column(name = "fecha_creacion", nullable = false, updatable = false)
    private LocalDateTime fechaCreacion;

    @Column(name = "fecha_actualizacion")
    private LocalDateTime fechaActualizacion;

    // Relación con facultad
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "facultad_id", nullable = false)
    @NotNull(message = "La facultad es obligatoria")
    private Facultad facultad;

    // Relación con menciones
    @OneToMany(mappedBy = "programaEstudio", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Mencion> menciones;

    // Relación con tasas de pago
    @OneToMany(mappedBy = "programaEstudio", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<TasaPago> tasasPago;

    // Relación con turnos de matrícula
    @OneToMany(mappedBy = "programaEstudio", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<TurnoMatricula> turnosMatricula;

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
    public ProgramaEstudio() {}

    public ProgramaEstudio(String nombre, String codigo, String nivel, String modalidad, Facultad facultad) {
        this.nombre = nombre;
        this.codigo = codigo;
        this.nivel = nivel;
        this.modalidad = modalidad;
        this.facultad = facultad;
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getCodigo() { return codigo; }
    public void setCodigo(String codigo) { this.codigo = codigo; }

    public String getNivel() { return nivel; }
    public void setNivel(String nivel) { this.nivel = nivel; }

    public String getModalidad() { return modalidad; }
    public void setModalidad(String modalidad) { this.modalidad = modalidad; }

    public Integer getDuracionSemestres() { return duracionSemestres; }
    public void setDuracionSemestres(Integer duracionSemestres) { this.duracionSemestres = duracionSemestres; }

    public Integer getCreditosTotales() { return creditosTotales; }
    public void setCreditosTotales(Integer creditosTotales) { this.creditosTotales = creditosTotales; }

    public Boolean getActivo() { return activo; }
    public void setActivo(Boolean activo) { this.activo = activo; }

    public Boolean getDisponible() { return disponible; }
    public void setDisponible(Boolean disponible) { this.disponible = disponible; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public String getObjetivos() { return objetivos; }
    public void setObjetivos(String objetivos) { this.objetivos = objetivos; }

    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }

    public LocalDateTime getFechaActualizacion() { return fechaActualizacion; }
    public void setFechaActualizacion(LocalDateTime fechaActualizacion) { this.fechaActualizacion = fechaActualizacion; }

    public Facultad getFacultad() { return facultad; }
    public void setFacultad(Facultad facultad) { this.facultad = facultad; }

    public List<Mencion> getMenciones() { return menciones; }
    public void setMenciones(List<Mencion> menciones) { this.menciones = menciones; }

    public List<TasaPago> getTasasPago() { return tasasPago; }
    public void setTasasPago(List<TasaPago> tasasPago) { this.tasasPago = tasasPago; }

    public List<TurnoMatricula> getTurnosMatricula() { return turnosMatricula; }
    public void setTurnosMatricula(List<TurnoMatricula> turnosMatricula) { this.turnosMatricula = turnosMatricula; }
}
