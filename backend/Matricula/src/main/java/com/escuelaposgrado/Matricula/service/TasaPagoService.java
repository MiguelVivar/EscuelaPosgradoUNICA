package com.escuelaposgrado.Matricula.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.escuelaposgrado.Matricula.dto.request.TasaPagoRequest;
import com.escuelaposgrado.Matricula.dto.response.TasaPagoResponse;
import com.escuelaposgrado.Matricula.dto.response.nested.ProgramaEstudioBasicResponse;
import com.escuelaposgrado.Matricula.exception.BadRequestException;
import com.escuelaposgrado.Matricula.exception.ResourceNotFoundException;
import com.escuelaposgrado.Matricula.model.entity.ProgramaEstudio;
import com.escuelaposgrado.Matricula.model.entity.TasaPago;
import com.escuelaposgrado.Matricula.repository.ProgramaEstudioRepository;
import com.escuelaposgrado.Matricula.repository.TasaPagoRepository;

/**
 * Servicio para gestionar las operaciones CRUD de TasasPago
 */
@Service
@Transactional
public class TasaPagoService {

    @Autowired
    private TasaPagoRepository tasaPagoRepository;

    @Autowired
    private ProgramaEstudioRepository programaEstudioRepository;

    /**
     * Obtener todas las tasas de pago
     */
    @Transactional(readOnly = true)
    public List<TasaPagoResponse> findAll() {
        List<TasaPago> tasas = tasaPagoRepository.findByActivoTrueOrderByConceptoAsc();
        return tasas.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Obtener todas las tasas activas
     */
    @Transactional(readOnly = true)
    public List<TasaPagoResponse> findAllActive() {
        List<TasaPago> tasas = tasaPagoRepository.findByActivoTrueOrderByConceptoAsc();
        return tasas.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Obtener todas las tasas obligatorias
     */
    @Transactional(readOnly = true)
    public List<TasaPagoResponse> findAllObligatory() {
        List<TasaPago> tasas = tasaPagoRepository.findByObligatorioTrueAndActivoTrueOrderByConceptoAsc();
        return tasas.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Obtener tasas por programa de estudio
     */
    @Transactional(readOnly = true)
    public List<TasaPagoResponse> findByProgramaEstudioId(Long programaEstudioId) {
        List<TasaPago> tasas = tasaPagoRepository.findByProgramaEstudioIdAndActivoTrueOrderByConceptoAsc(programaEstudioId);
        return tasas.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Obtener tasas por tipo
     */
    @Transactional(readOnly = true)
    public List<TasaPagoResponse> findByTipo(String tipo) {
        List<TasaPago> tasas = tasaPagoRepository.findByTipoIgnoreCaseAndActivoTrueOrderByConceptoAsc(tipo);
        return tasas.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Obtener tipos de tasas distintos
     */
    @Transactional(readOnly = true)
    public List<String> findDistinctTipos() {
        return tasaPagoRepository.findDistinctTipos();
    }

    /**
     * Buscar tasas por concepto
     */
    @Transactional(readOnly = true)
    public List<TasaPagoResponse> searchByConcepto(String concepto) {
        List<TasaPago> tasas = tasaPagoRepository.findByConceptoIgnoreCaseContainingAndActivoTrueOrderByConceptoAsc(concepto);
        return tasas.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Obtener tasa por ID
     */
    @Transactional(readOnly = true)
    public TasaPagoResponse findById(Long id) {
        TasaPago tasa = tasaPagoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tasa de pago no encontrada con ID: " + id));
        return convertToResponse(tasa);
    }

    /**
     * Crear nueva tasa de pago
     */
    public TasaPagoResponse create(TasaPagoRequest request) {
        // Validar que no exista otra tasa con el mismo código
        Optional<TasaPago> existingTasa = tasaPagoRepository.findByCodigo(request.getCodigo());
        if (existingTasa.isPresent()) {
            throw new BadRequestException("Ya existe una tasa de pago con el código: " + request.getCodigo());
        }

        // Validar que existe el programa de estudio
        ProgramaEstudio programa = programaEstudioRepository.findById(request.getProgramaEstudioId())
                .orElseThrow(() -> new ResourceNotFoundException("Programa de estudio no encontrado con ID: " + request.getProgramaEstudioId()));

        // Crear nueva tasa
        TasaPago tasa = new TasaPago();
        tasa.setConcepto(request.getConcepto());
        tasa.setCodigo(request.getCodigo());
        tasa.setMonto(request.getMonto());
        tasa.setMoneda(request.getMoneda() != null ? request.getMoneda() : "PEN");
        tasa.setTipo(request.getTipo());
        tasa.setObligatorio(request.getObligatorio() != null ? request.getObligatorio() : false);
        tasa.setDescripcion(request.getDescripcion());
        tasa.setFechaVigenciaInicio(request.getFechaVigenciaInicio());
        tasa.setFechaVigenciaFin(request.getFechaVigenciaFin());
        tasa.setProgramaEstudio(programa);
        tasa.setActivo(true);

        TasaPago savedTasa = tasaPagoRepository.save(tasa);
        return convertToResponse(savedTasa);
    }

    /**
     * Actualizar tasa existente
     */
    public TasaPagoResponse update(Long id, TasaPagoRequest request) {
        TasaPago tasa = tasaPagoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tasa de pago no encontrada con ID: " + id));

        // Validar código único (excepto para la misma tasa)
        Optional<TasaPago> existingTasa = tasaPagoRepository.findByCodigo(request.getCodigo());
        if (existingTasa.isPresent() && !existingTasa.get().getId().equals(id)) {
            throw new BadRequestException("Ya existe una tasa de pago con el código: " + request.getCodigo());
        }

        // Validar que existe el programa de estudio
        ProgramaEstudio programa = programaEstudioRepository.findById(request.getProgramaEstudioId())
                .orElseThrow(() -> new ResourceNotFoundException("Programa de estudio no encontrado con ID: " + request.getProgramaEstudioId()));

        // Actualizar campos
        tasa.setConcepto(request.getConcepto());
        tasa.setCodigo(request.getCodigo());
        tasa.setMonto(request.getMonto());
        tasa.setMoneda(request.getMoneda() != null ? request.getMoneda() : "PEN");
        tasa.setTipo(request.getTipo());
        tasa.setObligatorio(request.getObligatorio() != null ? request.getObligatorio() : false);
        tasa.setDescripcion(request.getDescripcion());
        tasa.setFechaVigenciaInicio(request.getFechaVigenciaInicio());
        tasa.setFechaVigenciaFin(request.getFechaVigenciaFin());
        tasa.setProgramaEstudio(programa);

        TasaPago updatedTasa = tasaPagoRepository.save(tasa);
        return convertToResponse(updatedTasa);
    }

    /**
     * Alternar estado activo/inactivo
     */
    public void toggleActive(Long id) {
        TasaPago tasa = tasaPagoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tasa de pago no encontrada con ID: " + id));
        
        tasa.setActivo(!tasa.getActivo());
        tasaPagoRepository.save(tasa);
    }

    /**
     * Eliminar tasa (soft delete)
     */
    public void delete(Long id) {
        TasaPago tasa = tasaPagoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tasa de pago no encontrada con ID: " + id));
        
        tasa.setActivo(false);
        tasaPagoRepository.save(tasa);
    }

    /**
     * Convertir entidad a DTO de respuesta
     */
    private TasaPagoResponse convertToResponse(TasaPago tasa) {
        TasaPagoResponse response = new TasaPagoResponse();
        response.setId(tasa.getId());
        response.setConcepto(tasa.getConcepto());
        response.setCodigo(tasa.getCodigo());
        response.setMonto(tasa.getMonto());
        response.setMoneda(tasa.getMoneda());
        response.setTipo(tasa.getTipo());
        response.setActivo(tasa.getActivo());
        response.setObligatorio(tasa.getObligatorio());
        response.setDescripcion(tasa.getDescripcion());
        response.setFechaVigenciaInicio(tasa.getFechaVigenciaInicio());
        response.setFechaVigenciaFin(tasa.getFechaVigenciaFin());
        response.setFechaCreacion(tasa.getFechaCreacion());
        response.setFechaActualizacion(tasa.getFechaActualizacion());

        // Convertir programa de estudio
        if (tasa.getProgramaEstudio() != null) {
            ProgramaEstudioBasicResponse programaResponse = new ProgramaEstudioBasicResponse();
            programaResponse.setId(tasa.getProgramaEstudio().getId());
            programaResponse.setNombre(tasa.getProgramaEstudio().getNombre());
            programaResponse.setCodigo(tasa.getProgramaEstudio().getCodigo());
            response.setProgramaEstudio(programaResponse);
        }

        return response;
    }
}
