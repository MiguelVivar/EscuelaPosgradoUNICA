package com.escuelaposgrado.Matricula.service;

import com.escuelaposgrado.Matricula.dto.request.EquivalenciaPlanEstudioRequest;
import com.escuelaposgrado.Matricula.dto.response.EquivalenciaPlanEstudioResponse;
import com.escuelaposgrado.Matricula.model.entity.EquivalenciaPlanEstudio;
import com.escuelaposgrado.Matricula.model.entity.ProgramaEstudio;
import com.escuelaposgrado.Matricula.repository.EquivalenciaPlanEstudioRepository;
import com.escuelaposgrado.Matricula.repository.ProgramaEstudioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EquivalenciaPlanEstudioService {
    @Autowired
    private EquivalenciaPlanEstudioRepository equivalenciaRepo;
    @Autowired
    private ProgramaEstudioRepository programaRepo;

    @Transactional
    public EquivalenciaPlanEstudioResponse crearEquivalencia(EquivalenciaPlanEstudioRequest request) {
        ProgramaEstudio planOrigen = programaRepo.findById(request.getPlanOrigenId())
                .orElseThrow(() -> new RuntimeException("Plan de estudio origen no encontrado"));
        ProgramaEstudio planDestino = programaRepo.findById(request.getPlanDestinoId())
                .orElseThrow(() -> new RuntimeException("Plan de estudio destino no encontrado"));
        EquivalenciaPlanEstudio equivalencia = new EquivalenciaPlanEstudio();
        equivalencia.setPlanOrigen(planOrigen);
        equivalencia.setPlanDestino(planDestino);
        equivalencia.setCursoOrigenCodigo(request.getCursoOrigenCodigo());
        equivalencia.setCursoDestinoCodigo(request.getCursoDestinoCodigo());
        equivalencia.setObservaciones(request.getObservaciones());
        equivalencia = equivalenciaRepo.save(equivalencia);
        return toResponse(equivalencia);
    }

    public List<EquivalenciaPlanEstudioResponse> listarEquivalencias(Long planOrigenId, Long planDestinoId) {
        List<EquivalenciaPlanEstudio> equivalencias = equivalenciaRepo.findByPlanOrigenIdAndPlanDestinoId(planOrigenId, planDestinoId);
        return equivalencias.stream().map(this::toResponse).collect(Collectors.toList());
    }

    private EquivalenciaPlanEstudioResponse toResponse(EquivalenciaPlanEstudio entity) {
        EquivalenciaPlanEstudioResponse resp = new EquivalenciaPlanEstudioResponse();
        resp.setId(entity.getId());
        resp.setPlanOrigenId(entity.getPlanOrigen().getId());
        resp.setPlanDestinoId(entity.getPlanDestino().getId());
        resp.setCursoOrigenCodigo(entity.getCursoOrigenCodigo());
        resp.setCursoDestinoCodigo(entity.getCursoDestinoCodigo());
        resp.setObservaciones(entity.getObservaciones());
        return resp;
    }
}
