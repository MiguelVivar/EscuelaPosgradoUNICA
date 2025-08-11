package com.escuelaposgrado.Intranet.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

/**
 * Entidad para registrar la asistencia de estudiantes
 */
@Entity
@Table(name = "asistencias")
public class Asistencia {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull(message = "La fecha es obligatoria")
    @Column(nullable = false)
    private LocalDate fecha;
    
    @NotNull(message = "La hora de entrada es obligatoria")
    @Column(name = "hora_entrada", nullable = false)
    private LocalTime horaEntrada;
    
    @Column(name = "hora_salida")
    private LocalTime horaSalida;
    
    @NotNull(message = "El estado de asistencia es obligatorio")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoAsistencia estado;
    
    @Size(max = 500, message = "Las observaciones no pueden exceder 500 caracteres")
    private String observaciones;
    
    @NotNull(message = "Las horas académicas son obligatorias")
    @Min(value = 1, message = "Las horas académicas deben ser al menos 1")
    private Integer horasAcademicas;
    
    // Relaciones
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "estudiante_id", nullable = false)
    @NotNull(message = "El estudiante es obligatorio")
    private Usuario estudiante;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "materia_id", nullable = false)
    @NotNull(message = "La materia es obligatoria")
    private Materia materia;
    
    @Column(name = "fecha_registro", nullable = false, updatable = false)
    private LocalDateTime fechaRegistro;
    
    @Column(name = "fecha_actualizacion")
    private LocalDateTime fechaActualizacion;
    
    @Column(name = "registrado_por")
    private String registradoPor; // Username del usuario que registró la asistencia
    
    // Constructors
    public Asistencia() {}
    
    public Asistencia(LocalDate fecha, LocalTime horaEntrada, EstadoAsistencia estado, 
                     Usuario estudiante, Materia materia, Integer horasAcademicas) {
        this.fecha = fecha;
        this.horaEntrada = horaEntrada;
        this.estado = estado;
        this.estudiante = estudiante;
        this.materia = materia;
        this.horasAcademicas = horasAcademicas;
    }
    
    // Métodos del ciclo de vida de JPA
    @PrePersist
    protected void onCreate() {
        fechaRegistro = LocalDateTime.now();
        fechaActualizacion = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        fechaActualizacion = LocalDateTime.now();
    }
    
    // Métodos utilitarios
    public boolean esAsistencia() {
        return estado == EstadoAsistencia.PRESENTE;
    }
    
    public boolean esFalta() {
        return estado == EstadoAsistencia.AUSENTE;
    }
    
    public boolean esTardanza() {
        return estado == EstadoAsistencia.TARDANZA;
    }
    
    public boolean tieneHoraSalida() {
        return horaSalida != null;
    }
    
    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public LocalDate getFecha() { return fecha; }
    public void setFecha(LocalDate fecha) { this.fecha = fecha; }
    
    public LocalTime getHoraEntrada() { return horaEntrada; }
    public void setHoraEntrada(LocalTime horaEntrada) { this.horaEntrada = horaEntrada; }
    
    public LocalTime getHoraSalida() { return horaSalida; }
    public void setHoraSalida(LocalTime horaSalida) { this.horaSalida = horaSalida; }
    
    public EstadoAsistencia getEstado() { return estado; }
    public void setEstado(EstadoAsistencia estado) { this.estado = estado; }
    
    public String getObservaciones() { return observaciones; }
    public void setObservaciones(String observaciones) { this.observaciones = observaciones; }
    
    public Integer getHorasAcademicas() { return horasAcademicas; }
    public void setHorasAcademicas(Integer horasAcademicas) { this.horasAcademicas = horasAcademicas; }
    
    public Usuario getEstudiante() { return estudiante; }
    public void setEstudiante(Usuario estudiante) { this.estudiante = estudiante; }
    
    public Materia getMateria() { return materia; }
    public void setMateria(Materia materia) { this.materia = materia; }
    
    public LocalDateTime getFechaRegistro() { return fechaRegistro; }
    public void setFechaRegistro(LocalDateTime fechaRegistro) { this.fechaRegistro = fechaRegistro; }
    
    public LocalDateTime getFechaActualizacion() { return fechaActualizacion; }
    public void setFechaActualizacion(LocalDateTime fechaActualizacion) { this.fechaActualizacion = fechaActualizacion; }
    
    public String getRegistradoPor() { return registradoPor; }
    public void setRegistradoPor(String registradoPor) { this.registradoPor = registradoPor; }
}
