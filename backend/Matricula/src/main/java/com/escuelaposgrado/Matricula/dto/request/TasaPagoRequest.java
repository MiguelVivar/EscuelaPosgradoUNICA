package com.escuelaposgrado.Matricula.dto.request;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * DTO para solicitudes de operaciones de TasaPago
 */
public class TasaPagoRequest {

    @NotBlank(message = "El concepto es obligatorio")
    @Size(max = 100, message = "El concepto no puede superar los 100 caracteres")
    private String concepto;

    @NotBlank(message = "El código es obligatorio")
    @Size(max = 20, message = "El código no puede superar los 20 caracteres")
    private String codigo;

    @NotNull(message = "El monto es obligatorio")
    @DecimalMin(value = "0.01", message = "El monto debe ser mayor a 0")
    private BigDecimal monto;

    @Size(max = 10, message = "La moneda no puede superar los 10 caracteres")
    private String moneda = "PEN";

    @Size(max = 50, message = "El tipo no puede superar los 50 caracteres")
    private String tipo;

    private Boolean obligatorio = false;

    @Size(max = 500, message = "La descripción no puede superar los 500 caracteres")
    private String descripcion;

    private LocalDateTime fechaVigenciaInicio;

    private LocalDateTime fechaVigenciaFin;

    @NotNull(message = "El programa de estudio es obligatorio")
    private Long programaEstudioId;

    // Constructors
    public TasaPagoRequest() {}

    public TasaPagoRequest(String concepto, String codigo, BigDecimal monto, String moneda, 
                          String tipo, Boolean obligatorio, String descripcion, 
                          LocalDateTime fechaVigenciaInicio, LocalDateTime fechaVigenciaFin, 
                          Long programaEstudioId) {
        this.concepto = concepto;
        this.codigo = codigo;
        this.monto = monto;
        this.moneda = moneda;
        this.tipo = tipo;
        this.obligatorio = obligatorio;
        this.descripcion = descripcion;
        this.fechaVigenciaInicio = fechaVigenciaInicio;
        this.fechaVigenciaFin = fechaVigenciaFin;
        this.programaEstudioId = programaEstudioId;
    }

    // Getters and Setters
    public String getConcepto() {
        return concepto;
    }

    public void setConcepto(String concepto) {
        this.concepto = concepto;
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public BigDecimal getMonto() {
        return monto;
    }

    public void setMonto(BigDecimal monto) {
        this.monto = monto;
    }

    public String getMoneda() {
        return moneda;
    }

    public void setMoneda(String moneda) {
        this.moneda = moneda;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public Boolean getObligatorio() {
        return obligatorio;
    }

    public void setObligatorio(Boolean obligatorio) {
        this.obligatorio = obligatorio;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public LocalDateTime getFechaVigenciaInicio() {
        return fechaVigenciaInicio;
    }

    public void setFechaVigenciaInicio(LocalDateTime fechaVigenciaInicio) {
        this.fechaVigenciaInicio = fechaVigenciaInicio;
    }

    public LocalDateTime getFechaVigenciaFin() {
        return fechaVigenciaFin;
    }

    public void setFechaVigenciaFin(LocalDateTime fechaVigenciaFin) {
        this.fechaVigenciaFin = fechaVigenciaFin;
    }

    public Long getProgramaEstudioId() {
        return programaEstudioId;
    }

    public void setProgramaEstudioId(Long programaEstudioId) {
        this.programaEstudioId = programaEstudioId;
    }

    @Override
    public String toString() {
        return "TasaPagoRequest{" +
                "concepto='" + concepto + '\'' +
                ", codigo='" + codigo + '\'' +
                ", monto=" + monto +
                ", moneda='" + moneda + '\'' +
                ", tipo='" + tipo + '\'' +
                ", obligatorio=" + obligatorio +
                ", descripcion='" + descripcion + '\'' +
                ", fechaVigenciaInicio=" + fechaVigenciaInicio +
                ", fechaVigenciaFin=" + fechaVigenciaFin +
                ", programaEstudioId=" + programaEstudioId +
                '}';
    }
}
