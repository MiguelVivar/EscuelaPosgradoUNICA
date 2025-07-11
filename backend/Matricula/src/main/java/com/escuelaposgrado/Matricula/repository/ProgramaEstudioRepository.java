package com.escuelaposgrado.Matricula.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.escuelaposgrado.Matricula.model.entity.Facultad;
import com.escuelaposgrado.Matricula.model.entity.ProgramaEstudio;

/**
 * Repositorio para la entidad ProgramaEstudio
 */
@Repository
public interface ProgramaEstudioRepository extends JpaRepository<ProgramaEstudio, Long> {

    /**
     * Buscar por nombre
     */
    Optional<ProgramaEstudio> findByNombre(String nombre);

    /**
     * Buscar por código
     */
    Optional<ProgramaEstudio> findByCodigo(String codigo);

    /**
     * Buscar programas activos
     */
    List<ProgramaEstudio> findByActivoTrueOrderByNombreAsc();

    /**
     * Buscar programas disponibles para matrícula
     */
    List<ProgramaEstudio> findByActivoTrueAndDisponibleTrueOrderByNombreAsc();

    /**
     * Buscar por facultad
     */
    List<ProgramaEstudio> findByFacultadAndActivoTrueOrderByNombreAsc(Facultad facultad);

    /**
     * Buscar por facultad ID
     */
    List<ProgramaEstudio> findByFacultadIdAndActivoTrueOrderByNombreAsc(Long facultadId);

    /**
     * Buscar por nivel
     */
    List<ProgramaEstudio> findByNivelIgnoreCaseAndActivoTrueOrderByNombreAsc(String nivel);

    /**
     * Buscar por modalidad
     */
    List<ProgramaEstudio> findByModalidadIgnoreCaseAndActivoTrueOrderByNombreAsc(String modalidad);

    /**
     * Obtener niveles únicos
     */
    @Query("SELECT DISTINCT p.nivel FROM ProgramaEstudio p WHERE p.activo = true AND p.nivel IS NOT NULL ORDER BY p.nivel")
    List<String> findDistinctNiveles();

    /**
     * Obtener modalidades únicas
     */
    @Query("SELECT DISTINCT p.modalidad FROM ProgramaEstudio p WHERE p.activo = true AND p.modalidad IS NOT NULL ORDER BY p.modalidad")
    List<String> findDistinctModalidades();

    /**
     * Contar menciones por programa
     */
    @Query("SELECT COUNT(m) FROM Mencion m WHERE m.programaEstudio.id = :programaId AND m.activo = true")
    long countMencionesByPrograma(Long programaId);
}
