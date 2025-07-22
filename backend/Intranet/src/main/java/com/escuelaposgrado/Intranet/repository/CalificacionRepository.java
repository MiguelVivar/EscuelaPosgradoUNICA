package com.escuelaposgrado.Intranet.repository;

import com.escuelaposgrado.Intranet.model.Calificacion;
import com.escuelaposgrado.Intranet.model.Usuario;
import com.escuelaposgrado.Intranet.model.Materia;
import com.escuelaposgrado.Intranet.model.TipoEvaluacion;
import com.escuelaposgrado.Intranet.model.Ciclo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * Repositorio para la entidad Calificacion
 */
@Repository
public interface CalificacionRepository extends JpaRepository<Calificacion, Long> {
    
    // Búsquedas básicas
    List<Calificacion> findByEstudiante(Usuario estudiante);
    List<Calificacion> findByMateria(Materia materia);
    List<Calificacion> findByTipoEvaluacion(TipoEvaluacion tipoEvaluacion);
    
    // Búsqueda específica por estudiante y materia
    List<Calificacion> findByEstudianteAndMateria(Usuario estudiante, Materia materia);
    
    // Calificaciones ordenadas por fecha
    @Query("SELECT c FROM Calificacion c WHERE c.estudiante = :estudiante AND c.materia = :materia ORDER BY c.fechaEvaluacion ASC")
    List<Calificacion> findByEstudianteAndMateriaOrderByFecha(@Param("estudiante") Usuario estudiante, @Param("materia") Materia materia);
    
    // Calificaciones publicadas
    List<Calificacion> findByPublicadaTrue();
    List<Calificacion> findByEstudianteAndPublicadaTrue(Usuario estudiante);
    List<Calificacion> findByMateriaAndPublicadaTrue(Materia materia);
    
    // Calificaciones por rango de fechas
    @Query("SELECT c FROM Calificacion c WHERE c.fechaEvaluacion BETWEEN :fechaInicio AND :fechaFin ORDER BY c.fechaEvaluacion DESC")
    List<Calificacion> findByFechaEvaluacionBetween(@Param("fechaInicio") LocalDate fechaInicio, @Param("fechaFin") LocalDate fechaFin);
    
    // Calificaciones por rango de notas
    @Query("SELECT c FROM Calificacion c WHERE c.nota BETWEEN :notaMinima AND :notaMaxima ORDER BY c.nota DESC")
    List<Calificacion> findByNotaBetween(@Param("notaMinima") BigDecimal notaMinima, @Param("notaMaxima") BigDecimal notaMaxima);
    
    // Calificaciones aprobatorias y desaprobatorias
    @Query("SELECT c FROM Calificacion c WHERE c.nota >= 11.0 ORDER BY c.nota DESC")
    List<Calificacion> findCalificacionesAprobatorias();
    
    @Query("SELECT c FROM Calificacion c WHERE c.nota < 11.0 ORDER BY c.nota ASC")
    List<Calificacion> findCalificacionesDesaprobatorias();
    
    // Promedio de un estudiante en una materia
    @Query("SELECT AVG(c.nota) FROM Calificacion c WHERE c.estudiante = :estudiante AND c.materia = :materia AND c.publicada = true")
    BigDecimal getPromedioEstudianteMateria(@Param("estudiante") Usuario estudiante, @Param("materia") Materia materia);
    
    // Promedio ponderado de un estudiante en una materia
    @Query("SELECT SUM(c.nota * c.peso / 100) FROM Calificacion c WHERE c.estudiante = :estudiante AND c.materia = :materia AND c.publicada = true")
    BigDecimal getPromedioPonderadoEstudianteMateria(@Param("estudiante") Usuario estudiante, @Param("materia") Materia materia);
    
    // Promedio general de una materia
    @Query("SELECT AVG(c.nota) FROM Calificacion c WHERE c.materia = :materia AND c.publicada = true")
    BigDecimal getPromedioGeneralMateria(@Param("materia") Materia materia);
    
    // Mejor y peor calificación de una materia
    @Query("SELECT MAX(c.nota) FROM Calificacion c WHERE c.materia = :materia AND c.publicada = true")
    BigDecimal getMejorNotaMateria(@Param("materia") Materia materia);
    
