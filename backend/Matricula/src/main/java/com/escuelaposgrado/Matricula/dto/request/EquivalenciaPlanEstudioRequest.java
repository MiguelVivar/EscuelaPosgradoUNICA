package com.escuelaposgrado.Matricula.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;

public class EquivalenciaPlanEstudioRequest {
    @NotNull
    private Long planOrigenId;
    @NotNull
    private Long planDestinoId;
    @NotBlank
    private String cursoOrigenCodigo;
    @NotBlank
    private String cursoDestinoCodigo;
    private String observaciones;

    // Getters y Setters
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
