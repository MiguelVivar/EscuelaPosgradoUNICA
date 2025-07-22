package com.escuelaposgrado.Intranet.repository;

import com.escuelaposgrado.Intranet.model.PreguntaEncuesta;
import com.escuelaposgrado.Intranet.model.Encuesta;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repositorio para las preguntas de encuestas
 */
@Repository
public interface PreguntaEncuestaRepository extends JpaRepository<PreguntaEncuesta, Long> {
    
    // Buscar preguntas por encuesta ordenadas por orden
    List<PreguntaEncuesta> findByEncuestaOrderByOrden(Encuesta encuesta);
    
    // Buscar preguntas obligatorias de una encuesta
    @Query("SELECT p FROM PreguntaEncuesta p WHERE p.encuesta = :encuesta AND p.obligatoria = true ORDER BY p.orden")
    List<PreguntaEncuesta> findPreguntasObligatorias(@Param("encuesta") Encuesta encuesta);
    
    // Contar preguntas de una encuesta
    long countByEncuesta(Encuesta encuesta);
    
    // Verificar si existen preguntas sin responder obligatorias
    @Query("SELECT COUNT(p) FROM PreguntaEncuesta p WHERE p.encuesta = :encuesta AND p.obligatoria = true")
    long countPreguntasObligatorias(@Param("encuesta") Encuesta encuesta);
}
