package com.escuelaposgrado.Matricula.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.escuelaposgrado.Matricula.model.entity.Aula;
import com.escuelaposgrado.Matricula.model.entity.Sede;

/**
 * Repositorio para la entidad Aula
 */
@Repository
public interface AulaRepository extends JpaRepository<Aula, Long> {

    /**
     * Buscar por nombre
     */
    Optional<Aula> findByNombre(String nombre);

    /**
     * Buscar por código
     */
    Optional<Aula> findByCodigo(String codigo);

    /**
     * Buscar aulas activas
     */
    List<Aula> findByActivoTrueOrderByNombreAsc();

    /**
     * Buscar aulas por sede
     */
    List<Aula> findBySedeAndActivoTrueOrderByNombreAsc(Sede sede);

    /**
     * Buscar aulas por sede ID
     */
    List<Aula> findBySedeIdAndActivoTrueOrderByNombreAsc(Long sedeId);

    /**
     * Buscar aulas disponibles
     */
    List<Aula> findByActivoTrueAndDisponibleTrueOrderByNombreAsc();

    /**
     * Buscar aulas disponibles por sede
     */
    List<Aula> findBySedeIdAndActivoTrueAndDisponibleTrueOrderByNombreAsc(Long sedeId);

    /**
     * Buscar por tipo de aula
     */
    List<Aula> findByTipoIgnoreCaseAndActivoTrueOrderByNombreAsc(String tipo);

    /**
     * Buscar aulas con capacidad mínima
     */
    List<Aula> findByCapacidadGreaterThanEqualAndActivoTrueOrderByCapacidadAsc(Integer capacidadMinima);

    /**
     * Obtener tipos de aula únicos
     */
    @Query("SELECT DISTINCT a.tipo FROM Aula a WHERE a.activo = true AND a.tipo IS NOT NULL ORDER BY a.tipo")
    List<String> findDistinctTipos();
}
