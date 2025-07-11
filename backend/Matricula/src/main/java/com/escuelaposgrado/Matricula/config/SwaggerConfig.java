package com.escuelaposgrado.Matricula.config;

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
 * Configuración de Swagger/OpenAPI para el microservicio de Matrícula
 */
@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("📚 Microservicio de Matrícula - Escuela de Posgrado UNICA")
                        .description("""
                            **Sistema de Gestión de Matrícula para la Escuela de Posgrado**
                            
                            Este microservicio gestiona todos los aspectos relacionados con la matrícula académica:
                            
                            ## 🎯 Funcionalidades Principales:
                            - **Períodos Académicos**: Gestión de períodos y habilitación para matrícula
                            - **Sedes y Aulas**: Administración de infraestructura educativa
                            - **Facultades**: Gestión de facultades y sus programas
                            - **Programas de Estudio**: Administración de programas académicos
                            - **Menciones**: Gestión de menciones por programa
                            - **Tasas de Pago**: Configuración de costos por programa
                            - **Comisiones**: Registro de comisiones de unidades de posgrado
                            - **Turnos de Matrícula**: Definición de calendarios de matrícula
                            
                            ## 🔐 Autenticación:
                            - Tokens JWT del microservicio de autenticación
                            - Roles: ADMIN, COORDINADOR
                            
                            ## 📋 Versión: 1.0.0
                            """)
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Equipo de Desarrollo UNICA")
                                .email("soporte@unica.edu.pe")
                                .url("https://www.unica.edu.pe"))
                        .license(new License()
                                .name("MIT License")
                                .url("https://opensource.org/licenses/MIT")))
                .servers(List.of(
                        new Server()
                                .url("http://localhost:8082")
                                .description("🛠️ Servidor de Desarrollo"),
                        new Server()
                                .url("https://api.posgrado.unica.edu.pe")
                                .description("🚀 Servidor de Producción")))
                .addSecurityItem(new SecurityRequirement().addList("Bearer Authentication"))
                .components(new Components()
                        .addSecuritySchemes("Bearer Authentication",
                                new SecurityScheme()
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                        .description("Ingrese el token JWT en el formato: Bearer {token}")));
    }
}
