package com.escuelaposgrado.Matricula.model.entity;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

/**
 * Entidad que representa la equivalencia entre cursos de dos planes de estudio
 */
@Entity
@Table(name = "equivalencias_plan_estudio")
public class EquivalenciaPlanEstudio implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Plan de estudio origen
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plan_origen_id", nullable = false)
    private ProgramaEstudio planOrigen;

    // Plan de estudio destino
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plan_destino_id", nullable = false)
    private ProgramaEstudio planDestino;

    // Código del curso en el plan origen
    @Column(name = "curso_origen_codigo", nullable = false, length = 50)
    private String cursoOrigenCodigo;

    // Código del curso en el plan destino
    @Column(name = "curso_destino_codigo", nullable = false, length = 50)
    private String cursoDestinoCodigo;

    // Observaciones o detalles de la equivalencia
    @Column(length = 500)
    private String observaciones;

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public ProgramaEstudio getPlanOrigen() { return planOrigen; }
    public void setPlanOrigen(ProgramaEstudio planOrigen) { this.planOrigen = planOrigen; }

    public ProgramaEstudio getPlanDestino() { return planDestino; }
    public void setPlanDestino(ProgramaEstudio planDestino) { this.planDestino = planDestino; }

    public String getCursoOrigenCodigo() { return cursoOrigenCodigo; }
    public void setCursoOrigenCodigo(String cursoOrigenCodigo) { this.cursoOrigenCodigo = cursoOrigenCodigo; }

    public String getCursoDestinoCodigo() { return cursoDestinoCodigo; }
    public void setCursoDestinoCodigo(String cursoDestinoCodigo) { this.cursoDestinoCodigo = cursoDestinoCodigo; }

    public String getObservaciones() { return observaciones; }
    public void setObservaciones(String observaciones) { this.observaciones = observaciones; }
}
