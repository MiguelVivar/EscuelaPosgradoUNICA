# 🎓 Sistema Académico - Escuela de Posgrado UNICA

Sistema académico integral desarrollado con arquitectura de microservicios para la **Universidad Nacional San Luis Gonzaga de Ica (UNICA)**. El sistema gestiona los procesos de matrícula e intranet académica para estudiantes y docentes de posgrado.

## 📋 Descripción General

Este proyecto implementa una solución completa para la gestión académica, dividida en módulos especializados:

### 🔐 **Sistema de Autenticación (✅ Completo)**
- Autenticación JWT con Spring Security 6
- Gestión de usuarios con 5 roles: ADMIN, DOCENTE, COORDINADOR, ALUMNO, POSTULANTE
- Endpoints especializados por rol con autorización granular
- Validaciones robustas y encriptación de contraseñas
- Base de datos con usuarios de demostración pre-configurados

### 🌐 **Sistema Frontend (✅ Completo)**
- Interfaz moderna con Next.js 15 y React 19
- Autenticación integrada con contexto React
- Campus Virtual protegido con middleware de Next.js
- Componentes UI avanzados con animaciones GSAP
- Formularios de login con validación en tiempo real

### 📚 **Sistema de Intranet (🚧 En desarrollo)**
- Portal interno para estudiantes y docentes
- Acceso a notas, asistencia y estado académico
- Dashboard personalizado por rol de usuario

### 🎓 **Sistema de Matrícula (🚧 En desarrollo)**
- Registro de estudiantes y gestión de períodos académicos
- Procesos de matrícula automatizados
- Gestión de programas de posgrado

## 🏗️ Arquitectura del Sistema

### Microservicios Implementados

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │  Autenticación  │    │    Matrícula    │
│  Next.js + React│◄──►│   (Port 8080)   │◄──►│   (Port 8082)   │
│   (Port 3000)   │    │    ✅ COMPLETO   │    │  🚧 EN DESARROLLO│
│   ✅ COMPLETO    │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌─────────────────┐              │
         └─────────────►│    Intranet     │◄─────────────┘
                        │   (Port 8081)   │
                        │  🚧 EN DESARROLLO│
                        └─────────────────┘
                                 │
                        ┌─────────────────┐
                        │   PostgreSQL    │
                        │   (Port 5432)   │
                        │  ✅ CONFIGURADO  │
                        │  Multi-Database │
                        └─────────────────┘
```

## 🚀 Estado Actual del Desarrollo

### ✅ **Completamente Implementado y Funcional**

#### **Frontend (Next.js 15 + React 19)**
- 🎨 **Interfaz Moderna**: Diseño responsivo con TailwindCSS 4
- 🔐 **Sistema de Login**: Formulario con validación en tiempo real
- 🌟 **Animaciones Avanzadas**: Implementadas con GSAP 3.13.0
- 🛡️ **Middleware de Autenticación**: Protección de rutas con Next.js
- 📱 **Campus Virtual**: Dashboard personalizado por rol de usuario
- 🎯 **Componentes UI**: Biblioteca completa de componentes reutilizables

#### **Microservicio de Autenticación (Spring Boot 3.5.3)**
- 🔑 **JWT Authentication**: Implementación completa con Spring Security 6
- 👥 **Gestión de Usuarios**: 5 roles diferentes con permisos granulares
- 🗃️ **Base de Datos**: PostgreSQL con esquema completo y datos de demo
- 🔒 **Seguridad Robusta**: Encriptación BCrypt, validaciones completas
- 📊 **Monitoreo**: Health checks y endpoints de estadísticas
- 🌐 **API REST Completa**: Documentada y lista para producción

#### **Roles Implementados y Funcionales**
- 👑 **ADMIN**: Gestión completa del sistema y usuarios
- 👨‍🏫 **DOCENTE**: Acceso a información de alumnos y colegas
- 👨‍💼 **COORDINADOR**: Gestión académica amplia
- 👨‍🎓 **ALUMNO**: Portal estudiantil con información personalizada
- 📝 **POSTULANTE**: Sistema de candidatos con seguimiento

### 🚧 **En Desarrollo**

#### **Microservicio de Intranet**
- 📚 Gestión de notas y calificaciones
- 📊 Sistema de asistencia
- 📑 Portal de recursos académicos
- 🎯 Dashboard específico por programa

#### **Microservicio de Matrícula**
- 🎓 Gestión de programas de posgrado
- 📋 Proceso de matrícula automatizado
- 📅 Gestión de períodos académicos
- 💰 Sistema de pagos y aranceles

### 🔮 **Funcionalidades Futuras**
- 🔗 Integración entre todos los microservicios
- 📱 Aplicación móvil nativa
- 📧 Sistema de notificaciones
- 📈 Dashboard de analytics
- 🤖 Chatbot de asistencia académica

## 🏗️ Arquitectura del Sistema

### Microservicios Implementados

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │  Autenticación  │    │    Matrícula    │
│  Next.js + React│◄──►│   (Port 8080)   │◄──►│   (Port 8082)   │
│   (Port 3000)   │    │    ✅ COMPLETO   │    │  🚧 EN DESARROLLO│
│   ✅ COMPLETO    │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌─────────────────┐              │
         └─────────────►│    Intranet     │◄─────────────┘
                        │   (Port 8081)   │
                        │  🚧 EN DESARROLLO│
                        └─────────────────┘
                                 │
                        ┌─────────────────┐
                        │   PostgreSQL    │
                        │   (Port 5432)   │
                        │  ✅ CONFIGURADO  │
                        │  Multi-Database │
                        └─────────────────┘
```

