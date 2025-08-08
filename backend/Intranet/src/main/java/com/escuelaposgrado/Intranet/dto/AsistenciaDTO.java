package com.escuelaposgrado.Intranet.dto;

import jakarta.validation.constraints.*;
import java.time.LocalDate;
import java.time.LocalTime;

/**
 * DTO para el registro de asistencia
 */
public class AsistenciaDTO {
    
    private Long id;
    
    @NotNull(message = "El ID del estudiante es obligatorio")
    private Long estudianteId;
    
    @NotNull(message = "El ID de la materia es obligatorio")
    private Long materiaId;
    
    @NotNull(message = "La fecha es obligatoria")
    private LocalDate fecha;
    
    @NotNull(message = "La hora de entrada es obligatoria")
    private LocalTime horaEntrada;
    
    private LocalTime horaSalida;
    
    @NotBlank(message = "El estado es obligatorio")
    private String estado;
    
    @Size(max = 500, message = "Las observaciones no pueden exceder 500 caracteres")
    private String observaciones;
    
    @NotNull(message = "Las horas académicas son obligatorias")
    @Min(value = 1, message = "Las horas académicas deben ser al menos 1")
    private Integer horasAcademicas;
    
    // Campos de solo lectura
    private String estudianteNombre;
    private String materiaNombre;
    private String registradoPor;
    
    // Constructors
    public AsistenciaDTO() {}
    
    public AsistenciaDTO(Long estudianteId, Long materiaId, LocalDate fecha, 
                        LocalTime horaEntrada, String estado, Integer horasAcademicas) {
        this.estudianteId = estudianteId;
        this.materiaId = materiaId;
        this.fecha = fecha;
        this.horaEntrada = horaEntrada;
        this.estado = estado;
        this.horasAcademicas = horasAcademicas;
    }
    
    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getEstudianteId() { return estudianteId; }
    public void setEstudianteId(Long estudianteId) { this.estudianteId = estudianteId; }
    
    public Long getMateriaId() { return materiaId; }
    public void setMateriaId(Long materiaId) { this.materiaId = materiaId; }
    
    public LocalDate getFecha() { return fecha; }
    public void setFecha(LocalDate fecha) { this.fecha = fecha; }
    
    public LocalTime getHoraEntrada() { return horaEntrada; }
    public void setHoraEntrada(LocalTime horaEntrada) { this.horaEntrada = horaEntrada; }
    
    public LocalTime getHoraSalida() { return horaSalida; }
    public void setHoraSalida(LocalTime horaSalida) { this.horaSalida = horaSalida; }
    
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
    
    public String getObservaciones() { return observaciones; }
    public void setObservaciones(String observaciones) { this.observaciones = observaciones; }
    
    public Integer getHorasAcademicas() { return horasAcademicas; }
    public void setHorasAcademicas(Integer horasAcademicas) { this.horasAcademicas = horasAcademicas; }
    
    public String getEstudianteNombre() { return estudianteNombre; }
    public void setEstudianteNombre(String estudianteNombre) { this.estudianteNombre = estudianteNombre; }
    
    public String getMateriaNombre() { return materiaNombre; }
    public void setMateriaNombre(String materiaNombre) { this.materiaNombre = materiaNombre; }
    
    public String getRegistradoPor() { return registradoPor; }
    public void setRegistradoPor(String registradoPor) { this.registradoPor = registradoPor; }
}
