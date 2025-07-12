package com.escuelaposgrado.Matricula.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.escuelaposgrado.Matricula.dto.request.TurnoMatriculaRequest;
import com.escuelaposgrado.Matricula.dto.response.TurnoMatriculaResponse;
import com.escuelaposgrado.Matricula.dto.response.nested.PeriodoAcademicoBasicResponse;
import com.escuelaposgrado.Matricula.dto.response.nested.ProgramaEstudioBasicResponse;
import com.escuelaposgrado.Matricula.exception.BadRequestException;
import com.escuelaposgrado.Matricula.exception.ResourceNotFoundException;
import com.escuelaposgrado.Matricula.model.entity.PeriodoAcademico;
import com.escuelaposgrado.Matricula.model.entity.ProgramaEstudio;
import com.escuelaposgrado.Matricula.model.entity.TurnoMatricula;
import com.escuelaposgrado.Matricula.repository.PeriodoAcademicoRepository;
import com.escuelaposgrado.Matricula.repository.ProgramaEstudioRepository;
import com.escuelaposgrado.Matricula.repository.TurnoMatriculaRepository;

/**
 * Servicio para gestionar las operaciones CRUD de Turnos de Matrícula
 */
@Service
@Transactional
public class TurnoMatriculaService {

    @Autowired
    private TurnoMatriculaRepository turnoMatriculaRepository;

    @Autowired
    private PeriodoAcademicoRepository periodoAcademicoRepository;

    @Autowired
    private ProgramaEstudioRepository programaEstudioRepository;

