package com.escuelaposgrado.Autenticacion.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.escuelaposgrado.Autenticacion.model.entity.Usuario;
import com.escuelaposgrado.Autenticacion.model.enums.Role;

/**
 * Repositorio para la gestión de usuarios del sistema académico
 */
@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    /**
     * Buscar usuario por nombre de usuario
     */
    Optional<Usuario> findByUsername(String username);

    /**
     * Buscar usuario por email
     */
    Optional<Usuario> findByEmail(String email);

    /**
     * Buscar usuario por username o email
     */
    Optional<Usuario> findByUsernameOrEmail(String username, String email);

    /**
     * Verificar si existe un usuario con el username dado
     */
    boolean existsByUsername(String username);

    /**
     * Verificar si existe un usuario con el email dado
     */
    boolean existsByEmail(String email);

    /**
     * Buscar usuarios por rol
     */
    List<Usuario> findByRole(Role role);

    /**
     * Buscar usuarios activos por rol
     */
    List<Usuario> findByRoleAndActivoTrue(Role role);

    /**
     * Buscar usuarios activos
     */
    List<Usuario> findByActivoTrue();

    /**
     * Buscar usuario por DNI
     */
    Optional<Usuario> findByDni(String dni);

    /**
     * Buscar estudiantes por código
     */
    Optional<Usuario> findByCodigoEstudiante(String codigoEstudiante);

    /**
     * Buscar docentes por código
     */
    Optional<Usuario> findByCodigoDocente(String codigoDocente);

    /**
     * Actualizar último acceso del usuario
     */
    @Modifying
    @Query("UPDATE Usuario u SET u.ultimoAcceso = :ultimoAcceso WHERE u.id = :id")
    void actualizarUltimoAcceso(@Param("id") Long id, @Param("ultimoAcceso") LocalDateTime ultimoAcceso);

    /**
     * Contar usuarios por rol
     */
    long countByRole(Role role);

    /**
     * Contar usuarios activos por rol
     */
    long countByRoleAndActivoTrue(Role role);

    /**
     * Buscar usuarios por nombre o apellido (búsqueda parcial)
     */
    @Query("SELECT u FROM Usuario u WHERE " +
           "LOWER(u.nombres) LIKE LOWER(CONCAT('%', :texto, '%')) OR " +
           "LOWER(u.apellidoPaterno) LIKE LOWER(CONCAT('%', :texto, '%')) OR " +
           "LOWER(u.apellidoMaterno) LIKE LOWER(CONCAT('%', :texto, '%'))")
    List<Usuario> buscarPorNombre(@Param("texto") String texto);

    /**
     * Buscar postulantes por programa de interés
     */
    List<Usuario> findByRoleAndProgramaInteres(Role role, String programaInteres);

    /**
     * Buscar docentes por especialidad
     */
    List<Usuario> findByRoleAndEspecialidad(Role role, String especialidad);
}
