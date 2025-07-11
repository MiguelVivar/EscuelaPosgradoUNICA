package com.escuelaposgrado.Matricula.repository;

import com.escuelaposgrado.Matricula.model.entity.ComisionUnidadPosgrado;
import com.escuelaposgrado.Matricula.model.entity.Facultad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

/**
 * Repositorio para la entidad ComisionUnidadPosgrado
 */
@Repository
public interface ComisionUnidadPosgradoRepository extends JpaRepository<ComisionUnidadPosgrado, Long> {

    /**
     * Buscar por nombre
     */
    Optional<ComisionUnidadPosgrado> findByNombre(String nombre);

    /**
     * Buscar por código
     */
    Optional<ComisionUnidadPosgrado> findByCodigo(String codigo);

    /**
     * Buscar comisiones activas
     */
    List<ComisionUnidadPosgrado> findByActivoTrueOrderByNombreAsc();

    /**
     * Buscar por facultad
     */
    List<ComisionUnidadPosgrado> findByFacultadAndActivoTrueOrderByNombreAsc(Facultad facultad);

    /**
     * Buscar por facultad ID
     */
    List<ComisionUnidadPosgrado> findByFacultadIdAndActivoTrueOrderByNombreAsc(Long facultadId);

    /**
     * Buscar por tipo
     */
    List<ComisionUnidadPosgrado> findByTipoIgnoreCaseAndActivoTrueOrderByNombreAsc(String tipo);

    /**
     * Buscar por presidente
     */
    List<ComisionUnidadPosgrado> findByPresidenteIgnoreCaseContainingAndActivoTrueOrderByNombreAsc(String presidente);
}
