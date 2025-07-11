package com.escuelaposgrado.Matricula.service;

import com.escuelaposgrado.Matricula.model.entity.Aula;
import com.escuelaposgrado.Matricula.model.entity.Sede;
import com.escuelaposgrado.Matricula.dto.request.AulaRequest;
import com.escuelaposgrado.Matricula.dto.response.AulaResponse;
import com.escuelaposgrado.Matricula.dto.response.nested.SedeBasicResponse;
import com.escuelaposgrado.Matricula.repository.AulaRepository;
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
 * Servicio para gestionar las operaciones CRUD de Aulas
 */
@Service
@Transactional
public class AulaService {

    @Autowired
    private AulaRepository aulaRepository;

    @Autowired
    private SedeRepository sedeRepository;

    /**
     * Obtener todas las aulas
     */
    @Transactional(readOnly = true)
    public List<AulaResponse> findAll() {
        List<Aula> aulas = aulaRepository.findAll();
        return aulas.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Obtener todas las aulas activas
     */
    @Transactional(readOnly = true)
    public List<AulaResponse> findAllActive() {
        List<Aula> aulas = aulaRepository.findByActivoTrueOrderByNombreAsc();
        return aulas.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Obtener aulas por sede
     */
    @Transactional(readOnly = true)
    public List<AulaResponse> findBySedeId(Long sedeId) {
        List<Aula> aulas = aulaRepository.findBySedeIdAndActivoTrueOrderByNombreAsc(sedeId);
        return aulas.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Obtener aulas activas por sede
     */
    @Transactional(readOnly = true)
    public List<AulaResponse> findActiveBySedeId(Long sedeId) {
        List<Aula> aulas = aulaRepository.findBySedeIdAndActivoTrueOrderByNombreAsc(sedeId);
        return aulas.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Obtener aula por ID
     */
    @Transactional(readOnly = true)
    public AulaResponse findById(Long id) {
        Aula aula = aulaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Aula no encontrada con ID: " + id));
        return convertToResponse(aula);
    }

    /**
     * Crear nueva aula
     */
    public AulaResponse create(AulaRequest request) {
        // Validar que la sede existe y está activa
        Sede sede = sedeRepository.findById(request.getSedeId())
                .orElseThrow(() -> new ResourceNotFoundException("Sede no encontrada con ID: " + request.getSedeId()));
        
        if (!sede.getActivo()) {
            throw new BadRequestException("No se puede crear el aula en una sede inactiva");
        }

        // Validar que no existe otra aula con el mismo código en la misma sede
        Optional<Aula> aulaExistentePorCodigo = aulaRepository.findByCodigo(request.getCodigo());
        if (aulaExistentePorCodigo.isPresent() && aulaExistentePorCodigo.get().getSede().getId().equals(request.getSedeId())) {
            throw new BadRequestException("Ya existe un aula con el código " + request.getCodigo() + " en esta sede");
        }

        Aula aula = new Aula();
        aula.setNombre(request.getNombre());
        aula.setCodigo(request.getCodigo());
        aula.setCapacidad(request.getCapacidad());
        aula.setTipo(request.getTipo());
        aula.setEquipamiento(request.getEquipamiento());
        aula.setDescripcion(request.getDescripcion());
        aula.setSede(sede);
        aula.setActivo(true);

        Aula savedAula = aulaRepository.save(aula);
        return convertToResponse(savedAula);
    }

    /**
     * Actualizar aula existente
     */
    public AulaResponse update(Long id, AulaRequest request) {
        Aula aula = aulaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Aula no encontrada con ID: " + id));

        // Validar que la sede existe y está activa
        Sede sede = sedeRepository.findById(request.getSedeId())
                .orElseThrow(() -> new ResourceNotFoundException("Sede no encontrada con ID: " + request.getSedeId()));
        
        if (!sede.getActivo()) {
            throw new BadRequestException("No se puede asignar el aula a una sede inactiva");
        }

        // Validar que no existe otra aula con el mismo código en la misma sede (excluyendo la actual)
        Optional<Aula> aulaExistentePorCodigo = aulaRepository.findByCodigo(request.getCodigo());
        if (aulaExistentePorCodigo.isPresent() && 
            aulaExistentePorCodigo.get().getSede().getId().equals(request.getSedeId()) &&
            !aulaExistentePorCodigo.get().getId().equals(id)) {
            throw new BadRequestException("Ya existe un aula con el código " + request.getCodigo() + " en esta sede");
        }

        aula.setNombre(request.getNombre());
        aula.setCodigo(request.getCodigo());
        aula.setCapacidad(request.getCapacidad());
        aula.setTipo(request.getTipo());
        aula.setEquipamiento(request.getEquipamiento());
        aula.setDescripcion(request.getDescripcion());
        aula.setSede(sede);

        Aula updatedAula = aulaRepository.save(aula);
        return convertToResponse(updatedAula);
    }

    /**
     * Activar/desactivar aula
     */
    public AulaResponse toggleActive(Long id) {
        Aula aula = aulaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Aula no encontrada con ID: " + id));

        aula.setActivo(!aula.getActivo());
        Aula updatedAula = aulaRepository.save(aula);
        return convertToResponse(updatedAula);
    }

    /**
     * Eliminar aula (borrado lógico)
     */
    public void delete(Long id) {
        Aula aula = aulaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Aula no encontrada con ID: " + id));

        aula.setActivo(false);
        aulaRepository.save(aula);
    }

    /**
     * Buscar aulas por nombre
     */
    @Transactional(readOnly = true)
    public List<AulaResponse> findByNombreContaining(String nombre) {
        // Como no existe el método exacto, usar findAll y filtrar
        List<Aula> todasLasAulas = aulaRepository.findAll();
        List<Aula> aulas = todasLasAulas.stream()
                .filter(aula -> aula.getNombre().toLowerCase().contains(nombre.toLowerCase()) && aula.getActivo())
                .collect(Collectors.toList());
        return aulas.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Obtener aulas por capacidad mínima
     */
    @Transactional(readOnly = true)
    public List<AulaResponse> findByCapacidadMinima(Integer capacidadMinima) {
        List<Aula> aulas = aulaRepository.findByCapacidadGreaterThanEqualAndActivoTrueOrderByCapacidadAsc(capacidadMinima);
        return aulas.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Convertir entidad a DTO de respuesta
     */
    private AulaResponse convertToResponse(Aula aula) {
        AulaResponse response = new AulaResponse();
        response.setId(aula.getId());
        response.setNombre(aula.getNombre());
        response.setCodigo(aula.getCodigo());
        response.setCapacidad(aula.getCapacidad());
        response.setTipo(aula.getTipo());
        response.setEquipamiento(aula.getEquipamiento());
        response.setDescripcion(aula.getDescripcion());
        response.setActivo(aula.getActivo());
        response.setFechaCreacion(aula.getFechaCreacion());
        response.setFechaActualizacion(aula.getFechaActualizacion());

        // Convertir información de la sede
        if (aula.getSede() != null) {
            SedeBasicResponse sedeBasic = new SedeBasicResponse();
            sedeBasic.setId(aula.getSede().getId());
            sedeBasic.setNombre(aula.getSede().getNombre());
            sedeBasic.setCodigo(aula.getSede().getCodigo());
            response.setSede(sedeBasic);
        }

        return response;
    }
}
