package com.escuelaposgrado.Matricula.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.escuelaposgrado.Matricula.model.entity.Sede;

/**
 * Repositorio para la entidad Sede
 */
@Repository
public interface SedeRepository extends JpaRepository<Sede, Long> {

    /**
     * Buscar por nombre
     */
    Optional<Sede> findByNombre(String nombre);

    /**
     * Buscar por código
     */
    Optional<Sede> findByCodigo(String codigo);

    /**
     * Buscar sedes activas
     */
    List<Sede> findByActivoTrueOrderByNombreAsc();
    
    /**
     * Buscar sedes activas sin ordenar
     */
    List<Sede> findByActivoTrue();

    /**
     * Verificar si existe una sede por nombre (ignorando mayúsculas y minúsculas)
     */
    boolean existsByNombreIgnoreCase(String nombre);

    /**
     * Verificar si existe una sede por código
     */
    boolean existsByCodigo(String codigo);

    /**
     * Buscar por nombre ignorando mayúsculas y minúsculas
     */
    Optional<Sede> findByNombreIgnoreCase(String nombre);

    /**
     * Buscar sedes que contengan un texto en el nombre
     */
    List<Sede> findByNombreContainingIgnoreCase(String nombre);

    /**
     * Buscar por ciudad
     */
    List<Sede> findByCiudadIgnoreCaseOrderByNombreAsc(String ciudad);

    /**
     * Buscar por departamento
     */
    List<Sede> findByDepartamentoIgnoreCaseOrderByNombreAsc(String departamento);

    /**
     * Buscar sedes con aulas disponibles
     */
    @Query("SELECT DISTINCT s FROM Sede s JOIN s.aulas a WHERE s.activo = true AND a.activo = true AND a.disponible = true ORDER BY s.nombre")
    List<Sede> findSedesConAulasDisponibles();

    /**
     * Contar aulas por sede
     */
    @Query("SELECT COUNT(a) FROM Aula a WHERE a.sede.id = :sedeId AND a.activo = true")
    long countAulasBySede(Long sedeId);
}
