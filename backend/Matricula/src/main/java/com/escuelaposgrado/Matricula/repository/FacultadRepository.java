package com.escuelaposgrado.Matricula.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.escuelaposgrado.Matricula.model.entity.Facultad;

/**
 * Repositorio para la entidad Facultad
 */
@Repository
public interface FacultadRepository extends JpaRepository<Facultad, Long> {

    /**
     * Buscar por nombre
     */
    Optional<Facultad> findByNombre(String nombre);

    /**
     * Buscar por código
     */
    Optional<Facultad> findByCodigo(String codigo);

    /**
     * Buscar facultades activas
     */
    List<Facultad> findByActivoTrueOrderByNombreAsc();

    /**
     * Buscar por decano
     */
    List<Facultad> findByDecanoIgnoreCaseContainingAndActivoTrueOrderByNombreAsc(String decano);

    /**
     * Contar programas de estudio por facultad
     */
    @Query("SELECT COUNT(p) FROM ProgramaEstudio p WHERE p.facultad.id = :facultadId AND p.activo = true")
    long countProgramasEstudioByFacultad(Long facultadId);

    /**
     * Facultades con programas activos
     */
    @Query("SELECT DISTINCT f FROM Facultad f JOIN f.programasEstudio p WHERE f.activo = true AND p.activo = true ORDER BY f.nombre")
    List<Facultad> findFacultadesConProgramasActivos();
}
