package com.escuelaposgrado.Intranet.service;

import com.escuelaposgrado.Intranet.dto.UsuarioDTO;
import com.escuelaposgrado.Intranet.model.Usuario;
import com.escuelaposgrado.Intranet.model.Role;
import com.escuelaposgrado.Intranet.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Servicio para la gestión de usuarios en el sistema de intranet
 */
@Service
@Transactional
public class UsuarioService {
    
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    /**
     * Obtener todos los usuarios activos
     */
    @Transactional(readOnly = true)
    public List<Usuario> obtenerUsuariosActivos() {
        return usuarioRepository.findByActivoTrue();
    }
    
    /**
     * Obtener usuario por ID (entidad)
     */
    @Transactional(readOnly = true)
    public Optional<Usuario> obtenerUsuarioEntidadPorId(Long id) {
        return usuarioRepository.findById(id);
    }
    
    /**
     * Obtener usuario por username
     */
    @Transactional(readOnly = true)
    public Optional<Usuario> obtenerUsuarioPorUsername(String username) {
        return usuarioRepository.findByUsername(username);
    }
    
    /**
     * Obtener usuario por email (entidad)
     */
    @Transactional(readOnly = true)
    public Optional<Usuario> obtenerUsuarioEntidadPorEmail(String email) {
        return usuarioRepository.findByEmail(email);
    }
    
    /**
     * Obtener usuarios por rol
     */
    @Transactional(readOnly = true)
    public List<Usuario> obtenerUsuariosPorRol(Role role) {
        return usuarioRepository.findByRoleAndActivoTrue(role);
    }
    
    /**
     * Obtener estudiantes activos
     */
    @Transactional(readOnly = true)
    public List<Usuario> obtenerEstudiantesActivos() {
        return usuarioRepository.findEstudiantesActivos();
    }
    
    /**
     * Obtener docentes activos
     */
    @Transactional(readOnly = true)
    public List<Usuario> obtenerDocentesActivos() {
        return usuarioRepository.findDocentesActivos();
    }
    
    /**
     * Obtener administrativos activos
     */
    @Transactional(readOnly = true)
    public List<Usuario> obtenerAdministrativosActivos() {
        return usuarioRepository.findAdministrativosActivos();
    }
    
    /**
     * Buscar usuarios por texto (entidad)
     */
    @Transactional(readOnly = true)
    public List<Usuario> buscarUsuariosEntidad(String texto) {
        if (texto == null || texto.trim().isEmpty()) {
            return obtenerUsuariosActivos();
        }
        return usuarioRepository.buscarUsuarios(texto.trim());
    }
    
    /**
     * Crear nuevo usuario
     */
    public Usuario crearUsuario(Usuario usuario) {
        // Validaciones adicionales si es necesario
        if (usuarioRepository.existsByUsername(usuario.getUsername())) {
            throw new RuntimeException("El username ya existe: " + usuario.getUsername());
        }
        
        if (usuarioRepository.existsByEmail(usuario.getEmail())) {
            throw new RuntimeException("El email ya existe: " + usuario.getEmail());
        }
        
        if (usuario.getDni() != null && usuarioRepository.existsByDni(usuario.getDni())) {
            throw new RuntimeException("El DNI ya existe: " + usuario.getDni());
        }
        
        return usuarioRepository.save(usuario);
    }
    