### 🚀 Estado Actual del Desarrollo

#### ✅ **Completamente Implementado**
- **Frontend Next.js**: Interfaz completa con autenticación
  - ✅ Página principal con carrusel interactivo
  - ✅ Sistema de login con validación en tiempo real
  - ✅ Campus Virtual protegido por middleware
  - ✅ Componentes UI modernos con animaciones GSAP
  - ✅ Integración completa con API de autenticación

- **Microservicio de Autenticación**: API REST completa
  - ✅ JWT Authentication con Spring Security 6
  - ✅ Gestión de usuarios con 5 roles diferentes
  - ✅ Endpoints CRUD completos por rol
  - ✅ Validaciones robustas y encriptación BCrypt
  - ✅ Health checks y monitoreo
  - ✅ Base de datos con datos de demostración

#### 🚧 **En Desarrollo**
- **Microservicio de Intranet**: Estructura base creada
- **Microservicio de Matrícula**: Estructura base creada
- **Integración entre microservicios**: Pendiente

### Tecnologías Utilizadas

#### Frontend (✅ **Implementado**)
- **Next.js 15.3.4** - Framework React full-stack
- **React 19.0.0** - Biblioteca principal para UI
- **TypeScript 5** - Tipado estático
- **TailwindCSS 4** - Framework CSS
- **GSAP 3.13.0** - Animaciones avanzadas
- **ESLint 9** - Linting con configuración Next.js

#### Backend (✅ **Microservicio de Autenticación Completo**)
- **Spring Boot 3.5.3** - Framework principal
- **Java 24** - Lenguaje de programación
- **Spring Security 6** - Autenticación y autorización
- **JWT (jjwt 0.12.6)** - Tokens de autenticación
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
│   ├── 📁 Autenticacion/          # ✅ Microservicio de autenticación (COMPLETO)
│   │   ├── Dockerfile
│   │   ├── pom.xml
│   │   ├── README.md              # Documentación detallada del microservicio
│   │   └── src/main/java/com/escuelaposgrado/Autenticacion/
│   │       ├── 📁 config/         # Configuraciones de seguridad y datos iniciales
│   │       ├── 📁 controller/     # Controladores REST por rol
│   │       ├── 📁 dto/           # DTOs para requests y responses
│   │       ├── 📁 model/         # Entidades JPA y enums
│   │       ├── 📁 repository/    # Repositorios JPA
│   │       ├── 📁 security/      # JWT, filtros y configuración de seguridad
│   │       └── 📁 service/       # Lógica de negocio
│   ├── 📁 Matricula/              # 🚧 Microservicio de matrícula (EN DESARROLLO)
│   │   ├── Dockerfile
│   │   ├── pom.xml
│   │   └── src/main/java/com/escuelaposgrado/Matricula/
│   └── 📁 Intranet/               # 🚧 Microservicio de intranet (EN DESARROLLO)
│       ├── Dockerfile
│       ├── pom.xml
│       └── src/main/java/com/escuelaposgrado/Intranet/
├── 📁 frontend/                   # ✅ Aplicación Next.js (COMPLETO)
│   ├── Dockerfile
│   ├── package.json
│   ├── next.config.ts
│   ├── middleware.ts              # Protección de rutas
│   └── src/
│       ├── 📁 app/               # App Router de Next.js 15
│       │   ├── 📁 iniciar-sesion/ # Página de login
│       │   └── 📁 campus-virtual/ # Dashboard protegido
│       ├── 📁 components/         # Componentes React reutilizables
│       │   ├── 📁 ui/login/      # Componentes específicos de login
│       │   └── 📁 layout/        # Layouts y navegación
│       ├── 📁 contexts/          # React Context para autenticación
│       ├── 📁 services/          # Servicios para APIs
│       ├── 📁 types/             # Tipos TypeScript
│       └── 📁 hooks/             # Hooks personalizados
├── 📁 db/                         # ✅ Scripts de base de datos
│   └── init-multiple-databases.sh # Script de inicialización multi-DB
├── 📁 pgadmin/                    # Configuración de PgAdmin
├── docker-compose.yml             # ✅ Orquestación completa de servicios
└── README.md                      # Este archivo
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

