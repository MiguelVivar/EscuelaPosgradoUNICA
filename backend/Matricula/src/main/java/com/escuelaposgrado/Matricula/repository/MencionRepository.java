package com.escuelaposgrado.Matricula.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.escuelaposgrado.Matricula.model.entity.Mencion;
import com.escuelaposgrado.Matricula.model.entity.ProgramaEstudio;

/**
 * Repositorio para la entidad Mencion
 */
@Repository
public interface MencionRepository extends JpaRepository<Mencion, Long> {

    /**
     * Buscar por nombre
     */
    Optional<Mencion> findByNombre(String nombre);

    /**
     * Buscar por código
     */
    Optional<Mencion> findByCodigo(String codigo);

    /**
     * Buscar menciones activas
     */
    List<Mencion> findByActivoTrueOrderByNombreAsc();

    /**
     * Buscar menciones disponibles
     */
    List<Mencion> findByActivoTrueAndDisponibleTrueOrderByNombreAsc();

    /**
     * Buscar por programa de estudio
     */
    List<Mencion> findByProgramaEstudioAndActivoTrueOrderByNombreAsc(ProgramaEstudio programaEstudio);

    /**
     * Buscar por programa de estudio ID
     */
    List<Mencion> findByProgramaEstudioIdAndActivoTrueOrderByNombreAsc(Long programaEstudioId);

    /**
     * Buscar menciones disponibles por programa
     */
    List<Mencion> findByProgramaEstudioIdAndActivoTrueAndDisponibleTrueOrderByNombreAsc(Long programaEstudioId);
}
