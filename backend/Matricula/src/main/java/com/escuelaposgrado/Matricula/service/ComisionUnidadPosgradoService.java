package com.escuelaposgrado.Matricula.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.escuelaposgrado.Matricula.dto.request.ComisionUnidadPosgradoRequest;
import com.escuelaposgrado.Matricula.dto.response.ComisionUnidadPosgradoResponse;
import com.escuelaposgrado.Matricula.dto.response.nested.FacultadBasicResponse;
import com.escuelaposgrado.Matricula.exception.ResourceNotFoundException;
import com.escuelaposgrado.Matricula.model.entity.ComisionUnidadPosgrado;
import com.escuelaposgrado.Matricula.model.entity.Facultad;
import com.escuelaposgrado.Matricula.repository.ComisionUnidadPosgradoRepository;
import com.escuelaposgrado.Matricula.repository.FacultadRepository;

/**
 * Servicio para la gestión de ComisionUnidadPosgrado
 */
@Service
@Transactional
public class ComisionUnidadPosgradoService {

    @Autowired
    private ComisionUnidadPosgradoRepository comisionRepository;

    @Autowired
    private FacultadRepository facultadRepository;

    /**
     * Obtiene todas las comisiones
     * @return Lista de comisiones
     */
    @Transactional(readOnly = true)
    public List<ComisionUnidadPosgradoResponse> findAll() {
        List<ComisionUnidadPosgrado> comisiones = comisionRepository.findAll();
        List<ComisionUnidadPosgradoResponse> responses = new ArrayList<>();
        for (ComisionUnidadPosgrado comision : comisiones) {
            responses.add(convertToResponse(comision));
        }
        return responses;
    }

    /**
     * Obtiene una comisión por ID
     * @param id ID de la comisión
     * @return Comisión encontrada
     * @throws ResourceNotFoundException si no se encuentra la comisión
     */
    @Transactional(readOnly = true)
    public ComisionUnidadPosgradoResponse findById(Long id) {
        ComisionUnidadPosgrado comision = comisionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ComisionUnidadPosgrado no encontrada con ID: " + id));
        return convertToResponse(comision);
    }

    /**
     * Obtiene comisiones por facultad
     * @param facultadId ID de la facultad
     * @return Lista de comisiones de la facultad
     */
    @Transactional(readOnly = true)
    public List<ComisionUnidadPosgradoResponse> findByFacultadId(Long facultadId) {
        List<ComisionUnidadPosgrado> comisiones = comisionRepository.findByFacultadIdAndActivoTrueOrderByNombreAsc(facultadId);
        List<ComisionUnidadPosgradoResponse> responses = new ArrayList<>();
        for (ComisionUnidadPosgrado comision : comisiones) {
            responses.add(convertToResponse(comision));
        }
        return responses;
    }

    /**
     * Obtiene comisiones activas
     * @return Lista de comisiones activas
     */
    @Transactional(readOnly = true)
    public List<ComisionUnidadPosgradoResponse> findByActivoTrue() {
        List<ComisionUnidadPosgrado> comisiones = comisionRepository.findByActivoTrueOrderByNombreAsc();
        List<ComisionUnidadPosgradoResponse> responses = new ArrayList<>();
        for (ComisionUnidadPosgrado comision : comisiones) {
            responses.add(convertToResponse(comision));
        }
        return responses;
    }

    /**
     * Busca comisiones por nombre
     * @param nombre Nombre a buscar
     * @return Lista de comisiones que contienen el nombre
     */
    @Transactional(readOnly = true)
    public List<ComisionUnidadPosgradoResponse> findByNombreContaining(String nombre) {
        // We'll implement a custom search using all comisiones
        List<ComisionUnidadPosgrado> allComisiones = comisionRepository.findAll();
        List<ComisionUnidadPosgrado> filteredComisiones = new ArrayList<>();
        for (ComisionUnidadPosgrado comision : allComisiones) {
            if (comision.getNombre().toLowerCase().contains(nombre.toLowerCase())) {
                filteredComisiones.add(comision);
            }
        }
        List<ComisionUnidadPosgradoResponse> responses = new ArrayList<>();
        for (ComisionUnidadPosgrado comision : filteredComisiones) {
            responses.add(convertToResponse(comision));
        }
        return responses;
    }

    /**
     * Crea una nueva comisión
     * @param request Datos de la comisión a crear
     * @return Comisión creada
     * @throws ResourceNotFoundException si no se encuentra la facultad
     */
    public ComisionUnidadPosgradoResponse create(ComisionUnidadPosgradoRequest request) {
        // Validar que la facultad existe
        Facultad facultad = facultadRepository.findById(request.getFacultadId())
                .orElseThrow(() -> new ResourceNotFoundException("Facultad no encontrada con ID: " + request.getFacultadId()));

        // Validar código único
        if (comisionRepository.findByCodigo(request.getCodigo()).isPresent()) {
            throw new IllegalArgumentException("Ya existe una comisión con el código: " + request.getCodigo());
        }

        // Crear nueva comisión
        ComisionUnidadPosgrado comision = new ComisionUnidadPosgrado();
        mapRequestToEntity(request, comision);
        comision.setFacultad(facultad);
        comision.setActivo(true); // Nueva comisión activa por defecto
        comision.setFechaCreacion(LocalDateTime.now());
        comision.setFechaActualizacion(LocalDateTime.now());

        ComisionUnidadPosgrado savedComision = comisionRepository.save(comision);
        return convertToResponse(savedComision);
    }

