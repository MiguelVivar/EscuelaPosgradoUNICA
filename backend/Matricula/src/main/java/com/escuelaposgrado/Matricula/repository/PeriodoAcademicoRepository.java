package com.escuelaposgrado.Matricula.repository;

import com.escuelaposgrado.Matricula.model.entity.PeriodoAcademico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

/**
 * Repositorio para la entidad PeriodoAcademico
 */
@Repository
public interface PeriodoAcademicoRepository extends JpaRepository<PeriodoAcademico, Long> {

    /**
     * Buscar por nombre
     */
    Optional<PeriodoAcademico> findByNombre(String nombre);

    /**
     * Buscar períodos activos
     */
    List<PeriodoAcademico> findByActivoTrueOrderByFechaCreacionDesc();

    /**
     * Buscar períodos habilitados
     */
    List<PeriodoAcademico> findByHabilitadoTrueOrderByFechaCreacionDesc();

    /**
     * Buscar por año y semestre
     */
    Optional<PeriodoAcademico> findByAnioAndSemestre(String anio, String semestre);

    /**
     * Buscar períodos activos y habilitados
     */
    List<PeriodoAcademico> findByActivoTrueAndHabilitadoTrueOrderByFechaCreacionDesc();

    /**
     * Verificar si existe un período activo
     */
    @Query("SELECT COUNT(p) > 0 FROM PeriodoAcademico p WHERE p.activo = true AND p.habilitado = true")
    boolean existePeriodoActivoHabilitado();

    /**
     * Obtener el período académico actual (activo y habilitado)
     */
    @Query("SELECT p FROM PeriodoAcademico p WHERE p.activo = true AND p.habilitado = true ORDER BY p.fechaCreacion DESC")
    Optional<PeriodoAcademico> findPeriodoActual();
}
