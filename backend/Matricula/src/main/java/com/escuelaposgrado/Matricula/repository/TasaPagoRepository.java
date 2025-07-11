package com.escuelaposgrado.Matricula.repository;

import com.escuelaposgrado.Matricula.model.entity.TasaPago;
import com.escuelaposgrado.Matricula.model.entity.ProgramaEstudio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

/**
 * Repositorio para la entidad TasaPago
 */
@Repository
public interface TasaPagoRepository extends JpaRepository<TasaPago, Long> {

    /**
     * Buscar por concepto
     */
    List<TasaPago> findByConceptoIgnoreCaseContainingAndActivoTrueOrderByConceptoAsc(String concepto);

    /**
     * Buscar por código
     */
    Optional<TasaPago> findByCodigo(String codigo);

    /**
     * Buscar tasas activas
     */
    List<TasaPago> findByActivoTrueOrderByConceptoAsc();

    /**
     * Buscar por programa de estudio
     */
    List<TasaPago> findByProgramaEstudioAndActivoTrueOrderByConceptoAsc(ProgramaEstudio programaEstudio);

    /**
     * Buscar por programa de estudio ID
     */
    List<TasaPago> findByProgramaEstudioIdAndActivoTrueOrderByConceptoAsc(Long programaEstudioId);

    /**
     * Buscar por tipo
     */
    List<TasaPago> findByTipoIgnoreCaseAndActivoTrueOrderByConceptoAsc(String tipo);

    /**
     * Buscar tasas obligatorias
     */
    List<TasaPago> findByObligatorioTrueAndActivoTrueOrderByConceptoAsc();

    /**
     * Buscar tasas obligatorias por programa
     */
    List<TasaPago> findByProgramaEstudioIdAndObligatorioTrueAndActivoTrueOrderByConceptoAsc(Long programaEstudioId);

    /**
     * Obtener tipos únicos
     */
    @Query("SELECT DISTINCT t.tipo FROM TasaPago t WHERE t.activo = true AND t.tipo IS NOT NULL ORDER BY t.tipo")
    List<String> findDistinctTipos();
}
