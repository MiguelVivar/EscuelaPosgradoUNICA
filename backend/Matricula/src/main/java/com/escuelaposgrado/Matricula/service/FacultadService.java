package com.escuelaposgrado.Matricula.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.escuelaposgrado.Matricula.dto.request.FacultadRequest;
import com.escuelaposgrado.Matricula.dto.response.FacultadResponse;
import com.escuelaposgrado.Matricula.exception.BadRequestException;
import com.escuelaposgrado.Matricula.exception.ResourceNotFoundException;
import com.escuelaposgrado.Matricula.model.entity.Facultad;
import com.escuelaposgrado.Matricula.repository.FacultadRepository;

/**
 * Servicio para gestionar las operaciones CRUD de Facultades
 */
@Service
@Transactional
public class FacultadService {

    @Autowired
    private FacultadRepository facultadRepository;

    /**
     * Obtener todas las facultades
     */
    @Transactional(readOnly = true)
    public List<FacultadResponse> findAll() {
        List<Facultad> facultades = facultadRepository.findAll();
        return facultades.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Obtener todas las facultades activas
     */
    @Transactional(readOnly = true)
    public List<FacultadResponse> findAllActive() {
        List<Facultad> facultades = facultadRepository.findByActivoTrueOrderByNombreAsc();
        return facultades.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Obtener facultad por ID
     */
    @Transactional(readOnly = true)
    public FacultadResponse findById(Long id) {
        Facultad facultad = facultadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Facultad no encontrada con ID: " + id));
        return convertToResponse(facultad);
    }

    /**
     * Crear nueva facultad
     */
    public FacultadResponse create(FacultadRequest request) {
        // Validar que no existe otra facultad con el mismo código
        Optional<Facultad> facultadExistentePorCodigo = facultadRepository.findByCodigo(request.getCodigo());
        if (facultadExistentePorCodigo.isPresent()) {
            throw new BadRequestException("Ya existe una facultad con el código " + request.getCodigo());
        }

        // Validar que no existe otra facultad con el mismo nombre
        Optional<Facultad> facultadExistentePorNombre = facultadRepository.findByNombre(request.getNombre());
        if (facultadExistentePorNombre.isPresent()) {
            throw new BadRequestException("Ya existe una facultad con el nombre " + request.getNombre());
        }

        Facultad facultad = new Facultad();
        facultad.setNombre(request.getNombre());
        facultad.setCodigo(request.getCodigo());
        facultad.setDescripcion(request.getDescripcion());
        facultad.setDecano(request.getDecano());
        facultad.setActivo(true);

        Facultad savedFacultad = facultadRepository.save(facultad);
        return convertToResponse(savedFacultad);
    }

    /**
     * Actualizar facultad existente
     */
    public FacultadResponse update(Long id, FacultadRequest request) {
        Facultad facultad = facultadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Facultad no encontrada con ID: " + id));

        // Validar que no existe otra facultad con el mismo código (excluyendo la actual)
        Optional<Facultad> facultadExistentePorCodigo = facultadRepository.findByCodigo(request.getCodigo());
        if (facultadExistentePorCodigo.isPresent() && !facultadExistentePorCodigo.get().getId().equals(id)) {
            throw new BadRequestException("Ya existe una facultad con el código " + request.getCodigo());
        }

        // Validar que no existe otra facultad con el mismo nombre (excluyendo la actual)
        Optional<Facultad> facultadExistentePorNombre = facultadRepository.findByNombre(request.getNombre());
        if (facultadExistentePorNombre.isPresent() && !facultadExistentePorNombre.get().getId().equals(id)) {
            throw new BadRequestException("Ya existe una facultad con el nombre " + request.getNombre());
        }

        facultad.setNombre(request.getNombre());
        facultad.setCodigo(request.getCodigo());
        facultad.setDescripcion(request.getDescripcion());
        facultad.setDecano(request.getDecano());

        Facultad updatedFacultad = facultadRepository.save(facultad);
        return convertToResponse(updatedFacultad);
    }

    /**
     * Activar/desactivar facultad
     */
    public FacultadResponse toggleActive(Long id) {
        Facultad facultad = facultadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Facultad no encontrada con ID: " + id));

        facultad.setActivo(!facultad.getActivo());
        Facultad updatedFacultad = facultadRepository.save(facultad);
        return convertToResponse(updatedFacultad);
    }

    /**
     * Eliminar facultad (borrado lógico)
     */
    public void delete(Long id) {
        Facultad facultad = facultadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Facultad no encontrada con ID: " + id));

        facultad.setActivo(false);
        facultadRepository.save(facultad);
    }

    /**
     * Buscar facultades por nombre
     */
    @Transactional(readOnly = true)
    public List<FacultadResponse> findByNombreContaining(String nombre) {
        // Como no existe el método exacto, usar findAll y filtrar
        List<Facultad> todasLasFacultades = facultadRepository.findAll();
        List<Facultad> facultades = todasLasFacultades.stream()
                .filter(facultad -> facultad.getNombre().toLowerCase().contains(nombre.toLowerCase()) && facultad.getActivo())
                .collect(Collectors.toList());
        return facultades.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Buscar facultades por decano
     */
    @Transactional(readOnly = true)
    public List<FacultadResponse> findByDecanoContaining(String decano) {
        List<Facultad> facultades = facultadRepository.findByDecanoIgnoreCaseContainingAndActivoTrueOrderByNombreAsc(decano);
        return facultades.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Obtener facultades con programas activos
     */
    @Transactional(readOnly = true)
    public List<FacultadResponse> findFacultadesConProgramasActivos() {
        List<Facultad> facultades = facultadRepository.findFacultadesConProgramasActivos();
        return facultades.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Convertir entidad a DTO de respuesta
     */
    private FacultadResponse convertToResponse(Facultad facultad) {
        FacultadResponse response = new FacultadResponse();
        response.setId(facultad.getId());
        response.setNombre(facultad.getNombre());
        response.setCodigo(facultad.getCodigo());
        response.setDescripcion(facultad.getDescripcion());
        response.setDecano(facultad.getDecano());
        response.setActivo(facultad.getActivo());
        response.setFechaCreacion(facultad.getFechaCreacion());
        response.setFechaActualizacion(facultad.getFechaActualizacion());

        return response;
    }
}
