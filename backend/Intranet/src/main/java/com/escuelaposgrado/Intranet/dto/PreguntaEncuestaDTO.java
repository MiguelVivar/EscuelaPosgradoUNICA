package com.escuelaposgrado.Intranet.dto;

import jakarta.validation.constraints.*;

/**
 * DTO para las preguntas de encuestas
 */
public class PreguntaEncuestaDTO {
    
    private Long id;
    
    @NotBlank(message = "El texto de la pregunta es obligatorio")
    @Size(max = 500, message = "El texto no puede exceder 500 caracteres")
    private String texto;
    
    @NotBlank(message = "El tipo de pregunta es obligatorio")
    private String tipo;
    
    @NotNull(message = "El orden es obligatorio")
    private Integer orden;
    
    private Boolean obligatoria = true;
    
    // Para preguntas de opción múltiple (JSON)
    private String opcionesJson;
    
    // Para validaciones específicas
    private Integer valorMinimo;
    private Integer valorMaximo;
    
    @Size(max = 200, message = "La ayuda no puede exceder 200 caracteres")
    private String ayuda;
    
    @NotNull(message = "El ID de la encuesta es obligatorio")
    private Long encuestaId;
    
    // Constructors
    public PreguntaEncuestaDTO() {}
    
    public PreguntaEncuestaDTO(String texto, String tipo, Integer orden, Long encuestaId) {
        this.texto = texto;
        this.tipo = tipo;
        this.orden = orden;
        this.encuestaId = encuestaId;
    }
    
    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getTexto() { return texto; }
    public void setTexto(String texto) { this.texto = texto; }
    
    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }
    
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
    
    public Long getEncuestaId() { return encuestaId; }
    public void setEncuestaId(Long encuestaId) { this.encuestaId = encuestaId; }
    
    /**
     * Método simplificado para opciones
     */
    public String getOpciones() {
        return opcionesJson;
    }
    
    public void setOpciones(String opciones) {
        this.opcionesJson = opciones;
    }
}
