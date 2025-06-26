package com.escuelaposgrado.Autenticacion.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.escuelaposgrado.Autenticacion.dto.request.ActualizarPerfilRequest;
import com.escuelaposgrado.Autenticacion.dto.request.LoginRequest;
import com.escuelaposgrado.Autenticacion.dto.request.RegistroRequest;
import com.escuelaposgrado.Autenticacion.dto.response.AuthResponse;
import com.escuelaposgrado.Autenticacion.dto.response.MessageResponse;
import com.escuelaposgrado.Autenticacion.dto.response.UsuarioResponse;
import com.escuelaposgrado.Autenticacion.model.entity.Usuario;
import com.escuelaposgrado.Autenticacion.model.enums.Role;
import com.escuelaposgrado.Autenticacion.repository.UsuarioRepository;
import com.escuelaposgrado.Autenticacion.security.jwt.JwtUtils;

/**
 * Servicio para la autenticación y gestión de usuarios
 */
@Service
@Transactional
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private JwtUtils jwtUtils;

    /**
     * Autenticar usuario y generar token JWT
     */
    public AuthResponse login(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                loginRequest.getUsernameOrEmail(), 
                loginRequest.getPassword()
            )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        Usuario usuario = (Usuario) authentication.getPrincipal();
        
        // Actualizar último acceso
        usuarioRepository.actualizarUltimoAcceso(usuario.getId(), LocalDateTime.now());

        return mapToAuthResponse(jwt, usuario);
    }

    /**
     * Registrar nuevo usuario
     */
    public MessageResponse registro(RegistroRequest registroRequest) {
        // Validar si el username ya existe
        if (usuarioRepository.existsByUsername(registroRequest.getUsername())) {
            return new MessageResponse("Error: El nombre de usuario ya está en uso!", false);
        }

        // Validar si el email ya existe
        if (usuarioRepository.existsByEmail(registroRequest.getEmail())) {
            return new MessageResponse("Error: El email ya está en uso!", false);
        }

        // Validar códigos únicos según el rol
        String validationError = validateUniqueFields(registroRequest);
        if (validationError != null) {
            return new MessageResponse("Error: " + validationError, false);
        }

        // Crear nuevo usuario
        Usuario usuario = new Usuario(
            registroRequest.getUsername(),
            registroRequest.getEmail(),
            encoder.encode(registroRequest.getPassword()),
            registroRequest.getNombres(),
            registroRequest.getApellidos(),
            registroRequest.getRole()
        );

        // Establecer campos adicionales según el rol
        setRoleSpecificFields(usuario, registroRequest);

        // Establecer otros campos
        usuario.setDni(registroRequest.getDni());
        usuario.setTelefono(registroRequest.getTelefono());

        usuarioRepository.save(usuario);

        return new MessageResponse("Usuario registrado exitosamente!");
    }

    /**
     * Obtener información del usuario actual
     */
    public UsuarioResponse getCurrentUser(String username) {
        Usuario usuario = usuarioRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        return mapToUsuarioResponse(usuario);
    }



    /**
     * Actualizar perfil del usuario autenticado
     */
    public MessageResponse actualizarPerfil(String username, ActualizarPerfilRequest request) {
        try {
            // Buscar usuario por username
            Optional<Usuario> optionalUsuario = usuarioRepository.findByUsername(username);
            if (!optionalUsuario.isPresent()) {
                return new MessageResponse("Error: Usuario no encontrado", false);
            }

            Usuario usuario = optionalUsuario.get();

            // Validar contraseñas si se está actualizando
            if (request.isUpdatingPassword()) {
                if (!request.isPasswordValid()) {
                    return new MessageResponse("Error: Las contraseñas no coinciden", false);
                }
                // Actualizar contraseña
                usuario.setPassword(encoder.encode(request.getPassword()));
            }

            // Actualizar teléfono si se proporciona
            if (request.getTelefono() != null) {
                usuario.setTelefono(request.getTelefono());
            }

            // Guardar cambios
            usuarioRepository.save(usuario);

            return new MessageResponse("Perfil actualizado exitosamente", true);

        } catch (Exception e) {
            return new MessageResponse("Error al actualizar el perfil: " + e.getMessage(), false);
        }
    }

    /**
     * Obtener todos los usuarios por rol
     */
    public List<UsuarioResponse> getUsuariosByRole(Role role) {
        List<Usuario> usuarios = usuarioRepository.findByRoleAndActivoTrue(role);
        return usuarios.stream()
                      .map(this::mapToUsuarioResponse)
                      .collect(Collectors.toList());
    }

    /**
     * Obtener todos los usuarios por rol (incluidos inactivos)
     */
    public List<UsuarioResponse> getUsuariosByRoleIncluyendoInactivos(Role role) {
        List<Usuario> usuarios = usuarioRepository.findByRole(role);
        return usuarios.stream()
                      .map(this::mapToUsuarioResponse)
                      .collect(Collectors.toList());
    }

    /**
     * Obtener todos los usuarios activos
     */
    public List<UsuarioResponse> getAllUsuarios() {
        List<Usuario> usuarios = usuarioRepository.findByActivoTrue();
        return usuarios.stream()
                      .map(this::mapToUsuarioResponse)
                      .collect(Collectors.toList());
    }

    /**
     * Obtener todos los usuarios (incluidos inactivos)
     */
    public List<UsuarioResponse> getAllUsuariosIncluyendoInactivos() {
        List<Usuario> usuarios = usuarioRepository.findAll();
        return usuarios.stream()
                      .map(this::mapToUsuarioResponse)
                      .collect(Collectors.toList());
    }

    /**
     * Desactivar usuario
     */
    public MessageResponse desactivarUsuario(Long id) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findById(id);
        if (usuarioOpt.isEmpty()) {
            return new MessageResponse("Usuario no encontrado", false);
        }

        Usuario usuario = usuarioOpt.get();
        usuario.setActivo(false);
        usuarioRepository.save(usuario);

        return new MessageResponse("Usuario desactivado exitosamente");
    }

    /**
     * Activar usuario
     */
    public MessageResponse activarUsuario(Long id) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findById(id);
        if (usuarioOpt.isEmpty()) {
            return new MessageResponse("Usuario no encontrado", false);
        }

        Usuario usuario = usuarioOpt.get();
        usuario.setActivo(true);
        usuarioRepository.save(usuario);

        return new MessageResponse("Usuario activado exitosamente");
    }

    /**
     * Obtener estadísticas de usuarios por rol
     */
    public MessageResponse getEstadisticas() {
        long totalUsuarios = usuarioRepository.count();
        long admins = usuarioRepository.countByRoleAndActivoTrue(Role.ADMIN);
        long docentes = usuarioRepository.countByRoleAndActivoTrue(Role.DOCENTE);
        long alumnos = usuarioRepository.countByRoleAndActivoTrue(Role.ALUMNO);
        long coordinadores = usuarioRepository.countByRoleAndActivoTrue(Role.COORDINADOR);
        long postulantes = usuarioRepository.countByRoleAndActivoTrue(Role.POSTULANTE);

        String estadisticas = String.format(
            "Total: %d, Admins: %d, Docentes: %d, Alumnos: %d, Coordinadores: %d, Postulantes: %d",
            totalUsuarios, admins, docentes, alumnos, coordinadores, postulantes
        );

        return new MessageResponse(estadisticas);
    }

    // Métodos auxiliares privados

    private String validateUniqueFields(RegistroRequest request) {
        // Validar código de estudiante para ALUMNO y POSTULANTE
        if ((request.getRole() == Role.ALUMNO || request.getRole() == Role.POSTULANTE) 
            && request.getCodigoEstudiante() != null) {
            if (usuarioRepository.findByCodigoEstudiante(request.getCodigoEstudiante()).isPresent()) {
                return "El código de estudiante ya está en uso!";
            }
        }

        // Validar código de docente para DOCENTE y COORDINADOR
        if ((request.getRole() == Role.DOCENTE || request.getRole() == Role.COORDINADOR) 
            && request.getCodigoDocente() != null) {
            if (usuarioRepository.findByCodigoDocente(request.getCodigoDocente()).isPresent()) {
                return "El código de docente ya está en uso!";
            }
        }

        // Validar DNI si se proporciona
        if (request.getDni() != null && !request.getDni().trim().isEmpty()) {
            if (usuarioRepository.findByDni(request.getDni()).isPresent()) {
                return "El DNI ya está registrado!";
            }
        }

        return null;
    }

    private void setRoleSpecificFields(Usuario usuario, RegistroRequest request) {
        switch (request.getRole()) {
            case ALUMNO:
            case POSTULANTE:
                usuario.setCodigoEstudiante(request.getCodigoEstudiante());
                if (request.getRole() == Role.POSTULANTE) {
                    usuario.setProgramaInteres(request.getProgramaInteres());
                }
                break;
            case DOCENTE:
            case COORDINADOR:
                usuario.setCodigoDocente(request.getCodigoDocente());
                usuario.setEspecialidad(request.getEspecialidad());
                break;
            case ADMIN:
                // Admin no necesita campos adicionales
                break;
        }
    }

    private AuthResponse mapToAuthResponse(String jwt, Usuario usuario) {
        AuthResponse response = new AuthResponse(
            jwt, 
            usuario.getId(), 
            usuario.getUsername(), 
            usuario.getEmail(),
            usuario.getNombres(), 
            usuario.getApellidos(), 
            usuario.getRole()
        );
        response.setUltimoAcceso(usuario.getUltimoAcceso());
        response.setCodigoEstudiante(usuario.getCodigoEstudiante());
        response.setCodigoDocente(usuario.getCodigoDocente());
        response.setEspecialidad(usuario.getEspecialidad());
        response.setProgramaInteres(usuario.getProgramaInteres());
        
        return response;
    }

    private UsuarioResponse mapToUsuarioResponse(Usuario usuario) {
        UsuarioResponse response = new UsuarioResponse();
        response.setId(usuario.getId());
        response.setUsername(usuario.getUsername());
        response.setEmail(usuario.getEmail());
        response.setNombres(usuario.getNombres());
        response.setApellidos(usuario.getApellidos());
        response.setDni(usuario.getDni());
        response.setTelefono(usuario.getTelefono());
        response.setRole(usuario.getRole());
        response.setActivo(usuario.getActivo());
        response.setFechaCreacion(usuario.getFechaCreacion());
        response.setUltimoAcceso(usuario.getUltimoAcceso());
        response.setCodigoEstudiante(usuario.getCodigoEstudiante());
        response.setCodigoDocente(usuario.getCodigoDocente());
        response.setEspecialidad(usuario.getEspecialidad());
        response.setProgramaInteres(usuario.getProgramaInteres());
        
        return response;
    }
}
