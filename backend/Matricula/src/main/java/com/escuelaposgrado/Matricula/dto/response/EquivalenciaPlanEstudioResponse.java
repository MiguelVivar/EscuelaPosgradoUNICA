package com.escuelaposgrado.Matricula.dto.response;

public class EquivalenciaPlanEstudioResponse {
    private Long id;
    private Long planOrigenId;
    private Long planDestinoId;
    private String cursoOrigenCodigo;
    private String cursoDestinoCodigo;
    private String observaciones;

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getPlanOrigenId() { return planOrigenId; }
    public void setPlanOrigenId(Long planOrigenId) { this.planOrigenId = planOrigenId; }
    public Long getPlanDestinoId() { return planDestinoId; }
    public void setPlanDestinoId(Long planDestinoId) { this.planDestinoId = planDestinoId; }
    public String getCursoOrigenCodigo() { return cursoOrigenCodigo; }
    public void setCursoOrigenCodigo(String cursoOrigenCodigo) { this.cursoOrigenCodigo = cursoOrigenCodigo; }
    public String getCursoDestinoCodigo() { return cursoDestinoCodigo; }
    public void setCursoDestinoCodigo(String cursoDestinoCodigo) { this.cursoDestinoCodigo = cursoDestinoCodigo; }
    public String getObservaciones() { return observaciones; }
    public void setObservaciones(String observaciones) { this.observaciones = observaciones; }
}