    /**
     * Actualizar usuario
     */
    public Usuario actualizarUsuario(Long id, Usuario usuarioActualizado) {
        Usuario usuario = usuarioRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + id));
        
        // Actualizar campos permitidos
        usuario.setNombres(usuarioActualizado.getNombres());
        usuario.setApellidos(usuarioActualizado.getApellidos());
        usuario.setEmail(usuarioActualizado.getEmail());
        usuario.setTelefono(usuarioActualizado.getTelefono());
        usuario.setDireccion(usuarioActualizado.getDireccion());
        usuario.setEspecialidad(usuarioActualizado.getEspecialidad());
        
        return usuarioRepository.save(usuario);
    }
    
    /**
     * Desactivar usuario (soft delete)
     */
    public void desactivarUsuario(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + id));
        
        usuario.setActivo(false);
        usuarioRepository.save(usuario);
    }
    
    /**
     * Reactivar usuario
     */
    public void reactivarUsuario(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + id));
        
        usuario.setActivo(true);
        usuarioRepository.save(usuario);
    }
    
    /**
     * Actualizar último acceso
     */
    public void actualizarUltimoAcceso(Long id) {
        usuarioRepository.actualizarUltimoAcceso(id, LocalDateTime.now());
    }
    
    /**
     * Obtener usuarios recientes
     */
    @Transactional(readOnly = true)
    public List<Usuario> obtenerUsuariosRecientes() {
        return usuarioRepository.findUsuariosRecientes();
    }
    
    /**
     * Obtener usuarios con acceso reciente
     */
    @Transactional(readOnly = true)
    public List<Usuario> obtenerUsuariosConAccesoReciente(int dias) {
        LocalDateTime fechaDesde = LocalDateTime.now().minusDays(dias);
        return usuarioRepository.findUsuariosConAccesoDesde(fechaDesde);
    }
    
    /**
     * Contar usuarios por rol
     */
    @Transactional(readOnly = true)
    public long contarUsuariosPorRol(Role role) {
        return usuarioRepository.countByRoleAndActivoTrue(role);
    }
    
    /**
     * Verificar si un username está disponible
     */
    @Transactional(readOnly = true)
    public boolean isUsernameDisponible(String username) {
        return !usuarioRepository.existsByUsername(username);
    }
    
    /**
     * Verificar si un email está disponible
     */
    @Transactional(readOnly = true)
    public boolean isEmailDisponible(String email) {
        return !usuarioRepository.existsByEmail(email);
    }
    
    /**
     * Verificar si un DNI está disponible
     */
    @Transactional(readOnly = true)
    public boolean isDniDisponible(String dni) {
        return !usuarioRepository.existsByDni(dni);
    }
    
    /**
     * Obtener estudiante por código
     */
    @Transactional(readOnly = true)
    public Optional<Usuario> obtenerEstudiantePorCodigo(String codigo) {
        return usuarioRepository.findByCodigoEstudiante(codigo);
    }
    
    /**
     * Obtener docente por código
     */
    @Transactional(readOnly = true)
    public Optional<Usuario> obtenerDocentePorCodigo(String codigo) {
        return usuarioRepository.findByCodigoDocente(codigo);
    }
    
    // ============= MÉTODOS PARA CONTROLADOR DTO =============
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    /**
     * Obtener usuarios paginados como DTO
     */
    @Transactional(readOnly = true)
    public Page<UsuarioDTO> obtenerUsuariosPaginados(Pageable pageable) {
        Page<Usuario> usuarios = usuarioRepository.findByEliminadoFalse(pageable);
        return usuarios.map(this::convertirADTO);
    }
    
    /**
     * Obtener usuario por ID como DTO
     */
    @Transactional(readOnly = true)
    public UsuarioDTO obtenerUsuarioPorId(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return convertirADTO(usuario);
    }
    
    /**
     * Crear usuario desde DTO
     */
    public UsuarioDTO crearUsuario(UsuarioDTO usuarioDTO) {
        // Validaciones
        if (usuarioRepository.existsByEmail(usuarioDTO.getEmail())) {
            throw new RuntimeException("El email ya existe");
        }
        if (usuarioRepository.existsByCodigo(usuarioDTO.getCodigo())) {
            throw new RuntimeException("El código ya existe");
        }
        
        Usuario usuario = new Usuario();
        usuario.setNombres(usuarioDTO.getNombres());
        usuario.setApellidos(usuarioDTO.getApellidos());
        usuario.setEmail(usuarioDTO.getEmail());
        usuario.setCodigo(usuarioDTO.getCodigo());
        usuario.setTelefono(usuarioDTO.getTelefono());
        usuario.setDireccion(usuarioDTO.getDireccion());
        usuario.setRol(Role.valueOf(usuarioDTO.getRol()));
        usuario.setActivo(usuarioDTO.getActivo() != null ? usuarioDTO.getActivo() : true);
        
        if (usuarioDTO.getPassword() != null && !usuarioDTO.getPassword().isEmpty()) {
            usuario.setPassword(passwordEncoder.encode(usuarioDTO.getPassword()));
        } else {
            // Password por defecto basado en código
            usuario.setPassword(passwordEncoder.encode(usuarioDTO.getCodigo()));
        }
        
        usuario = usuarioRepository.save(usuario);
        return convertirADTO(usuario);
    }
    
    /**
     * Actualizar usuario desde DTO
     */
    public UsuarioDTO actualizarUsuario(Long id, UsuarioDTO usuarioDTO) {
        Usuario usuario = usuarioRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        // Validar email único (excluyendo el usuario actual)
        if (!usuario.getEmail().equals(usuarioDTO.getEmail()) && 
            usuarioRepository.existsByEmail(usuarioDTO.getEmail())) {
            throw new RuntimeException("El email ya existe");
        }
        
        // Validar código único (excluyendo el usuario actual)
        if (!usuario.getCodigo().equals(usuarioDTO.getCodigo()) && 
            usuarioRepository.existsByCodigo(usuarioDTO.getCodigo())) {
            throw new RuntimeException("El código ya existe");
        }
        
        usuario.setNombres(usuarioDTO.getNombres());
        usuario.setApellidos(usuarioDTO.getApellidos());
        usuario.setEmail(usuarioDTO.getEmail());
        usuario.setCodigo(usuarioDTO.getCodigo());
        usuario.setTelefono(usuarioDTO.getTelefono());
        usuario.setDireccion(usuarioDTO.getDireccion());
        usuario.setRol(Role.valueOf(usuarioDTO.getRol()));
        usuario.setActivo(usuarioDTO.getActivo());
        
        usuario = usuarioRepository.save(usuario);
        return convertirADTO(usuario);
    }
    
    /**
     * Eliminar usuario (soft delete)
     */
    public void eliminarUsuario(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        usuario.setEliminado(true);
        usuarioRepository.save(usuario);
    }
    
    /**
     * Buscar usuarios como DTO
     */
    @Transactional(readOnly = true)
    public List<UsuarioDTO> buscarUsuarios(String termino) {
        List<Usuario> usuarios = usuarioRepository.buscarPorNombreOEmail(termino);
        return usuarios.stream()
            .map(this::convertirADTO)
            .collect(Collectors.toList());
    }
    
    /**
     * Obtener usuarios por rol (String) como DTO
     */
    @Transactional(readOnly = true)
    public List<UsuarioDTO> obtenerUsuariosPorRol(String rol) {
        Role roleEnum = Role.valueOf(rol.toUpperCase());
        List<Usuario> usuarios = obtenerUsuariosPorRol(roleEnum);
        return usuarios.stream()
            .map(this::convertirADTO)
            .collect(Collectors.toList());
    }
    
    /**
     * Obtener estudiantes como DTO
     */
    @Transactional(readOnly = true)
    public List<UsuarioDTO> obtenerEstudiantes() {
        List<Usuario> estudiantes = obtenerUsuariosPorRol(Role.ALUMNO);
        return estudiantes.stream()
            .map(this::convertirADTO)
            .collect(Collectors.toList());
    }
    
    /**
     * Obtener docentes como DTO
     */
    @Transactional(readOnly = true)
    public List<UsuarioDTO> obtenerDocentes() {
        List<Usuario> docentes = obtenerUsuariosPorRol(Role.DOCENTE);
        return docentes.stream()
            .map(this::convertirADTO)
            .collect(Collectors.toList());
    }
    
    /**
     * Cambiar contraseña
     */
    public void cambiarPassword(Long id, String passwordActual, String passwordNuevo) {
        Usuario usuario = usuarioRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        if (!passwordEncoder.matches(passwordActual, usuario.getPassword())) {
            throw new RuntimeException("La contraseña actual es incorrecta");
        }
        
        usuario.setPassword(passwordEncoder.encode(passwordNuevo));
        usuarioRepository.save(usuario);
    }
    
    /**
     * Cambiar estado de usuario
     */
    public void cambiarEstadoUsuario(Long id, Boolean activo) {
        Usuario usuario = usuarioRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        usuario.setActivo(activo);
        usuarioRepository.save(usuario);
    }
    
    /**
     * Obtener usuario por email como DTO
     */
    @Transactional(readOnly = true)
    public UsuarioDTO obtenerUsuarioPorEmail(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return convertirADTO(usuario);
    }
    
    /**
     * Verificar si es el usuario actual
     */
    @Transactional(readOnly = true)
    public boolean esUsuarioActual(Long id, String email) {
        Optional<Usuario> usuario = usuarioRepository.findByEmail(email);
        return usuario.isPresent() && usuario.get().getId().equals(id);
    }
    
    /**
     * Verificar si email es único
     */
    @Transactional(readOnly = true)
    public boolean esEmailUnico(String email) {
        return !usuarioRepository.existsByEmail(email);
    }
    
    /**
     * Verificar si código es único
     */
    @Transactional(readOnly = true)
    public boolean esCodigoUnico(String codigo) {
        return !usuarioRepository.existsByCodigo(codigo);
    }
    
    /**
     * Convertir entidad Usuario a DTO
     */
    private UsuarioDTO convertirADTO(Usuario usuario) {
        UsuarioDTO dto = new UsuarioDTO();
        dto.setId(usuario.getId());
        dto.setNombres(usuario.getNombres());
        dto.setApellidos(usuario.getApellidos());
        dto.setEmail(usuario.getEmail());
        dto.setCodigo(usuario.getCodigo());
        dto.setTelefono(usuario.getTelefono());
        dto.setDireccion(usuario.getDireccion());
        dto.setRol(usuario.getRol().name());
        dto.setActivo(usuario.getActivo());
        dto.setNombreCompleto(usuario.getNombreCompleto());
        dto.setFechaRegistro(usuario.getFechaRegistro());
        dto.setFechaActualizacion(usuario.getFechaActualizacion());
        dto.setUltimoAcceso(usuario.getUltimoAcceso());
        dto.setEliminado(usuario.getEliminado());
        // No incluir password en el DTO
        return dto;
    }
}
