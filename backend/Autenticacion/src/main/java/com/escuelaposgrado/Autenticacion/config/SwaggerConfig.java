package com.escuelaposgrado.Autenticacion.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

/**
 * Configuración de Swagger/OpenAPI para el microservicio de autenticación
 */
@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI()
                .info(apiInfo())
                .servers(List.of(
                        new Server()
                                .url("http://localhost:8080")
                                .description("Servidor de desarrollo"),
                        new Server()
                                .url("http://localhost:8080")
                                .description("Servidor de producción")
                ))
                .addSecurityItem(new SecurityRequirement().addList("bearerAuth"))
                .components(
                        new Components()
                                .addSecuritySchemes("bearerAuth",
                                        new SecurityScheme()
                                                .type(SecurityScheme.Type.HTTP)
                                                .scheme("bearer")
                                                .bearerFormat("JWT")
                                                .in(SecurityScheme.In.HEADER)
                                                .name("Authorization")
                                )
                );
    }

    private Info apiInfo() {
        return new Info()
                .title("🔐 Microservicio de Autenticación - Escuela de Posgrado UNICA")
                .description("""
                        Sistema de autenticación y autorización para la Escuela de Posgrado de la Universidad Nacional San Luis Gonzaga de Ica.
                        
                        ## Funcionalidades Principales:
                        - ✅ Autenticación de usuarios con JWT
                        - ✅ Registro de usuarios con diferentes roles
                        - ✅ Gestión de perfiles por rol
                        - ✅ Endpoints específicos por rol
                        - ✅ Health checks y monitoreo
                        
                        ## Roles Disponibles:
                        - **ADMIN**: Administrador del sistema
                        - **COORDINADOR**: Coordinador académico
                        - **DOCENTE**: Docente de la escuela
                        - **ALUMNO**: Estudiante activo
                        - **POSTULANTE**: Candidato a ingreso
                        
                        ## Autenticación:
                        Para usar los endpoints protegidos, incluye el token JWT en el header:
                        ```
                        Authorization: Bearer <tu-jwt-token>
                        ```
                        
                        ## Tecnologías:
                        - Spring Boot 3.5.3
                        - Spring Security 6
                        - JWT (jjwt 0.12.6)
                        - PostgreSQL
                        - Spring Data JPA
                        """)
                .version("1.0.0")
                .contact(new Contact()
                        .name("Escuela de Posgrado UNICA")
                        .email("posgrado@unica.edu.pe")
                        .url("https://www.unica.edu.pe/posgrado"))
                .license(new License()
                        .name("MIT License")
                        .url("https://opensource.org/licenses/MIT"));
    }
}
