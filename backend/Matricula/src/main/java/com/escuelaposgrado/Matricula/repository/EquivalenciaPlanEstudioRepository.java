package com.escuelaposgrado.Matricula.repository;

import com.escuelaposgrado.Matricula.model.entity.EquivalenciaPlanEstudio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EquivalenciaPlanEstudioRepository extends JpaRepository<EquivalenciaPlanEstudio, Long> {
    List<EquivalenciaPlanEstudio> findByPlanOrigenIdAndPlanDestinoId(Long planOrigenId, Long planDestinoId);
}