    @Query("SELECT MIN(c.nota) FROM Calificacion c WHERE c.materia = :materia AND c.publicada = true")
    BigDecimal getPeorNotaMateria(@Param("materia") Materia materia);
    
    // Estudiantes con notas sobresalientes (≥ 18)
    @Query("SELECT DISTINCT c.estudiante FROM Calificacion c WHERE c.nota >= 18.0 AND c.publicada = true")
    List<Usuario> findEstudiantesSobresalientes();
    
    // Estudiantes en riesgo académico (promedio < 11)
    @Query("SELECT c.estudiante FROM Calificacion c WHERE c.publicada = true GROUP BY c.estudiante HAVING AVG(c.nota) < 11.0")
    List<Usuario> findEstudiantesEnRiesgo();
    
    // Conteo de evaluaciones por tipo
    @Query("SELECT COUNT(c) FROM Calificacion c WHERE c.tipoEvaluacion = :tipo AND c.materia = :materia")
    long countByTipoEvaluacionAndMateria(@Param("tipo") TipoEvaluacion tipo, @Param("materia") Materia materia);
    
    // Calificaciones que fueron corregidas
    @Query("SELECT c FROM Calificacion c WHERE c.notaAnterior IS NOT NULL ORDER BY c.fechaCorreccion DESC")
    List<Calificacion> findCalificacionesCorregidas();
    
    // Calificaciones pendientes de publicar
    @Query("SELECT c FROM Calificacion c WHERE c.publicada = false ORDER BY c.fechaEvaluacion DESC")
    List<Calificacion> findCalificacionesPendientes();
    
    // Reporte de notas por materia
    @Query("SELECT c FROM Calificacion c WHERE c.materia = :materia AND c.publicada = true ORDER BY c.estudiante.apellidos, c.tipoEvaluacion")
    List<Calificacion> findReporteNotasPorMateria(@Param("materia") Materia materia);
    
    // Historial académico de un estudiante
    @Query("SELECT c FROM Calificacion c WHERE c.estudiante = :estudiante AND c.publicada = true ORDER BY c.fechaEvaluacion DESC")
    List<Calificacion> findHistorialAcademico(@Param("estudiante") Usuario estudiante);
    
    // Verificar si un estudiante tiene todas las evaluaciones de una materia
    @Query("SELECT COUNT(DISTINCT c.tipoEvaluacion) FROM Calificacion c WHERE c.estudiante = :estudiante AND c.materia = :materia AND c.publicada = true")
    long countTiposEvaluacionCompletados(@Param("estudiante") Usuario estudiante, @Param("materia") Materia materia);
    
    // Métodos adicionales para CalificacionService
    boolean existsByEstudianteAndMateriaAndTipoEvaluacionAndFechaEvaluacion(
        Usuario estudiante, Materia materia, TipoEvaluacion tipoEvaluacion, LocalDate fechaEvaluacion);
    
    List<Calificacion> findByCicloAndAnio(Ciclo ciclo, Integer anio);
    
    @Query("SELECT AVG(c.nota) FROM Calificacion c WHERE c.estudiante = :estudiante AND c.materia = :materia")
    BigDecimal calcularPromedioEstudianteMateria(@Param("estudiante") Usuario estudiante, @Param("materia") Materia materia);
    
    @Query("SELECT AVG(c.nota) FROM Calificacion c WHERE c.materia = :materia")
    BigDecimal calcularPromedioMateria(@Param("materia") Materia materia);
    
    @Query("SELECT MAX(c.nota) FROM Calificacion c WHERE c.materia = :materia")
    BigDecimal obtenerNotaMaximaMateria(@Param("materia") Materia materia);
    
    @Query("SELECT MIN(c.nota) FROM Calificacion c WHERE c.materia = :materia")
    BigDecimal obtenerNotaMinimaMateria(@Param("materia") Materia materia);
    
    @Query("SELECT COUNT(c) FROM Calificacion c WHERE c.materia = :materia")
    Long countCalificacionesMateria(@Param("materia") Materia materia);
}
