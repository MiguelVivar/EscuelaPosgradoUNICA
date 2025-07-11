package com.escuelaposgrado.Matricula.service;

import com.escuelaposgrado.Matricula.model.entity.PeriodoAcademico;
import com.escuelaposgrado.Matricula.dto.request.PeriodoAcademicoRequest;
import com.escuelaposgrado.Matricula.dto.response.PeriodoAcademicoResponse;
import com.escuelaposgrado.Matricula.repository.PeriodoAcademicoRepository;
import com.escuelaposgrado.Matricula.exception.ResourceNotFoundException;
import com.escuelaposgrado.Matricula.exception.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Servicio para la gestión de Períodos Académicos
 */
@Service
@Transactional
public class PeriodoAcademicoService {

    @Autowired
    private PeriodoAcademicoRepository periodoAcademicoRepository;

    /**
     * Obtener todos los períodos académicos
     */
    @Transactional(readOnly = true)
    public List<PeriodoAcademicoResponse> findAll() {
        return periodoAcademicoRepository.findByActivoTrueOrderByFechaCreacionDesc()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Obtener período académico por ID
     */
    @Transactional(readOnly = true)
    public PeriodoAcademicoResponse findById(Long id) {
        PeriodoAcademico periodo = periodoAcademicoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Período académico no encontrado con ID: " + id));
        return convertToResponse(periodo);
    }

    /**
     * Crear nuevo período académico
     */
    public PeriodoAcademicoResponse create(PeriodoAcademicoRequest request) {
        // Validar que no exista otro período con el mismo nombre
        if (periodoAcademicoRepository.findByNombre(request.getNombre()).isPresent()) {
            throw new BadRequestException("Ya existe un período académico con el nombre: " + request.getNombre());
        }

        // Validar que no exista otro período para el mismo año y semestre
        if (periodoAcademicoRepository.findByAnioAndSemestre(request.getAnio(), request.getSemestre()).isPresent()) {
            throw new BadRequestException("Ya existe un período académico para " + request.getAnio() + " - " + request.getSemestre());
        }

        // Validar fechas
        if (request.getFechaInicio().isAfter(request.getFechaFin())) {
            throw new BadRequestException("La fecha de inicio no puede ser posterior a la fecha de fin");
        }

        if (request.getFechaInicioMatricula().isAfter(request.getFechaFinMatricula())) {
            throw new BadRequestException("La fecha de inicio de matrícula no puede ser posterior a la fecha de fin de matrícula");
        }

        PeriodoAcademico periodo = new PeriodoAcademico();
        periodo.setNombre(request.getNombre());
        periodo.setAnio(request.getAnio());
        periodo.setSemestre(request.getSemestre());
        periodo.setFechaInicio(request.getFechaInicio());
        periodo.setFechaFin(request.getFechaFin());
        periodo.setFechaInicioMatricula(request.getFechaInicioMatricula());
        periodo.setFechaFinMatricula(request.getFechaFinMatricula());
        periodo.setHabilitado(request.getHabilitado());
        periodo.setDescripcion(request.getDescripcion());

        PeriodoAcademico savedPeriodo = periodoAcademicoRepository.save(periodo);
        return convertToResponse(savedPeriodo);
    }

    /**
     * Actualizar período académico
     */
    public PeriodoAcademicoResponse update(Long id, PeriodoAcademicoRequest request) {
        PeriodoAcademico periodo = periodoAcademicoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Período académico no encontrado con ID: " + id));

        // Validar que no exista otro período con el mismo nombre (excepto el actual)
        periodoAcademicoRepository.findByNombre(request.getNombre())
                .ifPresent(existingPeriodo -> {
                    if (!existingPeriodo.getId().equals(id)) {
                        throw new BadRequestException("Ya existe un período académico con el nombre: " + request.getNombre());
                    }
                });

        // Validar fechas
        if (request.getFechaInicio().isAfter(request.getFechaFin())) {
            throw new BadRequestException("La fecha de inicio no puede ser posterior a la fecha de fin");
        }

        if (request.getFechaInicioMatricula().isAfter(request.getFechaFinMatricula())) {
            throw new BadRequestException("La fecha de inicio de matrícula no puede ser posterior a la fecha de fin de matrícula");
        }

        periodo.setNombre(request.getNombre());
        periodo.setAnio(request.getAnio());
        periodo.setSemestre(request.getSemestre());
        periodo.setFechaInicio(request.getFechaInicio());
        periodo.setFechaFin(request.getFechaFin());
        periodo.setFechaInicioMatricula(request.getFechaInicioMatricula());
        periodo.setFechaFinMatricula(request.getFechaFinMatricula());
        periodo.setHabilitado(request.getHabilitado());
        periodo.setDescripcion(request.getDescripcion());

        PeriodoAcademico updatedPeriodo = periodoAcademicoRepository.save(periodo);
        return convertToResponse(updatedPeriodo);
    }

    /**
     * Eliminar período académico (eliminación lógica)
     */
    public void delete(Long id) {
        PeriodoAcademico periodo = periodoAcademicoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Período académico no encontrado con ID: " + id));

        periodo.setActivo(false);
        periodoAcademicoRepository.save(periodo);
    }

    /**
     * Habilitar/deshabilitar período para matrícula
     */
    public PeriodoAcademicoResponse toggleHabilitado(Long id) {
        PeriodoAcademico periodo = periodoAcademicoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Período académico no encontrado con ID: " + id));

        periodo.setHabilitado(!periodo.getHabilitado());
        PeriodoAcademico updatedPeriodo = periodoAcademicoRepository.save(periodo);
        return convertToResponse(updatedPeriodo);
    }

    /**
     * Obtener períodos habilitados
     */
    @Transactional(readOnly = true)
    public List<PeriodoAcademicoResponse> findHabilitados() {
        return periodoAcademicoRepository.findByHabilitadoTrueOrderByFechaCreacionDesc()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Convertir entidad a DTO de respuesta
     */
    private PeriodoAcademicoResponse convertToResponse(PeriodoAcademico periodo) {
        return new PeriodoAcademicoResponse(
                periodo.getId(),
                periodo.getNombre(),
                periodo.getAnio(),
                periodo.getSemestre(),
                periodo.getFechaInicio(),
                periodo.getFechaFin(),
                periodo.getFechaInicioMatricula(),
                periodo.getFechaFinMatricula(),
                periodo.getActivo(),
                periodo.getHabilitado(),
                periodo.getDescripcion(),
                periodo.getFechaCreacion(),
                periodo.getFechaActualizacion()
        );
    }
}
