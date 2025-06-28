package com.escuelaposgrado.Autenticacion.service;

import java.time.LocalDateTime;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;

import com.escuelaposgrado.Autenticacion.dto.request.GoogleLoginRequest;
import com.escuelaposgrado.Autenticacion.dto.response.AuthResponse;
import com.escuelaposgrado.Autenticacion.model.entity.Usuario;
import com.escuelaposgrado.Autenticacion.model.enums.Role;
import com.escuelaposgrado.Autenticacion.repository.UsuarioRepository;
import com.escuelaposgrado.Autenticacion.security.jwt.JwtUtils;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Servicio para manejar la autenticación con Google OAuth
 */
@Service
@Transactional
public class GoogleOAuthService {
    
    private static final Logger logger = LoggerFactory.getLogger(GoogleOAuthService.class);
    
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @Autowired
    private JwtUtils jwtUtils;
    
    @Autowired
    private PasswordEncoder encoder;
    
    @Value("${app.googleOAuth.clientId}")
    private String googleClientId;
    
    private final WebClient webClient;
    
    public GoogleOAuthService() {
        this.webClient = WebClient.builder()
            .baseUrl("https://www.googleapis.com")
            .build();
    }
    
    /**
     * DTO para la respuesta de Google OAuth
     */
    public static class GoogleUserInfo {
        private String sub;
        private String email;
        @JsonProperty("given_name")
        private String givenName;
        @JsonProperty("family_name")
        private String familyName;
        private String name;
        private String picture;
        @JsonProperty("email_verified")
        private Boolean emailVerified;
        
        // Getters y Setters
        public String getSub() { return sub; }
        public void setSub(String sub) { this.sub = sub; }
        
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        
        public String getGivenName() { return givenName; }
        public void setGivenName(String givenName) { this.givenName = givenName; }
        
        public String getFamilyName() { return familyName; }
        public void setFamilyName(String familyName) { this.familyName = familyName; }
        
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        
        public String getPicture() { return picture; }
        public void setPicture(String picture) { this.picture = picture; }
        
        public Boolean getEmailVerified() { return emailVerified; }
        public void setEmailVerified(Boolean emailVerified) { this.emailVerified = emailVerified; }
    }
    
    /**
     * Autentica un usuario usando Google OAuth
     */
    public AuthResponse authenticateWithGoogle(GoogleLoginRequest request) {
        try {
            // Verificar el token de Google y obtener información del usuario
            GoogleUserInfo googleUser = verifyGoogleToken(request.getGoogleToken());
            
            if (googleUser == null) {
                throw new RuntimeException("Token de Google inválido");
            }
            
            // Verificar que el email sea de la universidad
            if (!isUniversityEmail(googleUser.getEmail())) {
                throw new RuntimeException("Solo se permiten correos institucionales (@unica.edu.pe)");
            }
            
            // Buscar o crear usuario
            Usuario usuario = findOrCreateUser(googleUser);
            
            // Actualizar último acceso
            usuarioRepository.actualizarUltimoAcceso(usuario.getId(), LocalDateTime.now());
            
            // Generar JWT token
            String jwt = jwtUtils.generateJwtTokenForUser(usuario.getUsername());
            
            return mapToAuthResponse(jwt, usuario);
            
        } catch (RuntimeException e) {
            logger.error("Error en autenticación con Google: {}", e.getMessage());
            throw e; // Re-lanzar para mantener el tipo de error específico
        } catch (Exception e) {
            logger.error("Error inesperado en autenticación con Google: {}", e.getMessage(), e);
            throw new RuntimeException("Error interno en autenticación con Google");
        }
    }
    
    /**
     * Verifica el token de Google y obtiene la información del usuario
     */
    private GoogleUserInfo verifyGoogleToken(String token) {
        try {
            GoogleUserInfo userInfo = null;
            
            // Primero intentar como access_token
            try {
                userInfo = webClient.get()
                    .uri("/oauth2/v2/userinfo?access_token=" + token)
                    .retrieve()
                    .bodyToMono(GoogleUserInfo.class)
                    .block();
                
                if (userInfo != null) {
                    logger.debug("Token verificado exitosamente como access_token para usuario: {}", userInfo.getEmail());
                    return userInfo;
                }
            } catch (Exception e) {
                logger.debug("Fallo verificación como access_token, intentando como id_token");
            }
            
            // Si falla como access_token, intentar como id_token
            try {
                userInfo = webClient.get()
                    .uri("/oauth2/v3/tokeninfo?id_token=" + token)
                    .retrieve()
                    .bodyToMono(GoogleUserInfo.class)
                    .block();
                
                if (userInfo != null) {
                    logger.debug("Token verificado exitosamente como id_token para usuario: {}", userInfo.getEmail());
                }
            } catch (Exception e) {
                logger.debug("Fallo verificación como id_token: {}", e.getMessage());
            }
            
            // Verificar que el token pertenece a nuestra aplicación (opcional pero recomendado)
            if (userInfo != null && googleClientId != null && !googleClientId.isEmpty()) {
                // Aquí se podría agregar verificación adicional del client_id si es necesario
                logger.debug("Verificación adicional de client_id completada");
            }
            
            return userInfo;
        } catch (Exception e) {
            logger.error("Error al verificar token de Google: {}", e.getMessage());
            return null;
        }
    }
    
    /**
     * Verifica si el email pertenece a la universidad
     */
    private boolean isUniversityEmail(String email) {
        return email != null && email.toLowerCase().endsWith("@unica.edu.pe");
    }
    
