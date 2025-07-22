package com.escuelaposgrado.Intranet;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.transaction.annotation.EnableTransactionManagement;

/**
 * Clase principal de la aplicación Intranet
 * Sistema de gestión académica para la Escuela de Posgrado de la UNICA
 */
@SpringBootApplication
@EnableJpaAuditing
@EnableTransactionManagement
public class IntranetApplication {

	public static void main(String[] args) {
		SpringApplication.run(IntranetApplication.class, args);
		
		System.out.println("\n" +
			"===========================================\n" +
			"    INTRANET ESCUELA DE POSGRADO UNICA   \n" +
			"===========================================\n" +
			"✅ Aplicación iniciada correctamente\n" +
			"🌐 Swagger UI: http://localhost:8081/swagger-ui.html\n" +
			"📊 Actuator: http://localhost:8081/actuator\n" +
			"🔑 API Base: http://localhost:8081/api\n" +
			"🏥 Health Check: http://localhost:8081/health\n" +
			"===========================================\n"
		);
	}
}
