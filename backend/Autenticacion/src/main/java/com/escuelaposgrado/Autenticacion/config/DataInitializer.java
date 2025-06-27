package com.escuelaposgrado.Autenticacion.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.escuelaposgrado.Autenticacion.model.entity.Usuario;
import com.escuelaposgrado.Autenticacion.model.enums.Role;
import com.escuelaposgrado.Autenticacion.repository.UsuarioRepository;
import com.escuelaposgrado.Autenticacion.service.DataCleanupService;

/**
 * Inicialización de datos por defecto del sistema
 */
@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private DataCleanupService dataCleanupService;

    @Override
    public void run(String... args) throws Exception {
        // Primero limpiar duplicados existentes
        logger.info("Verificando y limpiando registros duplicados...");
        if (dataCleanupService.existenDuplicados()) {
            dataCleanupService.limpiarDuplicados();
            logger.info("Duplicados eliminados exitosamente");
        } else {
            logger.info("No se encontraron duplicados");
        }
        
        // Luego inicializar usuarios por defecto
        initializeDefaultUsers();
    }

    /**
     * Crear usuarios por defecto si no existen
     */
    private void initializeDefaultUsers() {
        try {
            // Crear usuario administrador por defecto
            if (!usuarioRepository.existsByUsername("admin")) {
                Usuario admin = new Usuario();
                admin.setUsername("admin");
                admin.setEmail("admin@unica.edu.pe");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setNombres("Administrador");
                admin.setApellidoPaterno("del");
                admin.setApellidoMaterno("Sistema");
                admin.setRole(Role.ADMIN);
                admin.setActivo(true);

                usuarioRepository.save(admin);
                logger.info("Usuario administrador creado: admin / admin123");
            }

            // Crear usuarios de ejemplo para cada rol
            createSampleUsers();

        } catch (Exception e) {
            logger.error("Error inicializando datos: {}", e.getMessage());
        }
    }

    /**
     * Crear usuarios de ejemplo para demostración
     */
    private void createSampleUsers() {
        // Docente de ejemplo
        if (!usuarioRepository.existsByUsername("docente.demo")) {
            Usuario docente = new Usuario();
            docente.setUsername("docente.demo");
            docente.setEmail("docente.demo@unica.edu.pe");
            docente.setPassword(passwordEncoder.encode("docente123"));
            docente.setNombres("María Elena");
            docente.setApellidoPaterno("García");
            docente.setApellidoMaterno("Rodríguez");
            docente.setRole(Role.DOCENTE);
            docente.setCodigoDocente("DOC001");
            docente.setEspecialidad("Ingeniería de Sistemas");
            docente.setDni("12345678");
            docente.setTelefono("956123456");
            docente.setActivo(true);

            usuarioRepository.save(docente);
            logger.info("Usuario docente creado: docente.demo / docente123");
        }

        // Coordinador de ejemplo
        if (!usuarioRepository.existsByUsername("coordinador.demo")) {
            Usuario coordinador = new Usuario();
            coordinador.setUsername("coordinador.demo");
            coordinador.setEmail("coordinador.demo@unica.edu.pe");
            coordinador.setPassword(passwordEncoder.encode("coordinador123"));
            coordinador.setNombres("Carlos Antonio");
            coordinador.setApellidoPaterno("Mendoza");
            coordinador.setApellidoMaterno("Silva");
            coordinador.setRole(Role.COORDINADOR);
            coordinador.setCodigoDocente("COORD001");
            coordinador.setEspecialidad("Gestión Académica");
            coordinador.setDni("87654321");
            coordinador.setTelefono("956654321");
            coordinador.setActivo(true);

            usuarioRepository.save(coordinador);
            logger.info("Usuario coordinador creado: coordinador.demo / coordinador123");
        }

        // Alumno de ejemplo
        if (!usuarioRepository.existsByUsername("alumno.demo")) {
            Usuario alumno = new Usuario();
            alumno.setUsername("alumno.demo");
            alumno.setEmail("alumno.demo@unica.edu.pe");
            alumno.setPassword(passwordEncoder.encode("alumno123"));
            alumno.setNombres("Ana Sofía");
            alumno.setApellidoPaterno("López");
            alumno.setApellidoMaterno("Fernández");
            alumno.setRole(Role.ALUMNO);
            alumno.setCodigoEstudiante("EST2024001");
            alumno.setDni("11223344");
            alumno.setTelefono("956111222");
            alumno.setActivo(true);

            usuarioRepository.save(alumno);
            logger.info("Usuario alumno creado: alumno.demo / alumno123");
        }

        // Postulante de ejemplo
        if (!usuarioRepository.existsByUsername("postulante.demo")) {
            Usuario postulante = new Usuario();
            postulante.setUsername("postulante.demo");
            postulante.setEmail("postulante.demo@gmail.com");
            postulante.setPassword(passwordEncoder.encode("postulante123"));
            postulante.setNombres("Luis Miguel");
            postulante.setApellidoPaterno("Vargas");
            postulante.setApellidoMaterno("Torres");
            postulante.setRole(Role.POSTULANTE);
            postulante.setCodigoEstudiante("POST2024001");
            postulante.setProgramaInteres("Maestría en Ingeniería de Sistemas");
            postulante.setDni("55667788");
            postulante.setTelefono("956333444");
            postulante.setActivo(true);

            usuarioRepository.save(postulante);
            logger.info("Usuario postulante creado: postulante.demo / postulante123");
        }

        logger.info("Inicialización de datos completada");
    }
}
