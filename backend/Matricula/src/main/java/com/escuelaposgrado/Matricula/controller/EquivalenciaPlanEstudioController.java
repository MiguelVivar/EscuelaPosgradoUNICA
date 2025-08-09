package com.escuelaposgrado.Matricula.controller;

import com.escuelaposgrado.Matricula.dto.request.EquivalenciaPlanEstudioRequest;
import com.escuelaposgrado.Matricula.dto.response.EquivalenciaPlanEstudioResponse;
import com.escuelaposgrado.Matricula.service.EquivalenciaPlanEstudioService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/matricula/equivalencias")
@Tag(name = "Equivalencias de Planes de Estudio", description = "API para gestionar equivalencias entre planes de estudio")
public class EquivalenciaPlanEstudioController {
    @Autowired
    private EquivalenciaPlanEstudioService equivalenciaService;

    @PostMapping
    public ResponseEntity<EquivalenciaPlanEstudioResponse> crearEquivalencia(@Validated @RequestBody EquivalenciaPlanEstudioRequest request) {
        return ResponseEntity.ok(equivalenciaService.crearEquivalencia(request));
    }

    @GetMapping
    public ResponseEntity<List<EquivalenciaPlanEstudioResponse>> listarEquivalencias(@RequestParam Long planOrigenId, @RequestParam Long planDestinoId) {
        return ResponseEntity.ok(equivalenciaService.listarEquivalencias(planOrigenId, planDestinoId));
    }
}
