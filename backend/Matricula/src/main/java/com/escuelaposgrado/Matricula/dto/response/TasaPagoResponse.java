package com.escuelaposgrado.Matricula.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.escuelaposgrado.Matricula.dto.response.nested.ProgramaEstudioBasicResponse;

/**
 * DTO para respuestas de operaciones de TasaPago
 */
public class TasaPagoResponse {

    private Long id;
    private String concepto;
    private String codigo;
    private BigDecimal monto;
    private String moneda;
    private String tipo;
    private Boolean activo;
    private Boolean obligatorio;
    private String descripcion;
    private LocalDateTime fechaVigenciaInicio;
    private LocalDateTime fechaVigenciaFin;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaActualizacion;
    private ProgramaEstudioBasicResponse programaEstudio;

    // Constructors
    public TasaPagoResponse() {}

    public TasaPagoResponse(Long id, String concepto, String codigo, BigDecimal monto, String moneda, 
                           String tipo, Boolean activo, Boolean obligatorio, String descripcion) {
        this.id = id;
        this.concepto = concepto;
        this.codigo = codigo;
        this.monto = monto;
        this.moneda = moneda;
        this.tipo = tipo;
        this.activo = activo;
        this.obligatorio = obligatorio;
        this.descripcion = descripcion;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public Boolean getActivo() {
        return activo;
    }

    public void setActivo(Boolean activo) {
        this.activo = activo;
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

    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

    public LocalDateTime getFechaActualizacion() {
        return fechaActualizacion;
    }

    public void setFechaActualizacion(LocalDateTime fechaActualizacion) {
        this.fechaActualizacion = fechaActualizacion;
    }

    public ProgramaEstudioBasicResponse getProgramaEstudio() {
        return programaEstudio;
    }

    public void setProgramaEstudio(ProgramaEstudioBasicResponse programaEstudio) {
        this.programaEstudio = programaEstudio;
    }

    @Override
    public String toString() {
        return "TasaPagoResponse{" +
                "id=" + id +
                ", concepto='" + concepto + '\'' +
                ", codigo='" + codigo + '\'' +
                ", monto=" + monto +
                ", moneda='" + moneda + '\'' +
                ", tipo='" + tipo + '\'' +
                ", activo=" + activo +
                ", obligatorio=" + obligatorio +
                ", descripcion='" + descripcion + '\'' +
                ", fechaVigenciaInicio=" + fechaVigenciaInicio +
                ", fechaVigenciaFin=" + fechaVigenciaFin +
                ", fechaCreacion=" + fechaCreacion +
                ", fechaActualizacion=" + fechaActualizacion +
                ", programaEstudio=" + programaEstudio +
                '}';
    }
}
