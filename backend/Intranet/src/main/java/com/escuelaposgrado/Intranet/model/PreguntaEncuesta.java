package com.escuelaposgrado.Intranet.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Entidad para las preguntas de encuestas
 */
@Entity
@Table(name = "preguntas_encuesta")
public class PreguntaEncuesta {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "El texto de la pregunta es obligatorio")
    @Size(max = 500, message = "El texto no puede exceder 500 caracteres")
    @Column(nullable = false, columnDefinition = "TEXT")
    private String texto;
    
    @NotNull(message = "El tipo de pregunta es obligatorio")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoPregunta tipo;
    
    @NotNull(message = "El orden es obligatorio")
    @Column(nullable = false)
    private Integer orden;
    
    @Column(nullable = false)
    private Boolean obligatoria = true;
    
    // Para preguntas de opción múltiple
    @Column(name = "opciones_json", columnDefinition = "TEXT")
    private String opcionesJson; // JSON con las opciones disponibles
    
    // Para validaciones específicas
    @Column(name = "valor_minimo")
    private Integer valorMinimo;
    
    @Column(name = "valor_maximo")
    private Integer valorMaximo;
    
    @Size(max = 200, message = "La ayuda no puede exceder 200 caracteres")
    private String ayuda; // Texto de ayuda para la pregunta
    
    // Relaciones
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "encuesta_id", nullable = false)
    @NotNull(message = "La encuesta es obligatoria")
    private Encuesta encuesta;
    
    @OneToMany(mappedBy = "pregunta", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<RespuestaEncuesta> respuestas;
    
    @Column(name = "fecha_creacion", nullable = false, updatable = false)
    private LocalDateTime fechaCreacion;
    
    @Column(name = "fecha_actualizacion")
    private LocalDateTime fechaActualizacion;
    
    // Constructors
    public PreguntaEncuesta() {}
    
    public PreguntaEncuesta(String texto, TipoPregunta tipo, Integer orden, Encuesta encuesta) {
        this.texto = texto;
        this.tipo = tipo;
        this.orden = orden;
        this.encuesta = encuesta;
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
    public boolean esOpcionMultiple() {
        return tipo == TipoPregunta.OPCION_MULTIPLE || tipo == TipoPregunta.SELECCION_MULTIPLE;
    }
    
    public boolean esCalificacion() {
        return tipo == TipoPregunta.ESCALA_NUMERICA || tipo == TipoPregunta.ESCALA_LIKERT;
    }
    
    public boolean esTextoLibre() {
        return tipo == TipoPregunta.TEXTO_CORTO || tipo == TipoPregunta.TEXTO_LARGO;
    }
    
    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getTexto() { return texto; }
    public void setTexto(String texto) { this.texto = texto; }
    
    public TipoPregunta getTipo() { return tipo; }
    public void setTipo(TipoPregunta tipo) { this.tipo = tipo; }
    
    public Integer getOrden() { return orden; }
    public void setOrden(Integer orden) { this.orden = orden; }
    
    public Boolean getObligatoria() { return obligatoria; }
    public void setObligatoria(Boolean obligatoria) { this.obligatoria = obligatoria; }
    
    public String getOpcionesJson() { return opcionesJson; }
    public void setOpcionesJson(String opcionesJson) { this.opcionesJson = opcionesJson; }
    
    public Integer getValorMinimo() { return valorMinimo; }
    public void setValorMinimo(Integer valorMinimo) { this.valorMinimo = valorMinimo; }
    
    public Integer getValorMaximo() { return valorMaximo; }
    public void setValorMaximo(Integer valorMaximo) { this.valorMaximo = valorMaximo; }
    
    public String getAyuda() { return ayuda; }
    public void setAyuda(String ayuda) { this.ayuda = ayuda; }
    
    public Encuesta getEncuesta() { return encuesta; }
    public void setEncuesta(Encuesta encuesta) { this.encuesta = encuesta; }
    
    public List<RespuestaEncuesta> getRespuestas() { return respuestas; }
    public void setRespuestas(List<RespuestaEncuesta> respuestas) { this.respuestas = respuestas; }
    
    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }
    
    public LocalDateTime getFechaActualizacion() { return fechaActualizacion; }
    public void setFechaActualizacion(LocalDateTime fechaActualizacion) { this.fechaActualizacion = fechaActualizacion; }
    
    /**
     * Método simplificado para obtener opciones como String
     */
    public String getOpciones() {
        return opcionesJson;
    }
    
    /**
     * Método simplificado para establecer opciones
     */
    public void setOpciones(String opciones) {
        this.opcionesJson = opciones;
    }
}
