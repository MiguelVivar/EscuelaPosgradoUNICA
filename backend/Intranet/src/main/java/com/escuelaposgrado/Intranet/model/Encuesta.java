package com.escuelaposgrado.Intranet.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Entidad para las encuestas académicas
 */
@Entity
@Table(name = "encuestas")
public class Encuesta {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "El título es obligatorio")
    @Size(max = 200, message = "El título no puede exceder 200 caracteres")
    @Column(nullable = false)
    private String titulo;
    
    @NotBlank(message = "La descripción es obligatoria")
    @Size(max = 1000, message = "La descripción no puede exceder 1000 caracteres")
    @Column(nullable = false, columnDefinition = "TEXT")
    private String descripcion;
    
    @NotNull(message = "El tipo de encuesta es obligatorio")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoEncuesta tipo;
    
    @NotNull(message = "La fecha de inicio es obligatoria")
    @Column(name = "fecha_inicio", nullable = false)
    private LocalDate fechaInicio;
    
    @NotNull(message = "La fecha de fin es obligatoria")
    @Column(name = "fecha_fin", nullable = false)
    private LocalDate fechaFin;
    
    @Column(nullable = false)
    private Boolean activa = true;
    
    @Column(nullable = false)
    private Boolean anonima = false;
    
    @Column(nullable = false)
    private Boolean obligatoria = false;
    
    // Para encuestas específicas de materias
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "materia_id")
    private Materia materia;
    
    // Para encuestas dirigidas a roles específicos
    @Enumerated(EnumType.STRING)
    @Column(name = "rol_objetivo")
    private Role rolObjetivo;
    
    @Column(name = "instrucciones", columnDefinition = "TEXT")
    private String instrucciones;
    
    // Relaciones
    @OneToMany(mappedBy = "encuesta", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<PreguntaEncuesta> preguntas;
    
    @OneToMany(mappedBy = "encuesta", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<RespuestaEncuesta> respuestas;
    
    @Column(name = "fecha_creacion", nullable = false, updatable = false)
    private LocalDateTime fechaCreacion;
    
    @Column(name = "fecha_actualizacion")
    private LocalDateTime fechaActualizacion;
    
    @Column(name = "creado_por")
    private String creadoPor; // Username del usuario que creó la encuesta
    
    // Constructors
    public Encuesta() {}
    
    public Encuesta(String titulo, String descripcion, TipoEncuesta tipo, 
                   LocalDate fechaInicio, LocalDate fechaFin) {
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.tipo = tipo;
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
    }
    
    // Métodos del ciclo de vida de JPA
    @PrePersist
    protected void onCreate() {
        fechaCreacion = LocalDateTime.now();
        fechaActualizacion = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        fechaActualizacion = LocalDateTime.now();
    }
    
    // Métodos utilitarios
    public boolean estaActiva() {
        LocalDate hoy = LocalDate.now();
        return activa && !hoy.isBefore(fechaInicio) && !hoy.isAfter(fechaFin);
    }
    
    public boolean haTerminado() {
        return LocalDate.now().isAfter(fechaFin);
    }
    
    public boolean noHaIniciado() {
        return LocalDate.now().isBefore(fechaInicio);
    }
    
    public int getDiasRestantes() {
        LocalDate hoy = LocalDate.now();
        if (hoy.isAfter(fechaFin)) {
            return 0;
        }
        return (int) hoy.until(fechaFin).getDays();
    }
    
    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }
    
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    
    public TipoEncuesta getTipo() { return tipo; }
    public void setTipo(TipoEncuesta tipo) { this.tipo = tipo; }
    
    public LocalDate getFechaInicio() { return fechaInicio; }
    public void setFechaInicio(LocalDate fechaInicio) { this.fechaInicio = fechaInicio; }
    
    public LocalDate getFechaFin() { return fechaFin; }
    public void setFechaFin(LocalDate fechaFin) { this.fechaFin = fechaFin; }
    
    public Boolean getActiva() { return activa; }
    public void setActiva(Boolean activa) { this.activa = activa; }
    
    public Boolean getAnonima() { return anonima; }
    public void setAnonima(Boolean anonima) { this.anonima = anonima; }
    
    public Boolean getObligatoria() { return obligatoria; }
    public void setObligatoria(Boolean obligatoria) { this.obligatoria = obligatoria; }
    
    public Materia getMateria() { return materia; }
    public void setMateria(Materia materia) { this.materia = materia; }
    
    public Role getRolObjetivo() { return rolObjetivo; }
    public void setRolObjetivo(Role rolObjetivo) { this.rolObjetivo = rolObjetivo; }
    
    public String getInstrucciones() { return instrucciones; }
    public void setInstrucciones(String instrucciones) { this.instrucciones = instrucciones; }
    
    public List<PreguntaEncuesta> getPreguntas() { return preguntas; }
    public void setPreguntas(List<PreguntaEncuesta> preguntas) { this.preguntas = preguntas; }
    
    public List<RespuestaEncuesta> getRespuestas() { return respuestas; }
    public void setRespuestas(List<RespuestaEncuesta> respuestas) { this.respuestas = respuestas; }
    
    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }
    
    public LocalDateTime getFechaActualizacion() { return fechaActualizacion; }
    public void setFechaActualizacion(LocalDateTime fechaActualizacion) { this.fechaActualizacion = fechaActualizacion; }
    
    public String getCreadoPor() { return creadoPor; }
    public void setCreadoPor(String creadoPor) { this.creadoPor = creadoPor; }
}
