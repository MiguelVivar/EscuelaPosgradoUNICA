package com.escuelaposgrado.Intranet.repository;

import com.escuelaposgrado.Intranet.model.Usuario;
import com.escuelaposgrado.Intranet.model.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Repositorio para la entidad Usuario
 */
@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    
    // Búsquedas básicas
    Optional<Usuario> findByUsername(String username);
    Optional<Usuario> findByEmail(String email);
    Optional<Usuario> findByEmailAndActivoTrue(String email);
    Optional<Usuario> findByDni(String dni);
    Optional<Usuario> findByCodigoEstudiante(String codigoEstudiante);
    Optional<Usuario> findByCodigoDocente(String codigoDocente);
    
    // Búsquedas por username o email
    Optional<Usuario> findByUsernameOrEmail(String username, String email);
    
    // Verificar existencias
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    boolean existsByDni(String dni);
    boolean existsByCodigoEstudiante(String codigoEstudiante);
    boolean existsByCodigoDocente(String codigoDocente);
    
    // Búsquedas por rol
    List<Usuario> findByRole(Role role);
    List<Usuario> findByRoleAndActivoTrue(Role role);
    
    // Búsquedas por estado
    List<Usuario> findByActivoTrue();
    List<Usuario> findByActivoFalse();
    
    // Estudiantes activos
    @Query("SELECT u FROM Usuario u WHERE u.role = 'ALUMNO' AND u.activo = true ORDER BY u.apellidos, u.nombres")
    List<Usuario> findEstudiantesActivos();
    
    // Docentes activos
    @Query("SELECT u FROM Usuario u WHERE u.role = 'DOCENTE' AND u.activo = true ORDER BY u.apellidos, u.nombres")
    List<Usuario> findDocentesActivos();
    
    // Administrativos activos
    @Query("SELECT u FROM Usuario u WHERE u.role IN ('ADMIN', 'COORDINADOR') AND u.activo = true ORDER BY u.role, u.apellidos, u.nombres")
    List<Usuario> findAdministrativosActivos();
    
    // Búsqueda de usuarios por nombre
    @Query("SELECT u FROM Usuario u WHERE " +
           "(LOWER(u.nombres) LIKE LOWER(CONCAT('%', :texto, '%')) OR " +
           "LOWER(u.apellidos) LIKE LOWER(CONCAT('%', :texto, '%')) OR " +
           "LOWER(u.username) LIKE LOWER(CONCAT('%', :texto, '%')) OR " +
           "LOWER(u.email) LIKE LOWER(CONCAT('%', :texto, '%'))) " +
           "AND u.activo = true " +
           "ORDER BY u.apellidos, u.nombres")
    List<Usuario> buscarUsuarios(@Param("texto") String texto);
    
    // Últimos usuarios registrados
    @Query("SELECT u FROM Usuario u WHERE u.activo = true ORDER BY u.fechaCreacion DESC")
    List<Usuario> findUsuariosRecientes();
    
    // Usuarios por último acceso
    @Query("SELECT u FROM Usuario u WHERE u.ultimoAcceso >= :fechaDesde ORDER BY u.ultimoAcceso DESC")
    List<Usuario> findUsuariosConAccesoDesde(@Param("fechaDesde") LocalDateTime fechaDesde);
    
    // Contar usuarios por rol
    @Query("SELECT COUNT(u) FROM Usuario u WHERE u.role = :role AND u.activo = true")
    long countByRoleAndActivoTrue(@Param("role") Role role);
    
    // Actualizar último acceso
    @Query("UPDATE Usuario u SET u.ultimoAcceso = :ultimoAcceso WHERE u.id = :id")
    void actualizarUltimoAcceso(@Param("id") Long id, @Param("ultimoAcceso") LocalDateTime ultimoAcceso);
    
    // Métodos adicionales para el servicio DTO
    boolean existsByCodigo(String codigo);
    Optional<Usuario> findByCodigo(String codigo);
    
    @Query("SELECT u FROM Usuario u WHERE u.eliminado = false")
    Page<Usuario> findByEliminadoFalse(Pageable pageable);
    
    @Query("SELECT u FROM Usuario u WHERE (LOWER(u.nombres) LIKE LOWER(CONCAT('%', :termino, '%')) OR " +
           "LOWER(u.apellidos) LIKE LOWER(CONCAT('%', :termino, '%')) OR " +
           "LOWER(u.email) LIKE LOWER(CONCAT('%', :termino, '%'))) AND u.eliminado = false")
    List<Usuario> buscarPorNombreOEmail(@Param("termino") String termino);
}
