package com.escuelaposgrado.Matricula.service;

import com.escuelaposgrado.Matricula.model.entity.Sede;
import com.escuelaposgrado.Matricula.dto.request.SedeRequest;
import com.escuelaposgrado.Matricula.dto.response.SedeResponse;
import com.escuelaposgrado.Matricula.repository.SedeRepository;
import com.escuelaposgrado.Matricula.exception.ResourceNotFoundException;
import com.escuelaposgrado.Matricula.exception.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;
import java.util.Optional;

/**
 * Servicio para gestionar las operaciones CRUD de Sedes
 */
@Service
@Transactional
public class SedeService {

    @Autowired
    private SedeRepository sedeRepository;

    /**
     * Obtener todas las sedes
     */
    @Transactional(readOnly = true)
    public List<SedeResponse> findAll() {
        List<Sede> sedes = sedeRepository.findAll();
        return sedes.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Obtener todas las sedes activas
     */
    @Transactional(readOnly = true)
    public List<SedeResponse> findAllActive() {
        List<Sede> sedes = sedeRepository.findByActivoTrue();
        return sedes.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Obtener sede por ID
     */
    @Transactional(readOnly = true)
    public SedeResponse findById(Long id) {
        Sede sede = sedeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sede no encontrada con ID: " + id));
        return convertToResponse(sede);
    }

    /**
     * Crear nueva sede
     */
    public SedeResponse create(SedeRequest request) {
        // Validar que no existe otra sede con el mismo nombre
        if (sedeRepository.existsByNombreIgnoreCase(request.getNombre())) {
            throw new BadRequestException("Ya existe una sede con el nombre: " + request.getNombre());
        }

        // Validar que no existe otra sede con el mismo código
        if (sedeRepository.existsByCodigo(request.getCodigo())) {
            throw new BadRequestException("Ya existe una sede con el código: " + request.getCodigo());
        }

        Sede sede = new Sede();
        sede.setNombre(request.getNombre());
        sede.setCodigo(request.getCodigo());
        sede.setDireccion(request.getDireccion());
        sede.setTelefono(request.getTelefono());
        sede.setEmail(request.getEmail());
        sede.setActivo(true);

        Sede savedSede = sedeRepository.save(sede);
        return convertToResponse(savedSede);
    }

    /**
     * Actualizar sede existente
     */
    public SedeResponse update(Long id, SedeRequest request) {
        Sede sede = sedeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sede no encontrada con ID: " + id));

        // Validar que no existe otra sede con el mismo nombre (excluyendo la actual)
        Optional<Sede> sedeExistentePorNombre = sedeRepository.findByNombreIgnoreCase(request.getNombre());
        if (sedeExistentePorNombre.isPresent() && !sedeExistentePorNombre.get().getId().equals(id)) {
            throw new BadRequestException("Ya existe una sede con el nombre: " + request.getNombre());
        }

        // Validar que no existe otra sede con el mismo código (excluyendo la actual)
        Optional<Sede> sedeExistentePorCodigo = sedeRepository.findByCodigo(request.getCodigo());
        if (sedeExistentePorCodigo.isPresent() && !sedeExistentePorCodigo.get().getId().equals(id)) {
            throw new BadRequestException("Ya existe una sede con el código: " + request.getCodigo());
        }

        sede.setNombre(request.getNombre());
        sede.setCodigo(request.getCodigo());
        sede.setDireccion(request.getDireccion());
        sede.setTelefono(request.getTelefono());
        sede.setEmail(request.getEmail());

        Sede updatedSede = sedeRepository.save(sede);
        return convertToResponse(updatedSede);
    }

    /**
     * Activar/desactivar sede
     */
    public SedeResponse toggleActive(Long id) {
        Sede sede = sedeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sede no encontrada con ID: " + id));

        sede.setActivo(!sede.getActivo());
        Sede updatedSede = sedeRepository.save(sede);
        return convertToResponse(updatedSede);
    }

    /**
     * Eliminar sede (borrado lógico)
     */
    public void delete(Long id) {
        Sede sede = sedeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sede no encontrada con ID: " + id));

        sede.setActivo(false);
        sedeRepository.save(sede);
    }

    /**
     * Buscar sedes por nombre
     */
    @Transactional(readOnly = true)
    public List<SedeResponse> findByNombreContaining(String nombre) {
        List<Sede> sedes = sedeRepository.findByNombreContainingIgnoreCase(nombre);
        return sedes.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Convertir entidad a DTO de respuesta
     */
    private SedeResponse convertToResponse(Sede sede) {
        SedeResponse response = new SedeResponse();
        response.setId(sede.getId());
        response.setNombre(sede.getNombre());
        response.setCodigo(sede.getCodigo());
        response.setDireccion(sede.getDireccion());
        response.setTelefono(sede.getTelefono());
        response.setEmail(sede.getEmail());
        response.setActivo(sede.getActivo());
        response.setFechaCreacion(sede.getFechaCreacion());
        response.setFechaActualizacion(sede.getFechaActualizacion());
        return response;
    }
}