| Servicio | URL | Puerto | Descripción | Estado |
|----------|-----|--------|-------------|--------|
| Frontend | http://localhost:3000 | 3000 | Aplicación Next.js | ✅ **Completo** |
| Autenticación | http://localhost:8080 | 8080 | API de autenticación | ✅ **Completo** |
| Intranet | http://localhost:8081 | 8081 | API de intranet | 🚧 **En desarrollo** |
| Matrícula | http://localhost:8082 | 8082 | API de matrícula | 🚧 **En desarrollo** |
| PostgreSQL |  http://localhost:5432 | 5432 | Base de datos | ✅ **Configurado** |

### 🔑 Credenciales de DEMO

El sistema incluye usuarios de demostración listos para usar:

| Rol | Usuario | Contraseña | Email | Descripción |
|-----|---------|------------|-------|-------------|
| **ADMIN** | `admin` | `admin123` | admin@unica.edu.pe | Administrador del sistema |
| **DOCENTE** | `docente.demo` | `docente123` | docente.demo@unica.edu.pe | Profesor de ejemplo |
| **COORDINADOR** | `coordinador.demo` | `coordinador123` | coordinador.demo@unica.edu.pe | Coordinador académico |
| **ALUMNO** | `alumno.demo` | `alumno123` | alumno.demo@unica.edu.pe | Estudiante de maestría |
| **POSTULANTE** | `postulante.demo` | `postulante123` | postulante.demo@gmail.com | Candidato a ingreso |

### 🔗 Acceso al Sistema

1. **Frontend Web**: http://localhost:3000
2. **Iniciar Sesión**: http://localhost:3000/iniciar-sesion
3. **Campus Virtual**: http://localhost:3000/campus-virtual (requiere autenticación)

### Health Checks

Cada microservicio incluye endpoints de salud:

- `GET /actuator/health` - Estado del servicio
- `GET /actuator/info` - Información del servicio
- `GET /api/health/status` - Estado básico del microservicio
- `GET /api/health/check` - Verificación completa (DB + servicio)

## 🔧 Desarrollo Local

### Frontend (✅ Completamente Funcional)

```bash
cd frontend
pnpm install
pnpm dev
```

**Características implementadas:**
- ✅ Página principal con carrusel de programas
- ✅ Sistema de login con validación de correo institucional
- ✅ Campus Virtual con dashboard por rol
- ✅ Middleware de autenticación
- ✅ Componentes UI modernos con animaciones

### Backend - Microservicio de Autenticación (✅ Completo)

```bash
cd backend/Autenticacion
./mvnw spring-boot:run
```

**Endpoints disponibles:**
- ✅ `POST /api/auth/login` - Iniciar sesión
- ✅ `POST /api/auth/registro` - Registrar usuario
- ✅ `GET /api/auth/me` - Información del usuario actual
- ✅ `GET /api/admin/*` - Endpoints administrativos
- ✅ `GET /api/docente/*` - Endpoints para docentes
- ✅ `GET /api/alumno/*` - Endpoints para alumnos
- ✅ `GET /api/coordinador/*` - Endpoints para coordinadores
- ✅ `GET /api/postulante/*` - Endpoints para postulantes