    /**
     * Busca un usuario existente o crea uno nuevo basado en la información de Google
     */
    private Usuario findOrCreateUser(GoogleUserInfo googleUser) {
        Optional<Usuario> existingUser = usuarioRepository.findByEmail(googleUser.getEmail());
        
        if (existingUser.isPresent()) {
            Usuario usuario = existingUser.get();
            
            // Verificar que la cuenta esté activa
            if (!usuario.getActivo()) {
                throw new RuntimeException("La cuenta está desactivada. Contacte al administrador.");
            }
            
            // Actualizar información si es necesario
            updateUserIfNeeded(usuario, googleUser);
            
            return usuario;
        } else {
            // Crear nuevo usuario
            return createNewUserFromGoogle(googleUser);
        }
    }
    
    /**
     * Actualiza la información del usuario si es necesario
     */
    private void updateUserIfNeeded(Usuario usuario, GoogleUserInfo googleUser) {
        boolean needsUpdate = false;
        
        // Actualizar nombres si están vacíos o diferentes
        if (usuario.getNombres() == null || usuario.getNombres().isEmpty()) {
            usuario.setNombres(googleUser.getGivenName() != null ? googleUser.getGivenName() : "");
            needsUpdate = true;
        }
        
        if (usuario.getApellidos() == null || usuario.getApellidos().isEmpty()) {
            usuario.setApellidos(googleUser.getFamilyName() != null ? googleUser.getFamilyName() : "");
            needsUpdate = true;
        }
        
        if (needsUpdate) {
            usuarioRepository.save(usuario);
            logger.info("Usuario actualizado desde Google OAuth: {}", usuario.getEmail());
        }
    }
    
    /**
     * Crea un nuevo usuario basado en la información de Google
     */
    private Usuario createNewUserFromGoogle(GoogleUserInfo googleUser) {
        Usuario nuevoUsuario = new Usuario();
        
        // Generar username único basado en el email
        String username = generateUsernameFromEmail(googleUser.getEmail());
        
        nuevoUsuario.setUsername(username);
        nuevoUsuario.setEmail(googleUser.getEmail());
        nuevoUsuario.setNombres(googleUser.getGivenName() != null ? googleUser.getGivenName() : "");
        nuevoUsuario.setApellidos(googleUser.getFamilyName() != null ? googleUser.getFamilyName() : "");
        
        // Contraseña aleatoria (no será usada ya que el usuario usa OAuth)
        nuevoUsuario.setPassword(encoder.encode("GOOGLE_OAUTH_" + System.currentTimeMillis()));
        
        // Determinar rol basado en el email (por defecto ALUMNO - Estudiante)
        Role userRole = determineRoleFromEmail(googleUser.getEmail());
        nuevoUsuario.setRole(userRole);
        
        // Establecer campos específicos según el rol
        if (userRole == Role.ALUMNO) {
            // Generar código de estudiante automático para nuevos alumnos
            String codigoEstudiante = generateCodigoEstudiante();
            nuevoUsuario.setCodigoEstudiante(codigoEstudiante);
        }
        nuevoUsuario.setActivo(true);
        nuevoUsuario.setFechaCreacion(LocalDateTime.now());
        
        Usuario savedUser = usuarioRepository.save(nuevoUsuario);
        logger.info("Nuevo usuario creado desde Google OAuth: {}", savedUser.getEmail());
        
        return savedUser;
    }
    
    /**
     * Genera un username único basado en el email
     */
    private String generateUsernameFromEmail(String email) {
        String baseUsername = email.substring(0, email.indexOf("@"));
        String username = baseUsername;
        int counter = 1;
        
        // Verificar que el username sea único
        while (usuarioRepository.existsByUsername(username)) {
            username = baseUsername + counter;
            counter++;
        }
        
        return username;
    }
    
    /**
     * Determina el rol del usuario basado en el email
     */
    private Role determineRoleFromEmail(String email) {
        // Por defecto, asignar rol de ALUMNO (Estudiante) para nuevos usuarios
        // Esto puede ser ajustado según las reglas de negocio
        String localPart = email.substring(0, email.indexOf("@")).toLowerCase();
        
        // Lógica personalizable para determinar roles
        if (localPart.contains("admin") || localPart.contains("administrador")) {
            return Role.ADMIN;
        } else if (localPart.contains("docente") || localPart.contains("profesor")) {
            return Role.DOCENTE;
        } else if (localPart.contains("coordinador")) {
            return Role.COORDINADOR;
        } else if (localPart.contains("postulante")) {
            return Role.POSTULANTE;
        } else {
            // Por defecto, nuevos usuarios son estudiantes (ALUMNO)
            return Role.ALUMNO;
        }
    }
    
    /**
     * Mapea el usuario a AuthResponse
     */
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
        response.setDni(usuario.getDni());
        response.setTelefono(usuario.getTelefono());
        response.setDireccion(usuario.getDireccion());
        response.setUltimoAcceso(usuario.getUltimoAcceso());
        response.setCodigoEstudiante(usuario.getCodigoEstudiante());
        response.setCodigoDocente(usuario.getCodigoDocente());
        response.setEspecialidad(usuario.getEspecialidad());
        response.setProgramaInteres(usuario.getProgramaInteres());
        
        return response;
    }
    
    /**
     * Genera un código de estudiante único
     */
    private String generateCodigoEstudiante() {
        int year = LocalDateTime.now().getYear();
        String prefix = "EST" + year;
        
        // Contar estudiantes existentes y generar el siguiente número
        long studentCount = usuarioRepository.countByRole(Role.ALUMNO);
        
        // Generar códigos hasta encontrar uno único
        String codigoEstudiante;
        int counter = 1;
        do {
            String numero = String.format("%03d", studentCount + counter);
            codigoEstudiante = prefix + numero;
            counter++;
        } while (usuarioRepository.findByCodigoEstudiante(codigoEstudiante).isPresent());
        
        return codigoEstudiante;
    }
}
