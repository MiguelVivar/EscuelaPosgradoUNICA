package com.escuelaposgrado.Matricula.model.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.DecimalMin;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Entidad que representa las tasas de pago asociadas a los programas de estudio
 */
@Entity
@Table(name = "tasas_pago")
public class TasaPago {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    @NotBlank(message = "El concepto es obligatorio")
    @Size(max = 100, message = "El concepto no puede exceder 100 caracteres")
    private String concepto;

    @Column(nullable = false, length = 20)
    @NotBlank(message = "El código es obligatorio")
    @Size(max = 20, message = "El código no puede exceder 20 caracteres")
    private String codigo;

    @Column(nullable = false, precision = 10, scale = 2)
    @NotNull(message = "El monto es obligatorio")
    @DecimalMin(value = "0.0", inclusive = false, message = "El monto debe ser mayor a 0")
    private BigDecimal monto;

    @Column(length = 10)
    private String moneda = "PEN"; // Moneda por defecto

    @Column(length = 50)
    private String tipo; // MATRICULA, PENSION, DERECHO_GRADO, etc.

    @Column(nullable = false)
    private Boolean activo = true;

    @Column(nullable = false)
    private Boolean obligatorio = false;

    @Column(length = 500)
    private String descripcion;

    @Column(name = "fecha_vigencia_inicio")
    private LocalDateTime fechaVigenciaInicio;

    @Column(name = "fecha_vigencia_fin")
    private LocalDateTime fechaVigenciaFin;

    @Column(name = "fecha_creacion", nullable = false, updatable = false)
    private LocalDateTime fechaCreacion;

    @Column(name = "fecha_actualizacion")
    private LocalDateTime fechaActualizacion;

    // Relación con programa de estudio
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "programa_estudio_id", nullable = false)
    @NotNull(message = "El programa de estudio es obligatorio")
    private ProgramaEstudio programaEstudio;

    @PrePersist
    protected void onCreate() {
        fechaCreacion = LocalDateTime.now();
        fechaActualizacion = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        fechaActualizacion = LocalDateTime.now();
    }

    // Constructores
    public TasaPago() {}

    public TasaPago(String concepto, String codigo, BigDecimal monto, String tipo, ProgramaEstudio programaEstudio) {
        this.concepto = concepto;
        this.codigo = codigo;
        this.monto = monto;
        this.tipo = tipo;
        this.programaEstudio = programaEstudio;
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getConcepto() { return concepto; }
    public void setConcepto(String concepto) { this.concepto = concepto; }

    public String getCodigo() { return codigo; }
    public void setCodigo(String codigo) { this.codigo = codigo; }

    public BigDecimal getMonto() { return monto; }
    public void setMonto(BigDecimal monto) { this.monto = monto; }

    public String getMoneda() { return moneda; }
    public void setMoneda(String moneda) { this.moneda = moneda; }

    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }

    public Boolean getActivo() { return activo; }
    public void setActivo(Boolean activo) { this.activo = activo; }

    public Boolean getObligatorio() { return obligatorio; }
    public void setObligatorio(Boolean obligatorio) { this.obligatorio = obligatorio; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public LocalDateTime getFechaVigenciaInicio() { return fechaVigenciaInicio; }
    public void setFechaVigenciaInicio(LocalDateTime fechaVigenciaInicio) { this.fechaVigenciaInicio = fechaVigenciaInicio; }

    public LocalDateTime getFechaVigenciaFin() { return fechaVigenciaFin; }
    public void setFechaVigenciaFin(LocalDateTime fechaVigenciaFin) { this.fechaVigenciaFin = fechaVigenciaFin; }

    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }

    public LocalDateTime getFechaActualizacion() { return fechaActualizacion; }
    public void setFechaActualizacion(LocalDateTime fechaActualizacion) { this.fechaActualizacion = fechaActualizacion; }

    public ProgramaEstudio getProgramaEstudio() { return programaEstudio; }
    public void setProgramaEstudio(ProgramaEstudio programaEstudio) { this.programaEstudio = programaEstudio; }
}
