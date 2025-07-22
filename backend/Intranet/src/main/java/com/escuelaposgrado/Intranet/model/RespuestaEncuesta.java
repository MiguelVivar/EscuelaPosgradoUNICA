package com.escuelaposgrado.Intranet.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

/**
 * Entidad para las respuestas de encuestas
 */
@Entity
@Table(name = "respuestas_encuesta")
public class RespuestaEncuesta {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "valor_texto", columnDefinition = "TEXT")
    private String valorTexto; // Para respuestas de texto
    
    @Column(name = "valor_numerico")
    private Integer valorNumerico; // Para respuestas numéricas
    
    @Column(name = "valor_multiple", columnDefinition = "TEXT")
    private String valorMultiple; // JSON para selecciones múltiples
    
    @Column(name = "valor_booleano")
    private Boolean valorBooleano; // Para respuestas Sí/No
    
    // Relaciones
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "encuesta_id", nullable = false)
    @NotNull(message = "La encuesta es obligatoria")
    private Encuesta encuesta;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pregunta_id", nullable = false)
    @NotNull(message = "La pregunta es obligatoria")
    private PreguntaEncuesta pregunta;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id")
    private Usuario usuario; // Null para encuestas anónimas
    
    @Column(name = "session_id")
    private String sessionId; // Para encuestas anónimas
    
    @Column(name = "fecha_respuesta", nullable = false, updatable = false)
    private LocalDateTime fechaRespuesta;
    
    @Column(name = "ip_address")
    private String ipAddress;
    
    // Constructors
    public RespuestaEncuesta() {}
    
    public RespuestaEncuesta(Encuesta encuesta, PreguntaEncuesta pregunta, Usuario usuario) {
        this.encuesta = encuesta;
        this.pregunta = pregunta;
        this.usuario = usuario;
    }
    
    // Métodos del ciclo de vida de JPA
    @PrePersist
    protected void onCreate() {
        fechaRespuesta = LocalDateTime.now();
    }
    
    // Métodos utilitarios
    public boolean esAnonima() {
        return usuario == null;
    }
    
    public String getValorComoTexto() {
        if (valorTexto != null) return valorTexto;
        if (valorNumerico != null) return valorNumerico.toString();
        if (valorBooleano != null) return valorBooleano ? "Sí" : "No";
        if (valorMultiple != null) return valorMultiple;
        return "";
    }
    
    public boolean tieneValor() {
        return valorTexto != null || valorNumerico != null || 
               valorBooleano != null || valorMultiple != null;
    }
    
    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getValorTexto() { return valorTexto; }
    public void setValorTexto(String valorTexto) { this.valorTexto = valorTexto; }
    
    public Integer getValorNumerico() { return valorNumerico; }
    public void setValorNumerico(Integer valorNumerico) { this.valorNumerico = valorNumerico; }
    
    public String getValorMultiple() { return valorMultiple; }
    public void setValorMultiple(String valorMultiple) { this.valorMultiple = valorMultiple; }
    
    public Boolean getValorBooleano() { return valorBooleano; }
    public void setValorBooleano(Boolean valorBooleano) { this.valorBooleano = valorBooleano; }
    
    public Encuesta getEncuesta() { return encuesta; }
    public void setEncuesta(Encuesta encuesta) { this.encuesta = encuesta; }
    
    public PreguntaEncuesta getPregunta() { return pregunta; }
    public void setPregunta(PreguntaEncuesta pregunta) { this.pregunta = pregunta; }
    
    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }
    
    public String getSessionId() { return sessionId; }
    public void setSessionId(String sessionId) { this.sessionId = sessionId; }
    
    public LocalDateTime getFechaRespuesta() { return fechaRespuesta; }
    public void setFechaRespuesta(LocalDateTime fechaRespuesta) { this.fechaRespuesta = fechaRespuesta; }
    
    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }
    
    /**
     * Método unificado para obtener respuesta como String
     */
    public String getRespuesta() {
        if (valorTexto != null) return valorTexto;
        if (valorNumerico != null) return valorNumerico.toString();
        if (valorBooleano != null) return valorBooleano.toString();
        if (valorMultiple != null) return valorMultiple;
        return "";
    }
    
    /**
     * Método unificado para establecer respuesta desde String
     */
    public void setRespuesta(String respuesta) {
        // Se establece como texto por defecto, los controladores pueden especificar el tipo
        this.valorTexto = respuesta;
    }
}