### Backend - Otros Microservicios (🚧 En desarrollo)

```bash
# Microservicio de Intranet
cd backend/Intranet
./mvnw spring-boot:run

# Microservicio de Matrícula  
cd backend/Matricula
./mvnw spring-boot:run
```

**Estado:** Estructura base creada, pendiente implementación de lógica de negocio.

## 🗄️ Base de Datos

### Configuración Multi-Database (✅ Implementado)

El sistema utiliza PostgreSQL con múltiples bases de datos especializadas:

- `autenticacion` - ✅ **Completo**: Usuarios, roles, sesiones y permisos
- `matricula` - 🚧 **Preparado**: Estudiantes, programas y procesos de matrícula  
- `intranet` - 🚧 **Preparado**: Notas, asistencia y contenido académico

### Esquema de la Base de Datos de Autenticación

```sql
-- ✅ Tabla usuarios implementada y funcionando
CREATE TABLE usuarios (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    nombres VARCHAR(100) NOT NULL,
    apellido_paterno VARCHAR(100) NOT NULL,
    apellido_materno VARCHAR(100),
    dni VARCHAR(8),
    telefono VARCHAR(15),
    rol VARCHAR(20) NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT true,
    fecha_creacion TIMESTAMP NOT NULL,
    fecha_actualizacion TIMESTAMP,
    ultimo_acceso TIMESTAMP,
    codigo_estudiante VARCHAR(20), -- Para ALUMNO y POSTULANTE
    codigo_docente VARCHAR(20),    -- Para DOCENTE y COORDINADOR
    especialidad VARCHAR(100),      -- Para DOCENTE y COORDINADOR
    programa_interes VARCHAR(100)   -- Para POSTULANTE
);
```

### Script de Inicialización

El archivo `db/init-multiple-databases.sh` configura automáticamente las bases de datos necesarias al levantar PostgreSQL con Docker.

### Datos de Demostración Pre-cargados

El sistema incluye **DataInitializer** que crea automáticamente:
- ✅ 1 usuario administrador
- ✅ 1 docente de ejemplo  
- ✅ 1 coordinador de ejemplo
- ✅ 1 alumno de ejemplo
- ✅ 1 postulante de ejemplo

## 🛠️ Comandos de Desarrollo

### Frontend (Next.js)
```bash
pnpm dev          # Servidor de desarrollo con Turbopack (http://localhost:3000)
pnpm build        # Build de producción optimizado
pnpm start        # Servidor de producción
pnpm lint         # Análisis de código con ESLint 9
pnpm type-check   # Verificación de tipos TypeScript
```

### Backend - Microservicio de Autenticación
```bash
./mvnw spring-boot:run        # Ejecutar aplicación (http://localhost:8080)
./mvnw clean compile          # Compilar código
./mvnw test                   # Ejecutar tests unitarios e integración
./mvnw clean package          # Crear JAR ejecutable
```

### Docker - Orquestación Completa
```bash
docker-compose up -d          # Levantar todos los servicios en segundo plano
docker-compose down           # Detener y remover contenedores
docker-compose logs -f        # Ver logs en tiempo real de todos los servicios
docker-compose build          # Reconstruir imágenes Docker
docker-compose ps             # Estado de los contenedores
```

### Testing y Validación
```bash
# Verificar autenticación
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"usernameOrEmail": "admin", "password": "admin123"}'

# Health check de servicios
curl http://localhost:8080/api/health/status
curl http://localhost:3000/api/health
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
![JWT](https://img.shields.io/badge/JWT-Auth-orange)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-teal)

### 🏆 Proyecto Académico de Excelencia
**Universidad Nacional San Luis Gonzaga de Ica (UNICA)**  
**Escuela de Posgrado - Ingeniería de Sistemas**

[![Estado](https://img.shields.io/badge/Estado-En%20Desarrollo%20Activo-success)](https://github.com/tu-repositorio)
[![Licencia](https://img.shields.io/badge/Licencia-Académica-informational)](LICENSE)
[![Documentación](https://img.shields.io/badge/Docs-Completa-blue)](backend/Autenticacion/README.md)

</div>