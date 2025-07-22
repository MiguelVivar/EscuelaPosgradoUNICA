package com.escuelaposgrado.Intranet.repository;

import com.escuelaposgrado.Intranet.model.Materia;
import com.escuelaposgrado.Intranet.model.Usuario;
import com.escuelaposgrado.Intranet.model.Ciclo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repositorio para la entidad Materia
 */
@Repository
public interface MateriaRepository extends JpaRepository<Materia, Long> {
    
    // Búsquedas básicas
    Optional<Materia> findByCodigo(String codigo);
    List<Materia> findByNombreContainingIgnoreCase(String nombre);
    
    // Verificar existencias
    boolean existsByCodigo(String codigo);
    
    // Búsquedas por estado
    List<Materia> findByActivaTrue();
    List<Materia> findByActivaFalse();
    
    // Búsquedas por ciclo
    List<Materia> findByCiclo(Ciclo ciclo);
    List<Materia> findByCicloAndActivaTrue(Ciclo ciclo);
    
    // Búsquedas por docente
    List<Materia> findByDocente(Usuario docente);
    List<Materia> findByDocenteAndActivaTrue(Usuario docente);
    
    // Materias por docente específico
    @Query("SELECT m FROM Materia m WHERE m.docente.id = :docenteId AND m.activa = true ORDER BY m.ciclo, m.nombre")
    List<Materia> findMateriasPorDocente(@Param("docenteId") Long docenteId);
    
    // Materias sin docente asignado
    @Query("SELECT m FROM Materia m WHERE m.docente IS NULL AND m.activa = true ORDER BY m.ciclo, m.nombre")
    List<Materia> findMateriasSinDocente();
    
    // Búsqueda de materias por texto
    @Query("SELECT m FROM Materia m WHERE " +
           "(LOWER(m.codigo) LIKE LOWER(CONCAT('%', :texto, '%')) OR " +
           "LOWER(m.nombre) LIKE LOWER(CONCAT('%', :texto, '%')) OR " +
           "LOWER(m.descripcion) LIKE LOWER(CONCAT('%', :texto, '%'))) " +
           "AND m.activa = true " +
           "ORDER BY m.ciclo, m.nombre")
    List<Materia> buscarMaterias(@Param("texto") String texto);
    
    // Materias ordenadas por ciclo
    @Query("SELECT m FROM Materia m WHERE m.activa = true ORDER BY m.ciclo, m.nombre")
    List<Materia> findMateriasOrdenadas();
    
    // Contar materias por ciclo
    @Query("SELECT COUNT(m) FROM Materia m WHERE m.ciclo = :ciclo AND m.activa = true")
    long countByCicloAndActivaTrue(@Param("ciclo") Ciclo ciclo);
    
    // Contar materias por docente
    @Query("SELECT COUNT(m) FROM Materia m WHERE m.docente.id = :docenteId AND m.activa = true")
    long countByDocenteAndActivaTrue(@Param("docenteId") Long docenteId);
    
    // Materias con más créditos
    @Query("SELECT m FROM Materia m WHERE m.activa = true ORDER BY m.creditos DESC")
    List<Materia> findMateriasPorCreditos();
    
    // Total de horas académicas por ciclo
    @Query("SELECT SUM(m.horasTeoricas + m.horasPracticas) FROM Materia m WHERE m.ciclo = :ciclo AND m.activa = true")
    Integer getTotalHorasPorCiclo(@Param("ciclo") Ciclo ciclo);
}
