package com.escuelaposgrado.Intranet.repository;

import com.escuelaposgrado.Intranet.model.Asistencia;
import com.escuelaposgrado.Intranet.model.Usuario;
import com.escuelaposgrado.Intranet.model.Materia;
import com.escuelaposgrado.Intranet.model.EstadoAsistencia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Repositorio para la entidad Asistencia
 */
@Repository
public interface AsistenciaRepository extends JpaRepository<Asistencia, Long> {
    
    // Búsquedas básicas
    List<Asistencia> findByEstudiante(Usuario estudiante);
    List<Asistencia> findByMateria(Materia materia);
    List<Asistencia> findByFecha(LocalDate fecha);
    List<Asistencia> findByEstado(EstadoAsistencia estado);
    
    // Búsqueda específica por estudiante y materia
    List<Asistencia> findByEstudianteAndMateria(Usuario estudiante, Materia materia);
    
    // Verificar si existe asistencia para una fecha específica
    Optional<Asistencia> findByEstudianteAndMateriaAndFecha(Usuario estudiante, Materia materia, LocalDate fecha);
    boolean existsByEstudianteAndMateriaAndFecha(Usuario estudiante, Materia materia, LocalDate fecha);
    
    // Asistencias por rango de fechas
    @Query("SELECT a FROM Asistencia a WHERE a.fecha BETWEEN :fechaInicio AND :fechaFin ORDER BY a.fecha DESC")
    List<Asistencia> findByFechaBetween(@Param("fechaInicio") LocalDate fechaInicio, @Param("fechaFin") LocalDate fechaFin);
    
    // Asistencias de un estudiante en un rango de fechas
    @Query("SELECT a FROM Asistencia a WHERE a.estudiante = :estudiante AND a.fecha BETWEEN :fechaInicio AND :fechaFin ORDER BY a.fecha DESC")
    List<Asistencia> findByEstudianteAndFechaBetween(@Param("estudiante") Usuario estudiante, 
                                                     @Param("fechaInicio") LocalDate fechaInicio, 
                                                     @Param("fechaFin") LocalDate fechaFin);
    
    // Asistencias de una materia en un rango de fechas
    @Query("SELECT a FROM Asistencia a WHERE a.materia = :materia AND a.fecha BETWEEN :fechaInicio AND :fechaFin ORDER BY a.fecha DESC")
    List<Asistencia> findByMateriaAndFechaBetween(@Param("materia") Materia materia, 
                                                  @Param("fechaInicio") LocalDate fechaInicio, 
                                                  @Param("fechaFin") LocalDate fechaFin);
    
    // Estadísticas de asistencia por estudiante
    @Query("SELECT COUNT(a) FROM Asistencia a WHERE a.estudiante = :estudiante AND a.estado = :estado")
    long countByEstudianteAndEstado(@Param("estudiante") Usuario estudiante, @Param("estado") EstadoAsistencia estado);
    
    // Estadísticas de asistencia por materia
    @Query("SELECT COUNT(a) FROM Asistencia a WHERE a.materia = :materia AND a.estado = :estado")
    long countByMateriaAndEstado(@Param("materia") Materia materia, @Param("estado") EstadoAsistencia estado);
    
    // Porcentaje de asistencia de un estudiante en una materia
    @Query("SELECT COUNT(a) FROM Asistencia a WHERE a.estudiante = :estudiante AND a.materia = :materia")
    long countTotalAsistencias(@Param("estudiante") Usuario estudiante, @Param("materia") Materia materia);
    
    @Query("SELECT COUNT(a) FROM Asistencia a WHERE a.estudiante = :estudiante AND a.materia = :materia AND a.estado = 'PRESENTE'")
    long countAsistenciasPresente(@Param("estudiante") Usuario estudiante, @Param("materia") Materia materia);
    
    // Faltas consecutivas
    @Query("SELECT a FROM Asistencia a WHERE a.estudiante = :estudiante AND a.materia = :materia AND a.estado = 'AUSENTE' ORDER BY a.fecha DESC")
    List<Asistencia> findFaltasPorEstudianteYMateria(@Param("estudiante") Usuario estudiante, @Param("materia") Materia materia);
    
    // Asistencias del día
    @Query("SELECT a FROM Asistencia a WHERE a.fecha = :fecha ORDER BY a.materia.nombre, a.estudiante.apellidos")
    List<Asistencia> findAsistenciasDelDia(@Param("fecha") LocalDate fecha);
    
    // Estudiantes con asistencia perfecta en una materia
    @Query("SELECT DISTINCT a.estudiante FROM Asistencia a WHERE a.materia = :materia AND a.estudiante NOT IN " +
           "(SELECT a2.estudiante FROM Asistencia a2 WHERE a2.materia = :materia AND a2.estado = 'AUSENTE')")
    List<Usuario> findEstudiantesConAsistenciaPerfecta(@Param("materia") Materia materia);
    
    // Reporte de asistencia por materia y fecha
    @Query("SELECT a FROM Asistencia a WHERE a.materia = :materia AND a.fecha = :fecha ORDER BY a.estudiante.apellidos, a.estudiante.nombres")
    List<Asistencia> findReporteAsistenciaPorMateriaYFecha(@Param("materia") Materia materia, @Param("fecha") LocalDate fecha);
    
    // Total de horas académicas asistidas por estudiante
    @Query("SELECT SUM(a.horasAcademicas) FROM Asistencia a WHERE a.estudiante = :estudiante AND a.estado = 'PRESENTE'")
    Integer getTotalHorasAsitidasPorEstudiante(@Param("estudiante") Usuario estudiante);
}
