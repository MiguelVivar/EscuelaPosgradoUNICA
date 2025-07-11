package com.escuelaposgrado.Matricula.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.escuelaposgrado.Matricula.model.entity.PeriodoAcademico;
import com.escuelaposgrado.Matricula.model.entity.ProgramaEstudio;
import com.escuelaposgrado.Matricula.model.entity.TurnoMatricula;

/**
 * Repositorio para la entidad TurnoMatricula
 */
@Repository
public interface TurnoMatriculaRepository extends JpaRepository<TurnoMatricula, Long> {

    /**
     * Buscar por nombre
     */
    Optional<TurnoMatricula> findByNombre(String nombre);

    /**
     * Buscar por código
     */
    Optional<TurnoMatricula> findByCodigo(String codigo);

    /**
     * Buscar turnos activos
     */
    List<TurnoMatricula> findByActivoTrueOrderByOrdenTurnoAsc();

    /**
     * Buscar turnos habilitados
     */
    List<TurnoMatricula> findByActivoTrueAndHabilitadoTrueOrderByOrdenTurnoAsc();

    /**
     * Buscar por período académico
     */
    List<TurnoMatricula> findByPeriodoAcademicoAndActivoTrueOrderByOrdenTurnoAsc(PeriodoAcademico periodoAcademico);

    /**
     * Buscar por período académico ID
     */
    List<TurnoMatricula> findByPeriodoAcademicoIdAndActivoTrueOrderByOrdenTurnoAsc(Long periodoAcademicoId);

    /**
     * Buscar por programa de estudio
     */
    List<TurnoMatricula> findByProgramaEstudioAndActivoTrueOrderByOrdenTurnoAsc(ProgramaEstudio programaEstudio);

    /**
     * Buscar por programa de estudio ID
     */
    List<TurnoMatricula> findByProgramaEstudioIdAndActivoTrueOrderByOrdenTurnoAsc(Long programaEstudioId);

    /**
     * Buscar turnos habilitados por programa
     */
    List<TurnoMatricula> findByProgramaEstudioIdAndActivoTrueAndHabilitadoTrueOrderByOrdenTurnoAsc(Long programaEstudioId);

    /**
     * Buscar por período y programa
     */
    List<TurnoMatricula> findByPeriodoAcademicoIdAndProgramaEstudioIdAndActivoTrueOrderByOrdenTurnoAsc(Long periodoId, Long programaId);

    /**
     * Verificar si existe turno con el mismo orden en el período
     */
    @Query("SELECT COUNT(t) > 0 FROM TurnoMatricula t WHERE t.periodoAcademico.id = :periodoId AND t.ordenTurno = :orden AND t.id != :turnoId AND t.activo = true")
    boolean existeTurnoConMismoOrden(Long periodoId, Integer orden, Long turnoId);
}
