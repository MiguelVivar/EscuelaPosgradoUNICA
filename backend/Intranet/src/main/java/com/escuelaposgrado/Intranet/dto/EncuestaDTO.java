package com.escuelaposgrado.Intranet.dto;

import jakarta.validation.constraints.*;
import java.time.LocalDate;
import java.util.List;

/**
 * DTO para la gestión de encuestas
 */
public class EncuestaDTO {
    
    private Long id;
    
    @NotBlank(message = "El título es obligatorio")
    @Size(max = 200, message = "El título no puede exceder 200 caracteres")
    private String titulo;
    
    @NotBlank(message = "La descripción es obligatoria")
    @Size(max = 1000, message = "La descripción no puede exceder 1000 caracteres")
    private String descripcion;
    
    @NotBlank(message = "El tipo de encuesta es obligatorio")
    private String tipo;
    
    @NotNull(message = "La fecha de inicio es obligatoria")
    private LocalDate fechaInicio;
    
    @NotNull(message = "La fecha de fin es obligatoria")
    private LocalDate fechaFin;
    
    private Boolean activa = true;
    private Boolean anonima = false;
    private Boolean obligatoria = false;
    
    // Para encuestas específicas de materias
    private Long materiaId;
    
    // Para encuestas dirigidas a roles específicos
    private String rolObjetivo;
    
    private String instrucciones;
    
    // Lista de preguntas
    private List<PreguntaEncuestaDTO> preguntas;
    
    // Campos de solo lectura
    private String materiaNombre;
    private String creadoPor;
    private Boolean estaActiva;
    private Boolean haTerminado;
    private Integer diasRestantes;
    private Integer totalRespuestas;
    
    // Constructors
    public EncuestaDTO() {}
    
    public EncuestaDTO(String titulo, String descripcion, String tipo, 
                      LocalDate fechaInicio, LocalDate fechaFin) {
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.tipo = tipo;
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
    }
    
    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }
    
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    
    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }
    
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
    
    public Long getMateriaId() { return materiaId; }
    public void setMateriaId(Long materiaId) { this.materiaId = materiaId; }
    
    public String getRolObjetivo() { return rolObjetivo; }
    public void setRolObjetivo(String rolObjetivo) { this.rolObjetivo = rolObjetivo; }
    
    public String getInstrucciones() { return instrucciones; }
    public void setInstrucciones(String instrucciones) { this.instrucciones = instrucciones; }
    
    public List<PreguntaEncuestaDTO> getPreguntas() { return preguntas; }
    public void setPreguntas(List<PreguntaEncuestaDTO> preguntas) { this.preguntas = preguntas; }
    
    public String getMateriaNombre() { return materiaNombre; }
    public void setMateriaNombre(String materiaNombre) { this.materiaNombre = materiaNombre; }
    
    public String getCreadoPor() { return creadoPor; }
    public void setCreadoPor(String creadoPor) { this.creadoPor = creadoPor; }
    
    public Boolean getEstaActiva() { return estaActiva; }
    public void setEstaActiva(Boolean estaActiva) { this.estaActiva = estaActiva; }
    
    public Boolean getHaTerminado() { return haTerminado; }
    public void setHaTerminado(Boolean haTerminado) { this.haTerminado = haTerminado; }
    
    public Integer getDiasRestantes() { return diasRestantes; }
    public void setDiasRestantes(Integer diasRestantes) { this.diasRestantes = diasRestantes; }
    
    public Integer getTotalRespuestas() { return totalRespuestas; }
    public void setTotalRespuestas(Integer totalRespuestas) { this.totalRespuestas = totalRespuestas; }
}
