package com.escuelaposgrado.Intranet.repository;

import com.escuelaposgrado.Intranet.model.RespuestaEncuesta;
import com.escuelaposgrado.Intranet.model.Encuesta;
import com.escuelaposgrado.Intranet.model.Usuario;
import com.escuelaposgrado.Intranet.model.PreguntaEncuesta;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repositorio para las respuestas de encuestas
 */
@Repository
public interface RespuestaEncuestaRepository extends JpaRepository<RespuestaEncuesta, Long> {
    
    // Buscar respuestas por encuesta
    List<RespuestaEncuesta> findByEncuesta(Encuesta encuesta);
    
    // Buscar respuestas por usuario
    List<RespuestaEncuesta> findByUsuario(Usuario usuario);
    
    // Buscar respuestas por pregunta
    List<RespuestaEncuesta> findByPregunta(PreguntaEncuesta pregunta);
    
    // Verificar si un usuario ya respondió una encuesta
    boolean existsByEncuestaAndUsuario(Encuesta encuesta, Usuario usuario);
    
    // Contar respuestas de una encuesta
    long countByEncuesta(Encuesta encuesta);
    
    // Contar respuestas únicas (usuarios únicos que respondieron)
    @Query("SELECT COUNT(DISTINCT r.usuario) FROM RespuestaEncuesta r WHERE r.encuesta = :encuesta AND r.usuario IS NOT NULL")
    long countUsuariosUnicos(@Param("encuesta") Encuesta encuesta);
    
    // Obtener respuestas por encuesta y usuario
    List<RespuestaEncuesta> findByEncuestaAndUsuario(Encuesta encuesta, Usuario usuario);
    
    // TODO: Revisar esta consulta - comentada temporalmente para permitir inicio de aplicación
    // @Query("SELECT r.respuesta, COUNT(r) FROM RespuestaEncuesta r WHERE r.pregunta = :pregunta GROUP BY r.respuesta ORDER BY COUNT(r) DESC")
    // List<Object[]> getEstadisticasRespuestasPorPregunta(@Param("pregunta") PreguntaEncuesta pregunta);
}
