package com.escuelaposgrado.Intranet.repository;

import com.escuelaposgrado.Intranet.model.Encuesta;
import com.escuelaposgrado.Intranet.model.Materia;
import com.escuelaposgrado.Intranet.model.Role;
import com.escuelaposgrado.Intranet.model.TipoEncuesta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

/**
 * Repositorio para la entidad Encuesta
 */
@Repository
public interface EncuestaRepository extends JpaRepository<Encuesta, Long> {
    
    // Búsquedas básicas
    List<Encuesta> findByTipo(TipoEncuesta tipo);
    List<Encuesta> findByMateria(Materia materia);
    List<Encuesta> findByRolObjetivo(Role rolObjetivo);
    
    // Encuestas activas
    List<Encuesta> findByActivaTrue();
    List<Encuesta> findByActivaFalse();
    
    // Encuestas por estado temporal
    @Query("SELECT e FROM Encuesta e WHERE e.activa = true AND CURRENT_DATE BETWEEN e.fechaInicio AND e.fechaFin ORDER BY e.fechaFin ASC")
    List<Encuesta> findEncuestasActivas();
    
    @Query("SELECT e FROM Encuesta e WHERE e.activa = true AND CURRENT_DATE < e.fechaInicio ORDER BY e.fechaInicio ASC")
    List<Encuesta> findEncuestasProgramadas();
    
    @Query("SELECT e FROM Encuesta e WHERE CURRENT_DATE > e.fechaFin ORDER BY e.fechaFin DESC")
    List<Encuesta> findEncuestasFinalizadas();
    
    // Encuestas por rango de fechas
    @Query("SELECT e FROM Encuesta e WHERE e.fechaInicio BETWEEN :fechaInicio AND :fechaFin ORDER BY e.fechaInicio ASC")
    List<Encuesta> findByFechaInicioBetween(@Param("fechaInicio") LocalDate fechaInicio, @Param("fechaFin") LocalDate fechaFin);
    
    // Encuestas disponibles para un rol específico
    @Query("SELECT e FROM Encuesta e WHERE e.activa = true AND CURRENT_DATE BETWEEN e.fechaInicio AND e.fechaFin " +
           "AND (e.rolObjetivo = :rol OR e.rolObjetivo IS NULL) ORDER BY e.fechaFin ASC")
    List<Encuesta> findEncuestasDisponiblesPorRol(@Param("rol") Role rol);
    
    // Encuestas de evaluación docente activas
    @Query("SELECT e FROM Encuesta e WHERE e.tipo = 'EVALUACION_DOCENTE' AND e.activa = true " +
           "AND CURRENT_DATE BETWEEN e.fechaInicio AND e.fechaFin ORDER BY e.fechaFin ASC")
    List<Encuesta> findEvaluacionesDocenteActivas();
    
    // Encuestas por materia específica y activas
    @Query("SELECT e FROM Encuesta e WHERE e.materia = :materia AND e.activa = true " +
           "AND CURRENT_DATE BETWEEN e.fechaInicio AND e.fechaFin ORDER BY e.fechaFin ASC")
    List<Encuesta> findEncuestasActivasPorMateria(@Param("materia") Materia materia);
    
    // Búsqueda de encuestas por texto
    @Query("SELECT e FROM Encuesta e WHERE " +
           "(LOWER(e.titulo) LIKE LOWER(CONCAT('%', :texto, '%')) OR " +
           "LOWER(e.descripcion) LIKE LOWER(CONCAT('%', :texto, '%'))) " +
           "AND e.activa = true ORDER BY e.fechaCreacion DESC")
    List<Encuesta> buscarEncuestas(@Param("texto") String texto);
    
    // Encuestas obligatorias activas
    @Query("SELECT e FROM Encuesta e WHERE e.obligatoria = true AND e.activa = true " +
           "AND CURRENT_DATE BETWEEN e.fechaInicio AND e.fechaFin ORDER BY e.fechaFin ASC")
    List<Encuesta> findEncuestasObligatoriasActivas();
    
    // Encuestas anónimas
    List<Encuesta> findByAnonimaTrue();
    
    // Contar encuestas por tipo
    @Query("SELECT COUNT(e) FROM Encuesta e WHERE e.tipo = :tipo AND e.activa = true")
    long countByTipoAndActivaTrue(@Param("tipo") TipoEncuesta tipo);
    
    // Encuestas creadas por un usuario específico
    @Query("SELECT e FROM Encuesta e WHERE e.creadoPor = :usuario ORDER BY e.fechaCreacion DESC")
    List<Encuesta> findEncuestasPorCreador(@Param("usuario") String usuario);
    
    // Encuestas próximas a vencer
    @Query("SELECT e FROM Encuesta e WHERE e.activa = true AND e.fechaFin BETWEEN CURRENT_DATE AND :fechaLimite ORDER BY e.fechaFin ASC")
    List<Encuesta> findEncuestasProximasAVencer(@Param("fechaLimite") LocalDate fechaLimite);
    
    // Estadísticas de encuestas
    @Query("SELECT COUNT(e) FROM Encuesta e WHERE e.activa = true AND CURRENT_DATE BETWEEN e.fechaInicio AND e.fechaFin")
    long countEncuestasActivas();
    
    @Query("SELECT COUNT(e) FROM Encuesta e WHERE CURRENT_DATE > e.fechaFin")
    long countEncuestasFinalizadas();
}