    /**
     * Obtener todos los turnos de matrícula
     */
    @Transactional(readOnly = true)
    public List<TurnoMatriculaResponse> findAll() {
        List<TurnoMatricula> turnos = turnoMatriculaRepository.findAll();
        return turnos.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Obtener todos los turnos activos
     */
    @Transactional(readOnly = true)
    public List<TurnoMatriculaResponse> findAllActive() {
        List<TurnoMatricula> turnos = turnoMatriculaRepository.findByActivoTrueOrderByOrdenTurnoAsc();
        return turnos.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Obtener todos los turnos habilitados
     */
    @Transactional(readOnly = true)
    public List<TurnoMatriculaResponse> findAllEnabled() {
        List<TurnoMatricula> turnos = turnoMatriculaRepository.findByActivoTrueAndHabilitadoTrueOrderByOrdenTurnoAsc();
        return turnos.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Obtener turnos por período académico
     */
    @Transactional(readOnly = true)
    public List<TurnoMatriculaResponse> findByPeriodoAcademico(Long periodoId) {
        List<TurnoMatricula> turnos = turnoMatriculaRepository.findByPeriodoAcademicoIdAndActivoTrueOrderByOrdenTurnoAsc(periodoId);
        return turnos.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Obtener turnos por programa de estudio
     */
    @Transactional(readOnly = true)
    public List<TurnoMatriculaResponse> findByProgramaEstudio(Long programaId) {
        List<TurnoMatricula> turnos = turnoMatriculaRepository.findByProgramaEstudioIdAndActivoTrueOrderByOrdenTurnoAsc(programaId);
        return turnos.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Obtener turnos por período y programa
     */
    @Transactional(readOnly = true)
    public List<TurnoMatriculaResponse> findByPeriodoAndPrograma(Long periodoId, Long programaId) {
        List<TurnoMatricula> turnos = turnoMatriculaRepository.findByPeriodoAcademicoIdAndProgramaEstudioIdAndActivoTrueOrderByOrdenTurnoAsc(periodoId, programaId);
        return turnos.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Obtener turno por ID
     */
    @Transactional(readOnly = true)
    public TurnoMatriculaResponse findById(Long id) {
        TurnoMatricula turno = turnoMatriculaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Turno de matrícula no encontrado con ID: " + id));
        return convertToResponse(turno);
    }

    /**
     * Crear nuevo turno de matrícula
     */
    public TurnoMatriculaResponse create(TurnoMatriculaRequest request) {
        // Validar que el período académico existe y está activo
        PeriodoAcademico periodo = periodoAcademicoRepository.findById(request.getPeriodoAcademicoId())
                .orElseThrow(() -> new ResourceNotFoundException("Período académico no encontrado con ID: " + request.getPeriodoAcademicoId()));
        
        if (!periodo.getActivo()) {
            throw new BadRequestException("No se puede crear el turno en un período académico inactivo");
        }

        // Validar que el programa de estudio existe y está activo
        ProgramaEstudio programa = programaEstudioRepository.findById(request.getProgramaEstudioId())
                .orElseThrow(() -> new ResourceNotFoundException("Programa de estudio no encontrado con ID: " + request.getProgramaEstudioId()));
        
        if (!programa.getActivo()) {
            throw new BadRequestException("No se puede crear el turno para un programa de estudio inactivo");
        }

        // Validar que no existe otro turno con el mismo código
        if (turnoMatriculaRepository.findByCodigo(request.getCodigo()).isPresent()) {
            throw new BadRequestException("Ya existe un turno con el código: " + request.getCodigo());
        }

        // Validar que no existe otro turno con el mismo nombre
        if (turnoMatriculaRepository.findByNombre(request.getNombre()).isPresent()) {
            throw new BadRequestException("Ya existe un turno con el nombre: " + request.getNombre());
        }

        // Validar fechas
        if (request.getFechaInicio().isAfter(request.getFechaFin())) {
            throw new BadRequestException("La fecha de inicio debe ser anterior a la fecha de fin");
        }

        TurnoMatricula turno = new TurnoMatricula();
        turno.setNombre(request.getNombre());
        turno.setCodigo(request.getCodigo());
        turno.setFechaInicio(request.getFechaInicio());
        turno.setFechaFin(request.getFechaFin());
        turno.setOrdenTurno(request.getOrdenTurno());
        turno.setHabilitado(request.getHabilitado() != null ? request.getHabilitado() : false);
        turno.setDescripcion(request.getDescripcion());
        turno.setRequisitos(request.getRequisitos());
        turno.setPeriodoAcademico(periodo);
        turno.setProgramaEstudio(programa);
        turno.setActivo(true);

        TurnoMatricula savedTurno = turnoMatriculaRepository.save(turno);
        return convertToResponse(savedTurno);
    }

    /**
     * Actualizar turno existente
     */
    public TurnoMatriculaResponse update(Long id, TurnoMatriculaRequest request) {
        TurnoMatricula turno = turnoMatriculaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Turno de matrícula no encontrado con ID: " + id));

        // Validar que el período académico existe y está activo
        PeriodoAcademico periodo = periodoAcademicoRepository.findById(request.getPeriodoAcademicoId())
                .orElseThrow(() -> new ResourceNotFoundException("Período académico no encontrado con ID: " + request.getPeriodoAcademicoId()));
        
        if (!periodo.getActivo()) {
            throw new BadRequestException("No se puede asignar el turno a un período académico inactivo");
        }

        // Validar que el programa de estudio existe y está activo
        ProgramaEstudio programa = programaEstudioRepository.findById(request.getProgramaEstudioId())
                .orElseThrow(() -> new ResourceNotFoundException("Programa de estudio no encontrado con ID: " + request.getProgramaEstudioId()));
        
        if (!programa.getActivo()) {
            throw new BadRequestException("No se puede asignar el turno a un programa de estudio inactivo");
        }

        // Validar que no existe otro turno con el mismo código (excluyendo el actual)
        Optional<TurnoMatricula> turnoExistentePorCodigo = turnoMatriculaRepository.findByCodigo(request.getCodigo());
        if (turnoExistentePorCodigo.isPresent() && !turnoExistentePorCodigo.get().getId().equals(id)) {
            throw new BadRequestException("Ya existe un turno con el código: " + request.getCodigo());
        }

        // Validar que no existe otro turno con el mismo nombre (excluyendo el actual)
        Optional<TurnoMatricula> turnoExistentePorNombre = turnoMatriculaRepository.findByNombre(request.getNombre());
        if (turnoExistentePorNombre.isPresent() && !turnoExistentePorNombre.get().getId().equals(id)) {
            throw new BadRequestException("Ya existe un turno con el nombre: " + request.getNombre());
        }

        // Validar fechas
        if (request.getFechaInicio().isAfter(request.getFechaFin())) {
            throw new BadRequestException("La fecha de inicio debe ser anterior a la fecha de fin");
        }

        turno.setNombre(request.getNombre());
        turno.setCodigo(request.getCodigo());
        turno.setFechaInicio(request.getFechaInicio());
        turno.setFechaFin(request.getFechaFin());
        turno.setOrdenTurno(request.getOrdenTurno());
        turno.setHabilitado(request.getHabilitado() != null ? request.getHabilitado() : turno.getHabilitado());
        turno.setDescripcion(request.getDescripcion());
        turno.setRequisitos(request.getRequisitos());
        turno.setPeriodoAcademico(periodo);
        turno.setProgramaEstudio(programa);

        TurnoMatricula updatedTurno = turnoMatriculaRepository.save(turno);
        return convertToResponse(updatedTurno);
    }

    /**
     * Activar/desactivar turno
     */
    public TurnoMatriculaResponse toggleActive(Long id) {
        TurnoMatricula turno = turnoMatriculaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Turno de matrícula no encontrado con ID: " + id));

        turno.setActivo(!turno.getActivo());
        TurnoMatricula updatedTurno = turnoMatriculaRepository.save(turno);
        return convertToResponse(updatedTurno);
    }

    /**
     * Habilitar/deshabilitar turno para matrícula
     */
    public TurnoMatriculaResponse toggleEnabled(Long id) {
        TurnoMatricula turno = turnoMatriculaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Turno de matrícula no encontrado con ID: " + id));

        turno.setHabilitado(!turno.getHabilitado());
        TurnoMatricula updatedTurno = turnoMatriculaRepository.save(turno);
        return convertToResponse(updatedTurno);
    }

    /**
     * Eliminar turno (borrado lógico)
     */
    public void delete(Long id) {
        TurnoMatricula turno = turnoMatriculaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Turno de matrícula no encontrado con ID: " + id));

        turno.setActivo(false);
        turnoMatriculaRepository.save(turno);
    }

    /**
     * Buscar turnos por nombre
     */
    @Transactional(readOnly = true)
    public List<TurnoMatriculaResponse> findByNombreContaining(String nombre) {
        // Como no existe el método exacto en el repositorio, usar findAll y filtrar
        List<TurnoMatricula> todosTurnos = turnoMatriculaRepository.findAll();
        List<TurnoMatricula> turnos = todosTurnos.stream()
                .filter(turno -> turno.getNombre().toLowerCase().contains(nombre.toLowerCase()) && turno.getActivo())
                .collect(Collectors.toList());
        return turnos.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Convertir entidad a DTO de respuesta
     */
    private TurnoMatriculaResponse convertToResponse(TurnoMatricula turno) {
        TurnoMatriculaResponse response = new TurnoMatriculaResponse();
        response.setId(turno.getId());
        response.setNombre(turno.getNombre());
        response.setCodigo(turno.getCodigo());
        response.setFechaInicio(turno.getFechaInicio());
        response.setFechaFin(turno.getFechaFin());
        response.setOrdenTurno(turno.getOrdenTurno());
        response.setActivo(turno.getActivo());
        response.setHabilitado(turno.getHabilitado());
        response.setDescripcion(turno.getDescripcion());
        response.setRequisitos(turno.getRequisitos());
        response.setFechaCreacion(turno.getFechaCreacion());
        response.setFechaActualizacion(turno.getFechaActualizacion());

        // Convertir información del período académico
        if (turno.getPeriodoAcademico() != null) {
            PeriodoAcademicoBasicResponse periodoBasic = new PeriodoAcademicoBasicResponse();
            periodoBasic.setId(turno.getPeriodoAcademico().getId());
            periodoBasic.setNombre(turno.getPeriodoAcademico().getNombre());
            periodoBasic.setCodigo(turno.getPeriodoAcademico().getCodigo());
            response.setPeriodoAcademico(periodoBasic);
        }

        // Convertir información del programa de estudio
        if (turno.getProgramaEstudio() != null) {
            ProgramaEstudioBasicResponse programaBasic = new ProgramaEstudioBasicResponse();
            programaBasic.setId(turno.getProgramaEstudio().getId());
            programaBasic.setNombre(turno.getProgramaEstudio().getNombre());
            programaBasic.setCodigo(turno.getProgramaEstudio().getCodigo());
            response.setProgramaEstudio(programaBasic);
        }

        return response;
    }
}
