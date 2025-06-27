package com.escuelaposgrado.Autenticacion.service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.escuelaposgrado.Autenticacion.model.entity.Usuario;
import com.escuelaposgrado.Autenticacion.repository.UsuarioRepository;

/**
 * Servicio para limpieza de datos duplicados
 */
@Service
@Transactional
public class DataCleanupService {

    private static final Logger logger = LoggerFactory.getLogger(DataCleanupService.class);

    @Autowired
    private UsuarioRepository usuarioRepository;

    /**
     * Limpia registros duplicados en la base de datos
     */
    public void limpiarDuplicados() {
        logger.info("Iniciando limpieza de registros duplicados...");
        
        try {
            // Limpiar duplicados por username
            limpiarDuplicadosPorCampo("username");
            
            // Limpiar duplicados por email
            limpiarDuplicadosPorCampo("email");
            
            // Limpiar duplicados por DNI
            limpiarDuplicadosPorDni();
            
            // Limpiar duplicados por código de estudiante
            limpiarDuplicadosPorCodigoEstudiante();
            
            // Limpiar duplicados por código de docente
            limpiarDuplicadosPorCodigoDocente();
            
            logger.info("Limpieza de duplicados completada exitosamente");
            
        } catch (Exception e) {
            logger.error("Error durante la limpieza de duplicados: {}", e.getMessage(), e);
            throw new RuntimeException("Error al limpiar duplicados: " + e.getMessage());
        }
    }

    private void limpiarDuplicadosPorCampo(String campo) {
        List<Usuario> usuarios = usuarioRepository.findAll();
        
        Map<String, List<Usuario>> agrupados;
        if ("username".equals(campo)) {
            agrupados = usuarios.stream()
                .collect(Collectors.groupingBy(Usuario::getUsername));
        } else if ("email".equals(campo)) {
            agrupados = usuarios.stream()
                .collect(Collectors.groupingBy(Usuario::getEmail));
        } else {
            return;
        }
        
        for (Map.Entry<String, List<Usuario>> entry : agrupados.entrySet()) {
            List<Usuario> duplicados = entry.getValue();
            if (duplicados.size() > 1) {
                logger.warn("Encontrados {} duplicados para {}: {}", 
                    duplicados.size(), campo, entry.getKey());
                
                // Mantener solo el primer registro (más antiguo), eliminar el resto
                for (int i = 1; i < duplicados.size(); i++) {
                    Usuario duplicado = duplicados.get(i);
                    logger.info("Eliminando duplicado ID: {} con {}: {}", 
                        duplicado.getId(), campo, entry.getKey());
                    usuarioRepository.delete(duplicado);
                }
            }
        }
    }

    private void limpiarDuplicadosPorDni() {
        List<Usuario> usuarios = usuarioRepository.findAll();
        
        Map<String, List<Usuario>> agrupadosPorDni = usuarios.stream()
            .filter(u -> u.getDni() != null && !u.getDni().trim().isEmpty())
            .collect(Collectors.groupingBy(Usuario::getDni));
        
        for (Map.Entry<String, List<Usuario>> entry : agrupadosPorDni.entrySet()) {
            List<Usuario> duplicados = entry.getValue();
            if (duplicados.size() > 1) {
                logger.warn("Encontrados {} duplicados para DNI: {}", 
                    duplicados.size(), entry.getKey());
                
                // Mantener solo el primer registro, eliminar el resto
                for (int i = 1; i < duplicados.size(); i++) {
                    Usuario duplicado = duplicados.get(i);
                    logger.info("Eliminando duplicado ID: {} con DNI: {}", 
                        duplicado.getId(), entry.getKey());
                    usuarioRepository.delete(duplicado);
                }
            }
        }
    }

    private void limpiarDuplicadosPorCodigoEstudiante() {
        List<Usuario> usuarios = usuarioRepository.findAll();
        
        Map<String, List<Usuario>> agrupadosPorCodigo = usuarios.stream()
            .filter(u -> u.getCodigoEstudiante() != null && !u.getCodigoEstudiante().trim().isEmpty())
            .collect(Collectors.groupingBy(Usuario::getCodigoEstudiante));
        
        for (Map.Entry<String, List<Usuario>> entry : agrupadosPorCodigo.entrySet()) {
            List<Usuario> duplicados = entry.getValue();
            if (duplicados.size() > 1) {
                logger.warn("Encontrados {} duplicados para código estudiante: {}", 
                    duplicados.size(), entry.getKey());
                
                // Mantener solo el primer registro, eliminar el resto
                for (int i = 1; i < duplicados.size(); i++) {
                    Usuario duplicado = duplicados.get(i);
                    logger.info("Eliminando duplicado ID: {} con código estudiante: {}", 
                        duplicado.getId(), entry.getKey());
                    usuarioRepository.delete(duplicado);
                }
            }
        }
    }

    private void limpiarDuplicadosPorCodigoDocente() {
        List<Usuario> usuarios = usuarioRepository.findAll();
        
        Map<String, List<Usuario>> agrupadosPorCodigo = usuarios.stream()
            .filter(u -> u.getCodigoDocente() != null && !u.getCodigoDocente().trim().isEmpty())
            .collect(Collectors.groupingBy(Usuario::getCodigoDocente));
        
        for (Map.Entry<String, List<Usuario>> entry : agrupadosPorCodigo.entrySet()) {
            List<Usuario> duplicados = entry.getValue();
            if (duplicados.size() > 1) {
                logger.warn("Encontrados {} duplicados para código docente: {}", 
                    duplicados.size(), entry.getKey());
                
                // Mantener solo el primer registro, eliminar el resto
                for (int i = 1; i < duplicados.size(); i++) {
                    Usuario duplicado = duplicados.get(i);
                    logger.info("Eliminando duplicado ID: {} con código docente: {}", 
                        duplicado.getId(), entry.getKey());
                    usuarioRepository.delete(duplicado);
                }
            }
        }
    }

    /**
     * Verifica si existen registros duplicados
     */
    public boolean existenDuplicados() {
        List<Usuario> usuarios = usuarioRepository.findAll();
        
        // Verificar duplicados por username
        Map<String, Long> conteoUsername = usuarios.stream()
            .collect(Collectors.groupingBy(Usuario::getUsername, Collectors.counting()));
        
        // Verificar duplicados por email
        Map<String, Long> conteoEmail = usuarios.stream()
            .collect(Collectors.groupingBy(Usuario::getEmail, Collectors.counting()));
        
        // Verificar duplicados por DNI
        Map<String, Long> conteoDni = usuarios.stream()
            .filter(u -> u.getDni() != null && !u.getDni().trim().isEmpty())
            .collect(Collectors.groupingBy(Usuario::getDni, Collectors.counting()));
        
        boolean hayDuplicados = conteoUsername.values().stream().anyMatch(count -> count > 1) ||
                               conteoEmail.values().stream().anyMatch(count -> count > 1) ||
                               conteoDni.values().stream().anyMatch(count -> count > 1);
        
        if (hayDuplicados) {
            logger.warn("Se encontraron registros duplicados en la base de datos");
        }
        
        return hayDuplicados;
    }
}
