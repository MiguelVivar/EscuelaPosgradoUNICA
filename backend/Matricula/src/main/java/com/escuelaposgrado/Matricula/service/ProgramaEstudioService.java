package com.escuelaposgrado.Matricula.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.escuelaposgrado.Matricula.dto.request.ProgramaEstudioRequest;
import com.escuelaposgrado.Matricula.dto.response.ProgramaEstudioResponse;
import com.escuelaposgrado.Matricula.dto.response.nested.FacultadBasicResponse;
import com.escuelaposgrado.Matricula.exception.BadRequestException;
import com.escuelaposgrado.Matricula.exception.ResourceNotFoundException;
import com.escuelaposgrado.Matricula.model.entity.Facultad;
import com.escuelaposgrado.Matricula.model.entity.ProgramaEstudio;
import com.escuelaposgrado.Matricula.repository.FacultadRepository;
import com.escuelaposgrado.Matricula.repository.ProgramaEstudioRepository;

/**
 * Servicio para gestionar las operaciones CRUD de Programas de Estudio
 */
@Service
@Transactional
public class ProgramaEstudioService {

    @Autowired
    private ProgramaEstudioRepository programaEstudioRepository;

    @Autowired
    private FacultadRepository facultadRepository;

    /**
     * Obtener todos los programas de estudio
     */
    @Transactional(readOnly = true)
    public List<ProgramaEstudioResponse> findAll() {
        List<ProgramaEstudio> programas = programaEstudioRepository.findAll();
        return programas.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Obtener todos los programas activos
     */
    @Transactional(readOnly = true)
    public List<ProgramaEstudioResponse> findAllActive() {
        List<ProgramaEstudio> programas = programaEstudioRepository.findByActivoTrueOrderByNombreAsc();
        return programas.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Obtener programas disponibles para matrícula
     */
    @Transactional(readOnly = true)
    public List<ProgramaEstudioResponse> findAllAvailable() {
        List<ProgramaEstudio> programas = programaEstudioRepository.findByActivoTrueAndDisponibleTrueOrderByNombreAsc();
        return programas.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Obtener programas por facultad
     */
    @Transactional(readOnly = true)
    public List<ProgramaEstudioResponse> findByFacultadId(Long facultadId) {
        List<ProgramaEstudio> programas = programaEstudioRepository.findByFacultadIdAndActivoTrueOrderByNombreAsc(facultadId);
        return programas.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Obtener programas por nivel
     */
    @Transactional(readOnly = true)
    public List<ProgramaEstudioResponse> findByNivel(String nivel) {
        List<ProgramaEstudio> programas = programaEstudioRepository.findByNivelIgnoreCaseAndActivoTrueOrderByNombreAsc(nivel);
        return programas.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Obtener programas por modalidad
     */
    @Transactional(readOnly = true)
    public List<ProgramaEstudioResponse> findByModalidad(String modalidad) {
        List<ProgramaEstudio> programas = programaEstudioRepository.findByModalidadIgnoreCaseAndActivoTrueOrderByNombreAsc(modalidad);
        return programas.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Obtener programa por ID
     */
    @Transactional(readOnly = true)
    public ProgramaEstudioResponse findById(Long id) {
        ProgramaEstudio programa = programaEstudioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Programa de estudio no encontrado con ID: " + id));
        return convertToResponse(programa);
    }

    /**
     * Obtener niveles únicos
     */
    @Transactional(readOnly = true)
    public List<String> findDistinctNiveles() {
        return programaEstudioRepository.findDistinctNiveles();
    }

    /**
     * Obtener modalidades únicas
     */
    @Transactional(readOnly = true)
    public List<String> findDistinctModalidades() {
        return programaEstudioRepository.findDistinctModalidades();
    }

    /**
     * Crear nuevo programa de estudio
     */
    public ProgramaEstudioResponse create(ProgramaEstudioRequest request) {
        // Validar que la facultad existe y está activa
        Facultad facultad = facultadRepository.findById(request.getFacultadId())
                .orElseThrow(() -> new ResourceNotFoundException("Facultad no encontrada con ID: " + request.getFacultadId()));
        
        if (!facultad.getActivo()) {
            throw new BadRequestException("No se puede crear el programa en una facultad inactiva");
        }

        // Validar que no existe otro programa con el mismo código
        Optional<ProgramaEstudio> programaExistentePorCodigo = programaEstudioRepository.findByCodigo(request.getCodigo());
        if (programaExistentePorCodigo.isPresent()) {
            throw new BadRequestException("Ya existe un programa con el código: " + request.getCodigo());
        }

        // Validar que no existe otro programa con el mismo nombre en la misma facultad
        Optional<ProgramaEstudio> programaExistentePorNombre = programaEstudioRepository.findByNombre(request.getNombre());
        if (programaExistentePorNombre.isPresent()) {
            throw new BadRequestException("Ya existe un programa con el nombre: " + request.getNombre());
        }

        // Crear nuevo programa
        ProgramaEstudio programa = new ProgramaEstudio();
        programa.setNombre(request.getNombre());
        programa.setCodigo(request.getCodigo());
        programa.setNivel(request.getNivel());
        programa.setModalidad(request.getModalidad());
        programa.setDuracionSemestres(request.getDuracionSemestres());
        programa.setCreditosTotales(request.getCreditosTotales());
        programa.setDescripcion(request.getDescripcion());
        programa.setObjetivos(request.getObjetivos());
        programa.setFacultad(facultad);
        programa.setActivo(true);
        programa.setDisponible(true);

        ProgramaEstudio programaGuardado = programaEstudioRepository.save(programa);
        return convertToResponse(programaGuardado);
    }

    /**
     * Actualizar programa existente
     */
    public ProgramaEstudioResponse update(Long id, ProgramaEstudioRequest request) {
        ProgramaEstudio programa = programaEstudioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Programa de estudio no encontrado con ID: " + id));

        // Validar que la facultad existe y está activa
        Facultad facultad = facultadRepository.findById(request.getFacultadId())
                .orElseThrow(() -> new ResourceNotFoundException("Facultad no encontrada con ID: " + request.getFacultadId()));
        
        if (!facultad.getActivo()) {
            throw new BadRequestException("No se puede asignar el programa a una facultad inactiva");
        }

        // Validar que no existe otro programa con el mismo código (excluyendo el actual)
        Optional<ProgramaEstudio> programaExistentePorCodigo = programaEstudioRepository.findByCodigo(request.getCodigo());
        if (programaExistentePorCodigo.isPresent() && !programaExistentePorCodigo.get().getId().equals(id)) {
            throw new BadRequestException("Ya existe otro programa con el código: " + request.getCodigo());
        }

        // Validar que no existe otro programa con el mismo nombre (excluyendo el actual)
        Optional<ProgramaEstudio> programaExistentePorNombre = programaEstudioRepository.findByNombre(request.getNombre());
        if (programaExistentePorNombre.isPresent() && !programaExistentePorNombre.get().getId().equals(id)) {
            throw new BadRequestException("Ya existe otro programa con el nombre: " + request.getNombre());
        }

        // Actualizar campos
        programa.setNombre(request.getNombre());
        programa.setCodigo(request.getCodigo());
        programa.setNivel(request.getNivel());
        programa.setModalidad(request.getModalidad());
        programa.setDuracionSemestres(request.getDuracionSemestres());
        programa.setCreditosTotales(request.getCreditosTotales());
        programa.setDescripcion(request.getDescripcion());
        programa.setObjetivos(request.getObjetivos());
        programa.setFacultad(facultad);

        ProgramaEstudio programaActualizado = programaEstudioRepository.save(programa);
        return convertToResponse(programaActualizado);
    }

    /**
     * Cambiar estado activo/inactivo
     */
    public void toggleActive(Long id) {
        ProgramaEstudio programa = programaEstudioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Programa de estudio no encontrado con ID: " + id));
        
        programa.setActivo(!programa.getActivo());
        // Si se desactiva, también se hace no disponible
        if (!programa.getActivo()) {
            programa.setDisponible(false);
        }
        
        programaEstudioRepository.save(programa);
    }

    /**
     * Cambiar disponibilidad para matrícula
     */
    public void toggleDisponible(Long id) {
        ProgramaEstudio programa = programaEstudioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Programa de estudio no encontrado con ID: " + id));
        
        // Solo se puede hacer disponible si está activo
        if (!programa.getActivo() && !programa.getDisponible()) {
            throw new BadRequestException("No se puede hacer disponible un programa inactivo");
        }
        
        programa.setDisponible(!programa.getDisponible());
        programaEstudioRepository.save(programa);
    }

    /**
     * Eliminar programa (solo si no tiene dependencias)
     */
    public void delete(Long id) {
        ProgramaEstudio programa = programaEstudioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Programa de estudio no encontrado con ID: " + id));

        // Verificar si tiene menciones asociadas
        long mencionesCount = programaEstudioRepository.countMencionesByPrograma(id);
        if (mencionesCount > 0) {
            throw new BadRequestException("No se puede eliminar el programa porque tiene menciones asociadas");
        }

        programaEstudioRepository.delete(programa);
    }

    /**
     * Convertir entidad a DTO de respuesta
     */
    private ProgramaEstudioResponse convertToResponse(ProgramaEstudio programa) {
        ProgramaEstudioResponse response = new ProgramaEstudioResponse();
        response.setId(programa.getId());
        response.setNombre(programa.getNombre());
        response.setCodigo(programa.getCodigo());
        response.setNivel(programa.getNivel());
        response.setModalidad(programa.getModalidad());
        response.setDuracionSemestres(programa.getDuracionSemestres());
        response.setCreditosTotales(programa.getCreditosTotales());
        response.setActivo(programa.getActivo());
        response.setDisponible(programa.getDisponible());
        response.setDescripcion(programa.getDescripcion());
        response.setObjetivos(programa.getObjetivos());
        response.setFechaCreacion(programa.getFechaCreacion());
        response.setFechaActualizacion(programa.getFechaActualizacion());

        // Mapear facultad
        if (programa.getFacultad() != null) {
            FacultadBasicResponse facultadResponse = new FacultadBasicResponse();
            facultadResponse.setId(programa.getFacultad().getId());
            facultadResponse.setNombre(programa.getFacultad().getNombre());
            facultadResponse.setCodigo(programa.getFacultad().getCodigo());
            response.setFacultad(facultadResponse);
        }

        return response;
    }
}
