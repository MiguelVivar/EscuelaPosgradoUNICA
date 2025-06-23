# 🎓 Sistema Académico - Escuela de Posgrado UNICA

Sistema académico integral desarrollado con arquitectura de microservicios para la **Universidad Nacional San Luis Gonzaga de Ica (UNICA)**. El sistema gestiona los procesos de matrícula e intranet académica para estudiantes y docentes de posgrado.

## 📋 Descripción General

Este proyecto implementa una solución completa para la gestión académica, dividida en dos módulos principales:

- **Sistema de Matrícula**: Registro de estudiantes, gestión de períodos académicos y procesos de matrícula
- **Sistema de Intranet**: Portal interno para estudiantes y docentes con acceso a notas, asistencia y estado académico

## 🏗️ Arquitectura del Sistema

### Microservicios Implementados

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │  Autenticación  │    │    Matrícula    │
│  Next.js + React│◄──►│   (Port 8080)   │◄──►│   (Port 8082)   │
│   (Port 3000)   │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌─────────────────┐              │
         └─────────────►│    Intranet     │◄─────────────┘
                        │   (Port 8081)   │
                        └─────────────────┘
                                 │
                        ┌─────────────────┐
                        │   PostgreSQL    │
                        │   (Port 5432)   │
                        │  Multi-Database │
                        └─────────────────┘
```

### Tecnologías Utilizadas

#### Frontend
- **Next.js 15.3.4** - Framework React full-stack
- **React 19.0.0** - Biblioteca principal para UI
- **TypeScript 5** - Tipado estático
- **TailwindCSS 4** - Framework CSS
- **GSAP 3.13.0** - Animaciones
- **ESLint 9** - Linting con configuración Next.js

#### Backend
- **Spring Boot 3.5.3** - Framework principal
- **Java 24** - Lenguaje de programación
- **Spring Security** - Autenticación y autorización
- **Spring Data JPA** - Persistencia de datos
- **PostgreSQL 17.5** - Base de datos
- **Maven** - Gestión de dependencias
- **Docker** - Containerización

#### DevOps & Herramientas
- **Docker Compose** - Orquestación de contenedores
- **PostgreSQL Multi-Database** - Separación de esquemas por microservicio
- **Health Checks** - Monitoreo de servicios
- **Maven Wrapper** - Gestión de build consistente

## 📁 Estructura del Proyecto

```
escuela_posgrado/
├── 📁 backend/
│   ├── 📁 Autenticacion/          # Microservicio de autenticación
│   │   ├── Dockerfile
│   │   ├── pom.xml
│   │   └── src/main/java/com/escuelaposgrado/Autenticacion/
│   ├── 📁 Matricula/              # Microservicio de matrícula
│   │   ├── Dockerfile
│   │   ├── pom.xml
│   │   └── src/main/java/com/escuelaposgrado/Matricula/
│   └── 📁 Intranet/               # Microservicio de intranet
│       ├── Dockerfile
│       ├── pom.xml
│       └── src/main/java/com/escuelaposgrado/Intranet/
├── 📁 frontend/                   # Aplicación Next.js
│   ├── Dockerfile
│   ├── package.json
│   ├── next.config.ts
│   └── src/
├── 📁 db/                         # Scripts de base de datos
│   └── init-multiple-databases.sh
├── docker-compose.yml             # Orquestación de servicios
└── README.md
```

## 🚀 Instalación y Configuración

### Prerrequisitos

- **Docker** y **Docker Compose**
- **Node.js 18+** y **pnpm** (para desarrollo local)
- **Java 24** y **Maven** (para desarrollo local)
- **PostgreSQL 17+** (para desarrollo local)

### 🐳 Despliegue con Docker Compose (Recomendado)

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd escuela_posgrado
   ```

2. **Levantar todos los servicios**
   ```bash
   docker-compose up -d
   ```

3. **Verificar el estado de los servicios**
   ```bash
   docker-compose ps
   ```

### Servicios Disponibles

