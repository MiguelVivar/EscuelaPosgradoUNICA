package com.escuelaposgrado.Matricula.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.escuelaposgrado.Matricula.dto.request.MencionRequest;
import com.escuelaposgrado.Matricula.dto.response.MencionResponse;
import com.escuelaposgrado.Matricula.dto.response.nested.ProgramaEstudioBasicResponse;
import com.escuelaposgrado.Matricula.exception.BadRequestException;
import com.escuelaposgrado.Matricula.exception.ResourceNotFoundException;
import com.escuelaposgrado.Matricula.model.entity.Mencion;
import com.escuelaposgrado.Matricula.model.entity.ProgramaEstudio;
import com.escuelaposgrado.Matricula.repository.MencionRepository;
import com.escuelaposgrado.Matricula.repository.ProgramaEstudioRepository;

/**
 * Servicio para gestionar las operaciones CRUD de Menciones
 */
@Service
@Transactional
public class MencionService {

    @Autowired
    private MencionRepository mencionRepository;

    @Autowired
    private ProgramaEstudioRepository programaEstudioRepository;

    /**
     * Obtener todas las menciones
     */
    @Transactional(readOnly = true)
    public List<MencionResponse> findAll() {
        List<Mencion> menciones = mencionRepository.findAll();
        return menciones.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Obtener todas las menciones activas
     */
    @Transactional(readOnly = true)
    public List<MencionResponse> findAllActive() {
        List<Mencion> menciones = mencionRepository.findByActivoTrueOrderByNombreAsc();
        return menciones.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Obtener menciones por programa de estudio
     */
    @Transactional(readOnly = true)
    public List<MencionResponse> findByProgramaEstudioId(Long programaEstudioId) {
        List<Mencion> menciones = mencionRepository.findByProgramaEstudioIdAndActivoTrueOrderByNombreAsc(programaEstudioId);
        return menciones.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Obtener menciones disponibles por programa de estudio
     */
    @Transactional(readOnly = true)
    public List<MencionResponse> findAvailableByProgramaEstudioId(Long programaEstudioId) {
        List<Mencion> menciones = mencionRepository.findByProgramaEstudioIdAndActivoTrueAndDisponibleTrueOrderByNombreAsc(programaEstudioId);
        return menciones.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Obtener mención por ID
     */
    @Transactional(readOnly = true)
    public MencionResponse findById(Long id) {
        Mencion mencion = mencionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Mención no encontrada con ID: " + id));
        return convertToResponse(mencion);
    }

    /**
     * Crear nueva mención
     */
    public MencionResponse create(MencionRequest request) {
        // Validar que el programa de estudio existe y está activo
        ProgramaEstudio programaEstudio = programaEstudioRepository.findById(request.getProgramaEstudioId())
                .orElseThrow(() -> new ResourceNotFoundException("Programa de estudio no encontrado con ID: " + request.getProgramaEstudioId()));
        
        if (!programaEstudio.getActivo()) {
            throw new BadRequestException("No se puede crear la mención en un programa de estudio inactivo");
        }

        // Validar que no existe otra mención con el mismo nombre
        Optional<Mencion> mencionExistentePorNombre = mencionRepository.findByNombre(request.getNombre());
        if (mencionExistentePorNombre.isPresent()) {
            throw new BadRequestException("Ya existe una mención con el nombre: " + request.getNombre());
        }

        // Validar que no existe otra mención con el mismo código
        Optional<Mencion> mencionExistentePorCodigo = mencionRepository.findByCodigo(request.getCodigo());
        if (mencionExistentePorCodigo.isPresent()) {
            throw new BadRequestException("Ya existe una mención con el código: " + request.getCodigo());
        }

        Mencion mencion = new Mencion();
        mencion.setNombre(request.getNombre());
        mencion.setCodigo(request.getCodigo());
        mencion.setDescripcion(request.getDescripcion());
        mencion.setRequisitos(request.getRequisitos());
        mencion.setProgramaEstudio(programaEstudio);
        mencion.setActivo(true);
        mencion.setDisponible(true);

        Mencion savedMencion = mencionRepository.save(mencion);
        return convertToResponse(savedMencion);
    }

    /**
     * Actualizar mención existente
     */
    public MencionResponse update(Long id, MencionRequest request) {
        Mencion mencion = mencionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Mención no encontrada con ID: " + id));

        // Validar que el programa de estudio existe y está activo
        ProgramaEstudio programaEstudio = programaEstudioRepository.findById(request.getProgramaEstudioId())
                .orElseThrow(() -> new ResourceNotFoundException("Programa de estudio no encontrado con ID: " + request.getProgramaEstudioId()));
        
        if (!programaEstudio.getActivo()) {
            throw new BadRequestException("No se puede asignar la mención a un programa de estudio inactivo");
        }

        // Validar que no existe otra mención con el mismo nombre (excluyendo la actual)
        Optional<Mencion> mencionExistentePorNombre = mencionRepository.findByNombre(request.getNombre());
        if (mencionExistentePorNombre.isPresent() && !mencionExistentePorNombre.get().getId().equals(id)) {
            throw new BadRequestException("Ya existe una mención con el nombre: " + request.getNombre());
        }

        // Validar que no existe otra mención con el mismo código (excluyendo la actual)
        Optional<Mencion> mencionExistentePorCodigo = mencionRepository.findByCodigo(request.getCodigo());
        if (mencionExistentePorCodigo.isPresent() && !mencionExistentePorCodigo.get().getId().equals(id)) {
            throw new BadRequestException("Ya existe una mención con el código: " + request.getCodigo());
        }

        mencion.setNombre(request.getNombre());
        mencion.setCodigo(request.getCodigo());
        mencion.setDescripcion(request.getDescripcion());
        mencion.setRequisitos(request.getRequisitos());
        mencion.setProgramaEstudio(programaEstudio);

        Mencion updatedMencion = mencionRepository.save(mencion);
        return convertToResponse(updatedMencion);
    }

    /**
     * Activar/desactivar mención
     */
    public MencionResponse toggleActive(Long id) {
        Mencion mencion = mencionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Mención no encontrada con ID: " + id));

        mencion.setActivo(!mencion.getActivo());
        Mencion updatedMencion = mencionRepository.save(mencion);
        return convertToResponse(updatedMencion);
    }

    /**
     * Activar/desactivar disponibilidad de mención
     */
    public MencionResponse toggleDisponible(Long id) {
        Mencion mencion = mencionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Mención no encontrada con ID: " + id));

        mencion.setDisponible(!mencion.getDisponible());
        Mencion updatedMencion = mencionRepository.save(mencion);
        return convertToResponse(updatedMencion);
    }

    /**
     * Eliminar mención (borrado lógico)
     */
    public void delete(Long id) {
        Mencion mencion = mencionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Mención no encontrada con ID: " + id));

        mencion.setActivo(false);
        mencion.setDisponible(false);
        mencionRepository.save(mencion);
    }

    /**
     * Convertir entidad a DTO de respuesta
     */
    private MencionResponse convertToResponse(Mencion mencion) {
        MencionResponse response = new MencionResponse();
        response.setId(mencion.getId());
        response.setNombre(mencion.getNombre());
        response.setCodigo(mencion.getCodigo());
        response.setActivo(mencion.getActivo());
        response.setDisponible(mencion.getDisponible());
        response.setDescripcion(mencion.getDescripcion());
        response.setRequisitos(mencion.getRequisitos());
        response.setFechaCreacion(mencion.getFechaCreacion());
        response.setFechaActualizacion(mencion.getFechaActualizacion());

        // Convertir información del programa de estudio
        if (mencion.getProgramaEstudio() != null) {
            ProgramaEstudioBasicResponse programaBasic = new ProgramaEstudioBasicResponse();
            programaBasic.setId(mencion.getProgramaEstudio().getId());
            programaBasic.setNombre(mencion.getProgramaEstudio().getNombre());
            programaBasic.setCodigo(mencion.getProgramaEstudio().getCodigo());
            response.setProgramaEstudio(programaBasic);
        }

        return response;
    }
}