    /**
     * Actualiza una comisión existente
     * @param id ID de la comisión a actualizar
     * @param request Nuevos datos de la comisión
     * @return Comisión actualizada
     * @throws ResourceNotFoundException si no se encuentra la comisión o facultad
     */
    public ComisionUnidadPosgradoResponse update(Long id, ComisionUnidadPosgradoRequest request) {
        // Verificar que la comisión existe
        ComisionUnidadPosgrado existingComision = comisionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ComisionUnidadPosgrado no encontrada con ID: " + id));

        // Validar que la facultad existe
        Facultad facultad = facultadRepository.findById(request.getFacultadId())
                .orElseThrow(() -> new ResourceNotFoundException("Facultad no encontrada con ID: " + request.getFacultadId()));

        // Validar código único (excepto para la misma comisión)
        if (!existingComision.getCodigo().equals(request.getCodigo()) &&
            comisionRepository.findByCodigo(request.getCodigo()).isPresent()) {
            throw new IllegalArgumentException("Ya existe una comisión con el código: " + request.getCodigo());
        }

        // Actualizar comisión
        mapRequestToEntity(request, existingComision);
        existingComision.setFacultad(facultad);
        existingComision.setFechaActualizacion(LocalDateTime.now());

        ComisionUnidadPosgrado updatedComision = comisionRepository.save(existingComision);
        return convertToResponse(updatedComision);
    }

    /**
     * Elimina una comisión
     * @param id ID de la comisión a eliminar
     * @throws ResourceNotFoundException si no se encuentra la comisión
     */
    public void delete(Long id) {
        ComisionUnidadPosgrado comision = comisionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ComisionUnidadPosgrado no encontrada con ID: " + id));
        comisionRepository.delete(comision);
    }

    /**
     * Activa o desactiva una comisión
     * @param id ID de la comisión
     * @param activo Estado activo/inactivo
     * @return Comisión actualizada
     * @throws ResourceNotFoundException si no se encuentra la comisión
     */
    public ComisionUnidadPosgradoResponse toggleActivo(Long id, Boolean activo) {
        ComisionUnidadPosgrado comision = comisionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ComisionUnidadPosgrado no encontrada con ID: " + id));
        
        comision.setActivo(activo);
        comision.setFechaActualizacion(LocalDateTime.now());
        
        ComisionUnidadPosgrado updatedComision = comisionRepository.save(comision);
        return convertToResponse(updatedComision);
    }

    /**
     * Convierte entity a response DTO
     * @param comision Entity a convertir
     * @return Response DTO
     */
    private ComisionUnidadPosgradoResponse convertToResponse(ComisionUnidadPosgrado comision) {
        ComisionUnidadPosgradoResponse response = new ComisionUnidadPosgradoResponse();
        response.setId(comision.getId());
        response.setNombre(comision.getNombre());
        response.setCodigo(comision.getCodigo());
        response.setTipo(comision.getTipo());
        response.setPresidente(comision.getPresidente());
        response.setSecretario(comision.getSecretario());
        response.setMiembros(comision.getMiembros());
        response.setActivo(comision.getActivo());
        response.setDescripcion(comision.getDescripcion());
        response.setFunciones(comision.getFunciones());
        response.setFechaInicioGestion(comision.getFechaInicioGestion());
        response.setFechaFinGestion(comision.getFechaFinGestion());
        response.setFechaCreacion(comision.getFechaCreacion());
        response.setFechaActualizacion(comision.getFechaActualizacion());

        if (comision.getFacultad() != null) {
            FacultadBasicResponse facultadResponse = new FacultadBasicResponse();
            facultadResponse.setId(comision.getFacultad().getId());
            facultadResponse.setNombre(comision.getFacultad().getNombre());
            facultadResponse.setCodigo(comision.getFacultad().getCodigo());
            response.setFacultad(facultadResponse);
        }

        return response;
    }

    /**
     * Mapea datos del request al entity
     * @param request Request DTO
     * @param comision Entity a mapear
     */
    private void mapRequestToEntity(ComisionUnidadPosgradoRequest request, ComisionUnidadPosgrado comision) {
        comision.setNombre(request.getNombre());
        comision.setCodigo(request.getCodigo());
        comision.setTipo(request.getTipo());
        comision.setPresidente(request.getPresidente());
        comision.setSecretario(request.getSecretario());
        comision.setMiembros(request.getMiembros());
        comision.setDescripcion(request.getDescripcion());
        comision.setFunciones(request.getFunciones());
        comision.setFechaInicioGestion(request.getFechaInicioGestion());
        comision.setFechaFinGestion(request.getFechaFinGestion());
    }
}