| Servicio | URL | Puerto | Descripción |
|----------|-----|--------|-------------|
| Frontend | http://localhost:3000 | 3000 | Aplicación Next.js |
| Autenticación | http://localhost:8080 | 8080 | API de autenticación |
| Intranet | http://localhost:8081 | 8081 | API de intranet |
| Matrícula | http://localhost:8082 | 8082 | API de matrícula |
| PostgreSQL |  http://localhost:5432 | 5432 | Base de datos |

### Health Checks

Cada microservicio incluye endpoints de salud:

- `GET /actuator/health` - Estado del servicio
- `GET /actuator/info` - Información del servicio

## 🔧 Desarrollo Local

### Frontend

```bash
cd frontend
pnpm install
pnpm dev
```

### Backend (cada microservicio)

```bash
# Ejemplo para el servicio de Autenticación
cd backend/Autenticacion
./mvnw spring-boot:run

# O usando Maven directamente
mvn spring-boot:run
```

## 🗄️ Base de Datos

### Configuración Multi-Database

El sistema utiliza PostgreSQL con múltiples bases de datos:

- `autenticacion` - Usuarios, roles y sesiones
- `matricula` - Estudiantes, programas y matrículas
- `intranet` - Notas, asistencia y contenido académico

### Script de Inicialización

El archivo `db/init-multiple-databases.sh` configura automáticamente las bases de datos necesarias al levantar PostgreSQL con Docker.

## 🛠️ Comandos de Desarrollo

### Frontend
```bash
pnpm dev          # Servidor de desarrollo (con Turbopack)
pnpm build        # Build de producción
pnpm start        # Servidor de producción
pnpm lint         # Análisis de código con ESLint
```

### Backend
```bash
./mvnw spring-boot:run        # Ejecutar aplicación
./mvnw clean compile          # Compilar código
./mvnw test                   # Ejecutar tests
./mvnw clean package          # Crear JAR
```

### Docker
```bash
docker-compose up -d          # Levantar servicios
docker-compose down           # Detener servicios
docker-compose logs -f        # Ver logs en tiempo real
docker-compose build          # Reconstruir imágenes
```

## 👥 Equipo de Desarrollo

Este proyecto fue desarrollado por un equipo de 7 integrantes:

**Facultad**: Ingeniería de Sistemas  
**Curso**: Lenguaje de Programación Avanzada  
**Ciclo**: 4to

| Desarrollador | GitHub |
|---------------|--------|
| Miguel Vivar | [@MiguelVivar](https://github.com/MiguelVivar) |
| Mario Muñoz | [@ChuchiPr](https://github.com/ChuchiPr) |
| Angelina Soto | [@VinnBon](https://github.com/VinnBon) |
| Luis Mitma | [@Elextranjero1942](https://github.com/Elextranjero1942) |
| Juan Ttito | [@juanttito1003](https://github.com/juanttito1003) |
| Rodrigo Conislla | [@Rodri25](https://github.com/Rodricrak25) |
| Dylan Palomino | [@DaPcxD](https://github.com/DaPcxD) |


### Metodología de Trabajo
- **Control de versiones**: Git con GitFlow
- **Comunicación**: Daily standups
- **Desarrollo**: Feature branches + Pull Requests
- **Testing**: Unit tests + Integration tests
- **Deployment**: Containerización con Docker

## 🤝 Contribución

Para contribuir al proyecto:

1. Fork del repositorio
2. Crear feature branch (`git checkout -b feature/nueva-funcionalidad`)
3. Commit de cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📄 Licencia

Este proyecto está desarrollado para uso académico de la Universidad Nacional San Luis Gonzaga de Ica.

## 🏫 Institución

**Universidad Nacional San Luis Gonzaga de Ica (UNICA)**  
Escuela de Posgrado  
Ica, Perú

---

<div align="center">

**Desarrollado con ❤️ para la comunidad académica de la UNICA**

![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.3-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-15.3.4-black)
![React](https://img.shields.io/badge/React-19.0.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17.5-blue)
![Docker](https://img.shields.io/badge/Docker-Compose-blue)

</div>