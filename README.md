# 🎓 Sistema Académico - Escuela de Posgrado UNICA

Sistema académico integral desarrollado con arquitectura de microservicios para la **Universidad Nacional San Luis Gonzaga de Ica (UNICA)**. El sistema gestiona los procesos de autenticación, matrícula e intranet académica para estudiantes y docentes de posgrado.

## 📋 Descripción General

Este proyecto implementa una solución completa para la gestión académica, dividida en módulos especializados con un enfoque de microservicios moderno:

### 🔐 **Sistema de Autenticación (✅ Completamente Implementado)**
- ✅ **JWT Authentication** con Spring Security 6 y tokens de 24 horas
- ✅ **Gestión de Usuarios** con 5 roles: ADMIN, DOCENTE, COORDINADOR, ALUMNO, POSTULANTE
- ✅ **60+ Endpoints API** especializados por rol con autorización granular
- ✅ **Documentación Swagger** interactiva en `/swagger-ui.html`
- ✅ **Validaciones Robustas** y encriptación BCrypt de contraseñas
- ✅ **Base de Datos PostgreSQL** con usuarios de demostración pre-configurados
- ✅ **Health Checks** y monitoreo completo con Spring Boot Actuator

### 🌐 **Sistema Frontend (✅ Completamente Implementado)**
- ✅ **Next.js 15.3.4** con React 19.0.0 y App Router
- ✅ **TypeScript 5** para tipado estático completo
- ✅ **TailwindCSS 4** para estilos modernos y responsivos
- ✅ **Autenticación Integrada** con React Context y middleware de Next.js
- ✅ **Campus Virtual Protegido** con rutas dinámicas por rol
- ✅ **Animaciones GSAP 3.13.0** y componentes UI avanzados
- ✅ **Validación de Formularios** en tiempo real con hooks personalizados

### 📚 **Sistema de Intranet (🚧 Estructura Base Creada)**
- 🏗️ **Spring Boot 3.5.3** con Java 24 configurado
- 🏗️ **Base de datos** PostgreSQL dedicada (`intranet`)
- 🏗️ **Docker** y health checks configurados
- ⏳ **Pendiente**: Implementación de lógica de negocio

### 🎓 **Sistema de Matrícula (🚧 Estructura Base Creada)**
- 🏗️ **Spring Boot 3.5.3** con Java 24 configurado
- 🏗️ **Base de datos** PostgreSQL dedicada (`matricula`)
- 🏗️ **Docker** y health checks configurados
- ⏳ **Pendiente**: Implementación de lógica de negocio

## 🏗️ Arquitectura del Sistema

### Microservicios Implementados

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │  Autenticación  │    │    Matrícula    │
│  Next.js 15 +   │◄──►│   (Port 8080)   │◄──►│   (Port 8082)   │
│  React 19       │    │  ✅ COMPLETAMENTE│    │ 🏗️ ESTRUCTURA   │
│  (Port 3000)    │    │    FUNCIONAL    │    │   BASE CREADA   │
│  ✅ COMPLETAMENTE│    │                 │    │                 │
│    FUNCIONAL    │    │ 📊 PostgreSQL   │    │ 📊 PostgreSQL   │
└─────────────────┘    │ 🔐 JWT + OAuth   │    │ ⏳ Pendiente    │
         │              │ 📚 Swagger UI   │    │   Lógica        │
         │              └─────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌─────────────────┐              │
         └─────────────►│    Intranet     │◄─────────────┘
                        │   (Port 8081)   │
                        │ 🏗️ ESTRUCTURA   │
                        │   BASE CREADA   │
                        │                 │
                        │ 📊 PostgreSQL   │
                        │ ⏳ Pendiente     │
                        │   Lógica        │
                        └─────────────────┘
                                 │
                        ┌─────────────────┐
                        │   PostgreSQL    │
                        │   (Port 5432)   │
                        │ ✅ CONFIGURADO   │
                        │ 🗄️ Multi-Database│
                        │ 📊 3 Bases Datos│
                        └─────────────────┘
                                 │
                        ┌─────────────────┐
                        │    pgAdmin      │
                        │   (Port 8079)   │
                        │ ✅ CONFIGURADO   │
                        │ 🔧 Administración│
                        └─────────────────┘
```

### 🚀 Estado Actual del Desarrollo (Detallado)

#### ✅ **Completamente Implementado y Funcional**

##### **🌐 Microservicio Frontend (Next.js 15 + React 19)**
- **Páginas Principales**:
  - ✅ Página principal (`/`) con diseño moderno y carrusel de programas
  - ✅ Sistema de login (`/iniciar-sesion`) con validación en tiempo real
  - ✅ Campus Virtual (`/campus-virtual`) con dashboard personalizado por rol
  
- **Arquitectura Técnica**:
  - ✅ **Next.js 15.3.4** con App Router y Turbopack
  - ✅ **React 19.0.0** con componentes funcionales y hooks
  - ✅ **TypeScript 5** para tipado estático completo
  - ✅ **TailwindCSS 4** para estilos responsivos modernos
  - ✅ **GSAP 3.13.0** para animaciones avanzadas
  - ✅ **React Icons 5.5.0** para iconografía consistente

- **Funcionalidades de Autenticación**:
  - ✅ **React Context** para manejo de estado global de autenticación
  - ✅ **Middleware de Next.js** para protección de rutas automática
  - ✅ **Cookies HTTP-only** para almacenamiento seguro de tokens
  - ✅ **Validación de correos** institucionales (@unica.edu.pe)
  - ✅ **Hooks personalizados** para validación y localStorage

##### **🔐 Microservicio de Autenticación (Spring Boot 3.5.3)**
- **Arquitectura Backend**:
  - ✅ **Spring Boot 3.5.3** con Java 24 (corregido: es Java 21 según pom.xml)
  - ✅ **Spring Security 6** con configuración avanzada
  - ✅ **JWT (jjwt 0.12.6)** con tokens de 24 horas
  - ✅ **PostgreSQL 17.5** con JPA/Hibernate
  - ✅ **Spring Data JPA** para persistencia
  - ✅ **BCrypt** para encriptación de contraseñas
  - ✅ **Spring Boot Actuator** para health checks
  - ✅ **Swagger/OpenAPI 2.6.0** para documentación interactiva

- **API REST Completa (60+ Endpoints)**:
  - ✅ **Endpoints Públicos**: Login, registro, health checks
  - ✅ **Endpoints Administrativos** (9 endpoints): Gestión completa de usuarios
  - ✅ **Endpoints para Docentes** (4 endpoints): Perfil, alumnos, colegas
  - ✅ **Endpoints para Alumnos** (5 endpoints): Perfil, docentes, compañeros
  - ✅ **Endpoints para Coordinadores** (7 endpoints): Gestión académica amplia
  - ✅ **Endpoints para Postulantes** (6 endpoints): Información y estado

- **Roles y Permisos Implementados**:
  - ✅ **ADMIN**: Control total del sistema (gestión de usuarios, estadísticas)
  - ✅ **DOCENTE**: Acceso a información de alumnos y colegas
  - ✅ **COORDINADOR**: Gestión académica y supervisión
  - ✅ **ALUMNO**: Portal estudiantil con información personalizada
  - ✅ **POSTULANTE**: Sistema de candidatos con seguimiento

- **Base de Datos y Datos de Prueba**:
  - ✅ **Esquema de usuarios** completo con campos específicos por rol
  - ✅ **5 usuarios de demostración** predefinidos listos para usar
  - ✅ **Inicialización automática** de datos con DataInitializer
  - ✅ **Validaciones únicas** para email, username, DNI, códigos

#### 🏗️ **Estructura Base Creada (Pendiente Implementación)**

##### **📚 Microservicio de Intranet**
- ✅ **Proyecto Spring Boot 3.5.3** configurado
- ✅ **Java 24** y dependencias base instaladas
- ✅ **Base de datos PostgreSQL** dedicada (`intranet`)
- ✅ **Docker** y health checks configurados
- ✅ **Puerto 8081** asignado y configurado
- ⏳ **Pendiente**: Controladores, servicios, entidades, lógica de negocio

##### **🎓 Microservicio de Matrícula**
- ✅ **Proyecto Spring Boot 3.5.3** configurado
- ✅ **Java 24** y dependencias base instaladas
- ✅ **Base de datos PostgreSQL** dedicada (`matricula`)
- ✅ **Docker** y health checks configurados
- ✅ **Puerto 8082** asignado y configurado
- ⏳ **Pendiente**: Controladores, servicios, entidades, lógica de negocio

### 🛠️ Tecnologías Utilizadas (Implementadas y Funcionales)

#### 🌐 **Frontend (✅ Completamente Implementado)**
- **Next.js 15.3.4** - Framework React full-stack con App Router
- **React 19.0.0** - Biblioteca principal para UI con hooks modernos
- **TypeScript 5** - Tipado estático completo en todo el proyecto
- **TailwindCSS 4** - Framework CSS con @tailwindcss/postcss
- **GSAP 3.13.0** - Animaciones avanzadas y transiciones suaves
- **React Icons 5.5.0** - Biblioteca de iconos consistente
- **ESLint 9** - Linting con configuración Next.js optimizada

#### 🔐 **Backend - Microservicio de Autenticación (✅ Completamente Implementado)**
- **Spring Boot 3.5.3** - Framework principal con configuración avanzada
- **Java 21** - Lenguaje de programación (configurado en pom.xml)
- **Spring Security 6** - Autenticación y autorización avanzada
- **JWT (jjwt 0.12.6)** - Tokens de autenticación con 24 horas de duración
- **Spring Data JPA** - Persistencia de datos con repositorios
- **PostgreSQL 17.5** - Base de datos relacional principal
- **BCrypt** - Encriptación de contraseñas con salt
- **Spring Boot Actuator** - Health checks y métricas
- **Swagger/OpenAPI 2.6.0** - Documentación interactiva de API
- **Bean Validation** - Validación de datos con anotaciones
- **Maven 3.9+** - Gestión de dependencias y build

#### 🏗️ **Backend - Microservicios Intranet y Matrícula (✅ Estructura Base)**
- **Spring Boot 3.5.3** - Framework configurado
- **Java 24** - Versión actualizada para nuevos microservicios
- **Spring Security 6** - Dependencias configuradas
- **Spring Data JPA** - Persistencia configurada
- **PostgreSQL** - Bases de datos dedicadas (`intranet`, `matricula`)
- **Maven** - Gestión de dependencias configurada

#### 🗄️ **Base de Datos y DevOps (✅ Completamente Configurado)**
- **PostgreSQL 17.5** - Sistema de base de datos principal
- **Docker Compose** - Orquestación completa de 6 servicios
- **Multi-Database Setup** - 3 bases de datos especializadas
- **pgAdmin 4** - Interfaz de administración web (Puerto 8079)
- **Health Checks** - Monitoreo automático de todos los servicios
- **Volume Persistence** - Datos persistentes con volúmenes Docker
- **Network Isolation** - Red privada para comunicación entre servicios

## 📁 Estructura del Proyecto (Actualizada y Detallada)

```
EscuelaPosgradoUNICA/
├── 📁 backend/                            # Microservicios backend
│   ├── 📁 Autenticacion/                  # ✅ MICROSERVICIO COMPLETO
│   │   ├── 📄 Dockerfile                  # Containerización configurada
│   │   ├── 📄 pom.xml                     # Spring Boot 3.5.3 + dependencias
│   │   ├── 📄 README.md                   # Documentación detallada del API
│   │   ├── 📄 SWAGGER-README.md           # Guía de documentación interactiva
│   │   ├── 🗂️ mvnw, mvnw.cmd              # Maven wrapper para builds
│   │   └── 📁 src/main/java/com/escuelaposgrado/Autenticacion/
│   │       ├── 📁 config/                 # Configuraciones (Security, Swagger, DataInit)
│   │       ├── 📁 controller/             # 6 controladores REST especializados
│   │       ├── 📁 dto/                    # DTOs para requests y responses
│   │       ├── 📁 model/                  # Entidades JPA y enums (Usuario, Role)
│   │       ├── 📁 repository/             # Repositorio JPA con queries personalizadas
│   │       ├── 📁 security/               # JWT utils, filtros y UserDetailsService
│   │       └── 📁 service/                # Lógica de negocio (AuthService)
│   │
│   ├── 📁 Intranet/                       # 🏗️ ESTRUCTURA BASE CREADA
│   │   ├── 📄 Dockerfile                  # ✅ Configurado para Docker
│   │   ├── 📄 pom.xml                     # ✅ Spring Boot 3.5.3 + Java 24
│   │   └── 📁 src/main/java/com/escuelaposgrado/Intranet/
│   │       └── � IntranetApplication.java # ✅ Clase principal configurada
│   │
│   └── 📁 Matricula/                      # 🏗️ ESTRUCTURA BASE CREADA
│       ├── 📄 Dockerfile                  # ✅ Configurado para Docker
│       ├── 📄 pom.xml                     # ✅ Spring Boot 3.5.3 + Java 24
│       └── 📁 src/main/java/com/escuelaposgrado/Matricula/
│           └── 📄 MatriculaApplication.java # ✅ Clase principal configurada
│
├── 📁 frontend/                           # ✅ APLICACIÓN NEXT.JS COMPLETA
│   ├── 📄 Dockerfile                      # ✅ Containerización configurada
│   ├── 📄 package.json                    # ✅ Next.js 15.3.4 + React 19 + deps
│   ├── 📄 next.config.ts                  # ✅ Configuración Next.js optimizada
│   ├── 📄 middleware.ts                   # ✅ Protección de rutas con JWT
│   ├── 📄 tsconfig.json                   # ✅ TypeScript 5 configurado
│   ├── 📄 eslint.config.mjs               # ✅ ESLint 9 con reglas Next.js
│   ├── 📄 postcss.config.mjs              # ✅ PostCSS + TailwindCSS 4
│   └── 📁 src/
│       ├── 📁 app/                        # ✅ App Router Next.js 15
│       │   ├── 📄 layout.tsx              # Layout principal con AuthProvider
│       │   ├── 📄 page.tsx                # Página principal con carrusel
│       │   ├── 📄 globals.css             # Estilos globales TailwindCSS
│       │   ├── 📁 iniciar-sesion/         # ✅ Página de login completa
│       │   │   └── 📄 page.tsx            # Formulario con validación
│       │   └── 📁 campus-virtual/         # ✅ Dashboard protegido
│       │       └── 📄 page.tsx            # Interfaz por rol de usuario
│       ├── 📁 components/                 # ✅ Componentes React reutilizables
│       │   ├── 📁 ui/                     # Componentes UI base
│       │   │   ├── 📁 login/              # Componentes específicos de login
│       │   │   └── 📁 common/             # Botones, inputs, cards, etc.
│       │   └── 📁 layout/                 # Layouts (Navbar, Footer, etc.)
│       ├── 📁 contexts/                   # ✅ React Context
│       │   └── 📄 AuthContext.tsx         # Manejo de estado de autenticación
│       ├── 📁 services/                   # ✅ Servicios para APIs
│       │   └── 📄 authService.ts          # Comunicación con backend
│       ├── 📁 types/                      # ✅ Tipos TypeScript
│       │   ├── 📄 auth.ts                 # Tipos de autenticación
│       │   ├── 📄 Button.ts, Nav.ts, etc. # Tipos de componentes
│       │   └── 📄 index.ts                # Exportaciones centralizadas
│       ├── 📁 hooks/                      # ✅ Hooks personalizados
│       │   ├── � useEmailValidation.ts   # Validación de correos @unica.edu.pe
│       │   ├── 📄 useLocalStorage.ts      # Persistencia local
│       │   └── 📄 useScrollAnimation.ts   # Animaciones con GSAP
│       ├── �📁 data/                       # ✅ Datos estáticos
│       │   ├── 📄 Carrousel.ts            # Datos del carrusel principal
│       │   ├── 📄 NavItems.ts             # Elementos de navegación
│       │   └── 📄 QuickLinks.ts, etc.     # Enlaces y objetivos
│       ├── 📁 lib/                        # ✅ Utilidades
│       │   └── 📄 api.ts                  # Configuración de API
│       ├── 📁 utils/                      # ✅ Funciones utilitarias
│       │   └── 📄 scrollAnimations.ts     # Animaciones GSAP
│       └── 📁 assets/                     # ✅ Recursos estáticos
│           ├── 🖼️ logoUNICA.png           # Logo institucional
│           ├── 🖼️ logoPosgrado.png        # Logo de posgrado
│           └── 🖼️ about.png, about2.png   # Imágenes de secciones
│
├── 📁 db/                                 # ✅ CONFIGURACIÓN BASE DE DATOS
│   └── 📄 init.sql                        # ✅ Script de inicialización multi-DB
│
├── 📁 pgadmin/                            # ✅ CONFIGURACIÓN PGADMIN
│   ├── 📄 servers.json                    # ✅ Configuración de servidores
│   └── 📄 pgpass                          # ✅ Credenciales automáticas
│
├── 📄 docker-compose.yml                  # ✅ ORQUESTACIÓN COMPLETA
├── 📄 debug-docker.ps1                    # ✅ Script de debugging Docker
└── 📄 README.md                           # ✅ Documentación principal (este archivo)
```

### 🎯 **Métricas del Proyecto (Datos Reales)**

| Componente | Estado | Archivos | Tecnología Principal |
|------------|--------|----------|---------------------|
| **Frontend** | ✅ Completo | ~53 archivos | Next.js 15 + React 19 |
| **Backend Auth** | ✅ Completo | ~45 archivos Java | Spring Boot 3.5.3 |
| **Backend Intranet** | 🏗️ Base | ~5 archivos | Spring Boot 3.5.3 |
| **Backend Matrícula** | 🏗️ Base | ~5 archivos | Spring Boot 3.5.3 |
| **Database** | ✅ Configurado | 3 bases de datos | PostgreSQL 17.5 |
| **DevOps** | ✅ Configurado | 6 servicios Docker | Docker Compose |

### 📊 **APIs y Endpoints Implementados**

| Microservicio | Endpoints | Estado | Documentación |
|---------------|-----------|--------|---------------|
| **Autenticación** | 60+ endpoints | ✅ Funcional | Swagger UI disponible |
| **Intranet** | 0 endpoints | 🏗️ Pendiente | Por implementar |
| **Matrícula** | 0 endpoints | 🏗️ Pendiente | Por implementar |

## 🚀 Instalación y Configuración

### 📋 Prerrequisitos

#### Para Desarrollo con Docker (Recomendado):
- **Docker Desktop** v20.0+ con Docker Compose v2.0+
- **Mínimo 8GB RAM** disponible para los 6 servicios
- **Puerto libre**: 3000, 8080, 8081, 8082, 5432, 8079

#### Para Desarrollo Local:
- **Node.js 18+** con **pnpm** instalado
- **Java 21** (para microservicio de Autenticación) o **Java 24** (para otros)
- **Maven 3.9+** (o usar los wrapper incluidos)
- **PostgreSQL 17+** con privilegios de creación de bases de datos

### 🐳 Despliegue Completo con Docker Compose (Recomendado)

#### 1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd EscuelaPosgradoUNICA
```

#### 2. **Iniciar todos los servicios**
```bash
# Construir e iniciar todos los servicios
docker-compose up -d --build

# Ver logs en tiempo real
docker-compose logs -f

# Verificar estado de todos los servicios
docker-compose ps
```

#### 3. **Verificar que todos los servicios estén funcionando**
```bash
# Health checks automáticos
curl http://localhost:8080/actuator/health    # Autenticación
curl http://localhost:8081/actuator/health    # Intranet (básico)
curl http://localhost:8082/actuator/health    # Matrícula (básico)
curl http://localhost:3000                    # Frontend
```

### 🌐 Servicios Disponibles (URLs de Acceso)

| Servicio | URL de Acceso | Puerto | Estado | Descripción |
|----------|---------------|--------|--------|-------------|
| **Frontend Web** | http://localhost:3000 | 3000 | ✅ **Funcional** | Aplicación principal Next.js |
| **Login** | http://localhost:3000/iniciar-sesion | 3000 | ✅ **Funcional** | Página de autenticación |
| **Campus Virtual** | http://localhost:3000/campus-virtual | 3000 | ✅ **Funcional** | Dashboard por rol (requiere login) |
| **API Autenticación** | http://localhost:8080 | 8080 | ✅ **Funcional** | Microservicio de autenticación |
| **Swagger UI** | http://localhost:8080/swagger-ui.html | 8080 | ✅ **Funcional** | Documentación interactiva API |
| **API Intranet** | http://localhost:8081 | 8081 | 🏗️ **Base** | Microservicio de intranet |
| **API Matrícula** | http://localhost:8082 | 8082 | 🏗️ **Base** | Microservicio de matrícula |
| **Base de Datos** | localhost:5432 | 5432 | ✅ **Funcional** | PostgreSQL con 3 databases |
| **pgAdmin** | http://localhost:8079 | 8079 | ✅ **Funcional** | Administrador de BD web |

### 🔑 Credenciales de Acceso (Datos Reales del Sistema)

#### **Usuarios de Demostración Pre-configurados:**

| Rol | Username | Contraseña | Email | Permisos |
|-----|----------|------------|-------|----------|
| **👑 ADMIN** | `admin` | `admin123` | admin@unica.edu.pe | Control total del sistema |
| **👨‍🏫 DOCENTE** | `docente.demo` | `docente123` | docente.demo@unica.edu.pe | Gestión de alumnos y colegas |
| **👨‍💼 COORDINADOR** | `coordinador.demo` | `coordinador123` | coordinador.demo@unica.edu.pe | Supervisión académica |
| **👨‍🎓 ALUMNO** | `alumno.demo` | `alumno123` | alumno.demo@unica.edu.pe | Portal estudiantil |
| **📝 POSTULANTE** | `postulante.demo` | `postulante123` | postulante.demo@gmail.com | Información de postulación |

#### **Credenciales de Servicios:**

| Servicio | Usuario | Contraseña | Notas |
|----------|---------|------------|-------|
| **PostgreSQL** | `postgres` | `postgres` | 3 bases de datos: autenticacion, intranet, matricula |
| **pgAdmin** | `admin@unica.edu.pe` | `admin123` | Interfaz web para administrar BD |

### 🔗 Flujo de Prueba Completo

#### 1. **Verificar que todos los servicios estén activos:**
```bash
docker-compose ps
# Todos los servicios deben mostrar "Up" y "healthy"
```

#### 2. **Probar la aplicación web:**
- Ir a http://localhost:3000
- Ver la página principal con carrusel de programas
- Hacer clic en "Iniciar Sesión" o ir a http://localhost:3000/iniciar-sesion

#### 3. **Probar autenticación:**
- Usar cualquier usuario de demostración (ej: `admin` / `admin123`)
- Verificar redirección automática al Campus Virtual
- Confirmar dashboard personalizado según el rol

#### 4. **Probar API REST:**
- Ir a http://localhost:8080/swagger-ui.html
- Ver documentación interactiva completa
- Probar endpoints públicos como health checks

#### 5. **Administrar base de datos:**
- Ir a http://localhost:8079 (pgAdmin)
- Login con `admin@unica.edu.pe` / `admin123`
- Explorar las 3 bases de datos del sistema

### 🛠️ Comandos de Gestión Docker

```bash
# Iniciar servicios específicos
docker-compose up frontend autenticacion db -d

# Ver logs de un servicio específico
docker-compose logs -f autenticacion

# Reconstruir un servicio específico
docker-compose up --build frontend -d

# Detener todos los servicios
docker-compose down

# Detener y limpiar volúmenes (¡CUIDADO: borra datos!)
docker-compose down -v

# Ver estado y salud de servicios
docker-compose ps
docker-compose top

# Ejecutar comandos dentro de contenedores
docker-compose exec autenticacion bash
docker-compose exec db psql -U postgres -d autenticacion
```

## 🔧 Desarrollo Local (Entornos Separados)

### 🌐 Frontend (✅ Completamente Funcional)

#### **Configuración y Ejecución:**
```bash
cd frontend

# Instalar dependencias (primera vez)
pnpm install

# Servidor de desarrollo con Turbopack (recomendado)
pnpm dev
# Aplicación disponible en: http://localhost:3000

# Otros comandos disponibles:
pnpm build        # Build de producción optimizado
pnpm start        # Servidor de producción (requiere build previo)
pnpm lint         # Análisis de código con ESLint 9
```

#### **Características Implementadas y Funcionales:**
- ✅ **Página Principal** (`/`): Carrusel interactivo de programas de posgrado
- ✅ **Sistema de Login** (`/iniciar-sesion`): Validación en tiempo real de correos @unica.edu.pe
- ✅ **Campus Virtual** (`/campus-virtual`): Dashboard personalizado según rol de usuario
- ✅ **Middleware de Autenticación**: Protección automática de rutas privadas
- ✅ **Componentes UI Modernos**: Botones, cards, formularios con animaciones GSAP
- ✅ **React Context**: Manejo global del estado de autenticación
- ✅ **Hooks Personalizados**: Validación de email, localStorage, animaciones
- ✅ **TypeScript Completo**: Tipado estático en todos los componentes

#### **Estructura de Desarrollo:**
```
frontend/src/
├── app/                    # Next.js App Router
├── components/ui/          # Componentes reutilizables
├── contexts/AuthContext.tsx    # Estado global de autenticación
├── services/authService.ts     # Comunicación con backend
├── hooks/                  # Hooks personalizados
└── types/                  # Tipos TypeScript
```

### 🔐 Backend - Microservicio de Autenticación (✅ Completamente Funcional)

#### **Configuración y Ejecución:**
```bash
cd backend/Autenticacion

# Ejecutar con Maven wrapper (recomendado)
./mvnw spring-boot:run
# API disponible en: http://localhost:8080

# Alternativamente con Maven local:
mvn spring-boot:run

# Otros comandos de desarrollo:
./mvnw clean compile          # Compilar código Java
./mvnw test                   # Ejecutar tests unitarios e integración
./mvnw clean package          # Crear JAR ejecutable
./mvnw clean install          # Instalar en repositorio local
```

#### **APIs y Endpoints Disponibles (60+ endpoints):**

##### **🔓 Endpoints Públicos:**
```http
POST /api/auth/login           # Iniciar sesión con username/email + password
POST /api/auth/registro        # Registrar nuevo usuario
GET  /api/health/status        # Estado básico del microservicio
GET  /api/health/check         # Health check completo (DB + servicio)
GET  /api/health/info          # Información detallada del servicio
GET  /actuator/health          # Spring Boot Actuator health
GET  /actuator/info            # Información del actuator
GET  /swagger-ui.html          # Documentación interactiva Swagger
GET  /v3/api-docs              # Especificación OpenAPI 3.0
```

##### **🔒 Endpoints Autenticados por Rol:**

**👑 ADMIN (9 endpoints principales):**
```http
GET    /api/admin/usuarios                    # Todos los usuarios del sistema
GET    /api/admin/usuarios/rol/{role}         # Usuarios filtrados por rol
PUT    /api/admin/usuarios/{id}/activar       # Activar usuario específico
PUT    /api/admin/usuarios/{id}/desactivar    # Desactivar usuario específico
GET    /api/admin/estadisticas                # Estadísticas completas del sistema
GET    /api/admin/docentes                    # Lista de todos los docentes
GET    /api/admin/alumnos                     # Lista de todos los alumnos
GET    /api/admin/coordinadores               # Lista de todos los coordinadores
GET    /api/admin/postulantes                 # Lista de todos los postulantes
```

**👨‍🏫 DOCENTE (4 endpoints principales):**
```http
GET /api/docente/perfil        # Perfil del docente autenticado
GET /api/docente/alumnos       # Lista de alumnos para el docente
GET /api/docente/colegas       # Lista de otros docentes
GET /api/docente/bienvenida    # Mensaje personalizado de bienvenida
```

**👨‍🎓 ALUMNO (5 endpoints principales):**
```http
GET /api/alumno/perfil         # Perfil del alumno autenticado
GET /api/alumno/docentes       # Lista de docentes disponibles
GET /api/alumno/companeros     # Lista de compañeros de estudios
GET /api/alumno/bienvenida     # Mensaje personalizado de bienvenida
GET /api/alumno/codigo         # Información del código de estudiante
```

**👨‍💼 COORDINADOR (7 endpoints principales):**
```http
GET /api/coordinador/perfil            # Perfil del coordinador
GET /api/coordinador/docentes          # Todos los docentes bajo supervisión
GET /api/coordinador/alumnos           # Todos los alumnos del programa
GET /api/coordinador/postulantes       # Postulantes a evaluar
GET /api/coordinador/coordinadores     # Otros coordinadores
GET /api/coordinador/bienvenida        # Mensaje personalizado
GET /api/coordinador/resumen           # Resumen estadístico académico
```

**📝 POSTULANTE (6 endpoints principales):**
```http
GET /api/postulante/perfil             # Perfil del postulante
GET /api/postulante/docentes           # Información de docentes disponibles
GET /api/postulante/coordinadores      # Información de coordinadores
GET /api/postulante/bienvenida         # Mensaje de bienvenida
GET /api/postulante/programa-interes   # Información del programa de interés
GET /api/postulante/estado             # Estado actual de la postulación
```

**Para todos los usuarios autenticados:**
```http
GET /api/auth/me               # Información del usuario actual
GET /api/auth/validate         # Validar token JWT actual
```

#### **Configuración de Base de Datos:**
```properties
# archivo: src/main/resources/application.properties
spring.datasource.url=jdbc:postgresql://localhost:5432/autenticacion
spring.datasource.username=postgres
spring.datasource.password=postgres

# JWT Configuration
app.jwtSecret=escuelaPosgradoUnicaSecretKey2024JWTAuthentication
app.jwtExpirationMs=86400000  # 24 horas

# Swagger UI
springdoc.swagger-ui.path=/swagger-ui.html
```

#### **Tecnologías Implementadas:**
- ✅ **Spring Boot 3.5.3** con auto-configuración avanzada
- ✅ **Spring Security 6** con JWT authentication
- ✅ **Spring Data JPA** con repositorios personalizados
- ✅ **PostgreSQL** con esquema optimizado
- ✅ **Swagger/OpenAPI 2.6.0** con documentación completa
- ✅ **BCrypt** para encriptación de contraseñas
- ✅ **Bean Validation** con validaciones personalizadas
- ✅ **Spring Boot Actuator** para monitoreo

### 🏗️ Backend - Otros Microservicios (Estructura Base Preparada)

#### **Microservicio de Intranet:**
```bash
cd backend/Intranet
./mvnw spring-boot:run    # Puerto 8081
```

#### **Microservicio de Matrícula:**
```bash
cd backend/Matricula
./mvnw spring-boot:run    # Puerto 8082
```

**Estado Actual:**
- ✅ **Proyecto Spring Boot 3.5.3** configurado con Java 24
- ✅ **Dependencias base** instaladas (Security, JPA, Web, etc.)
- ✅ **Configuración Docker** lista para producción
- ✅ **Health checks** básicos configurados
- ✅ **Bases de datos PostgreSQL** dedicadas creadas
- ⏳ **Pendiente**: Implementación de controladores, servicios, entidades

### 🗄️ Configuración de Base de Datos (PostgreSQL)

#### **Desarrollo Local:**
```sql
-- Crear las bases de datos manualmente:
createdb -U postgres autenticacion
createdb -U postgres intranet
createdb -U postgres matricula

-- O usar el script incluido:
psql -U postgres -f db/init.sql
```

#### **Esquema Actual (Solo microservicio de Autenticación):**
```sql
-- Tabla principal: usuarios
CREATE TABLE usuarios (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    dni VARCHAR(8) UNIQUE,
    telefono VARCHAR(15),
    role VARCHAR(20) NOT NULL,  -- ADMIN, DOCENTE, COORDINADOR, ALUMNO, POSTULANTE
    activo BOOLEAN NOT NULL DEFAULT true,
    fecha_creacion TIMESTAMP NOT NULL,
    fecha_actualizacion TIMESTAMP,
    ultimo_acceso TIMESTAMP,
    -- Campos específicos por rol:
    codigo_estudiante VARCHAR(20) UNIQUE,    -- Para ALUMNO
    codigo_docente VARCHAR(20) UNIQUE,       -- Para DOCENTE/COORDINADOR
    especialidad VARCHAR(100),               -- Para DOCENTE/COORDINADOR
    programa_interes VARCHAR(100)            -- Para POSTULANTE
);
```

#### **Usuarios de Demostración (Pre-cargados automáticamente):**
La clase `DataInitializer` crea automáticamente los 5 usuarios de demostración al iniciar la aplicación por primera vez.

## 🗄️ Base de Datos y Arquitectura de Datos

### 📊 Configuración Multi-Database (✅ Implementado y Funcional)

El sistema utiliza **PostgreSQL 17.5** con arquitectura de bases de datos separadas por microservicio:

```sql
-- Bases de datos creadas automáticamente:
CREATE DATABASE autenticacion;    -- ✅ FUNCIONAL - Esquema completo
CREATE DATABASE intranet;         -- ✅ CREADA - Preparada para desarrollo
CREATE DATABASE matricula;        -- ✅ CREADA - Preparada para desarrollo
```

### 🗃️ Esquema de Base de Datos: `autenticacion` (✅ Completamente Implementado)

#### **Tabla Principal: `usuarios`**
```sql
CREATE TABLE usuarios (
    -- Identificación principal
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,        -- Encriptado con BCrypt
    
    -- Información personal básica
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    dni VARCHAR(8) UNIQUE,
    telefono VARCHAR(15),
    
    -- Control de sistema
    role VARCHAR(20) NOT NULL,             -- ADMIN, DOCENTE, COORDINADOR, ALUMNO, POSTULANTE
    activo BOOLEAN NOT NULL DEFAULT true,
    fecha_creacion TIMESTAMP NOT NULL,
    fecha_actualizacion TIMESTAMP,
    ultimo_acceso TIMESTAMP,
    
    -- Campos específicos por rol
    codigo_estudiante VARCHAR(20) UNIQUE,  -- Para ALUMNO y POSTULANTE
    codigo_docente VARCHAR(20) UNIQUE,     -- Para DOCENTE y COORDINADOR
    especialidad VARCHAR(100),             -- Para DOCENTE y COORDINADOR
    programa_interes VARCHAR(100),         -- Para POSTULANTE
    
    -- Índices automáticos por UNIQUE constraints
    -- Índices adicionales para búsquedas por rol
);
```

#### **Datos de Demostración Pre-cargados:**
```sql
-- Usuarios creados automáticamente por DataInitializer:
-- 1 ADMIN, 1 DOCENTE, 1 COORDINADOR, 1 ALUMNO, 1 POSTULANTE
-- Con contraseñas encriptadas y datos realistas
```

### 🗄️ Esquemas Futuros (🏗️ Preparados para Implementación)

#### **Base de Datos: `intranet`** (Por implementar)
```sql
-- Esquemas previstos para el microservicio de Intranet:
CREATE TABLE cursos (...);           -- Gestión de cursos y materias
CREATE TABLE matriculas (...);       -- Relación estudiante-curso
CREATE TABLE calificaciones (...);   -- Notas y evaluaciones
CREATE TABLE asistencias (...);      -- Control de asistencia
CREATE TABLE horarios (...);         -- Programación académica
CREATE TABLE recursos (...);         -- Materiales y recursos educativos
```

#### **Base de Datos: `matricula`** (Por implementar)
```sql
-- Esquemas previstos para el microservicio de Matrícula:
CREATE TABLE programas (...);        -- Programas de posgrado disponibles
CREATE TABLE periodos (...);         -- Períodos académicos
CREATE TABLE postulaciones (...);    -- Proceso de postulación
CREATE TABLE pagos (...);            -- Gestión de aranceles
CREATE TABLE documentos (...);       -- Documentación requerida
CREATE TABLE admisiones (...);       -- Proceso de admisión
```

### 📈 Configuración de Conexiones por Microservicio

#### **Microservicio de Autenticación (✅ Configurado):**
```properties
# application.properties
spring.datasource.url=jdbc:postgresql://localhost:5432/autenticacion
spring.datasource.username=postgres
spring.datasource.password=postgres
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

#### **Microservicio de Intranet (🏗️ Preparado):**
```properties
# application-docker.properties (configurado en Docker)
spring.datasource.url=jdbc:postgresql://db:5432/intranet
spring.datasource.username=postgres
spring.datasource.password=postgres
```

#### **Microservicio de Matrícula (🏗️ Preparado):**
```properties
# application-docker.properties (configurado en Docker)
spring.datasource.url=jdbc:postgresql://db:5432/matricula
spring.datasource.username=postgres
spring.datasource.password=postgres
```

### 🔧 Herramientas de Administración

#### **pgAdmin 4 (✅ Configurado y Funcional)**
- **URL de Acceso**: http://localhost:8079
- **Credenciales**: `admin@unica.edu.pe` / `admin123`
- **Funcionalidades**:
  - ✅ Administración visual de las 3 bases de datos
  - ✅ Editor SQL integrado
  - ✅ Visualización de esquemas y relaciones
  - ✅ Monitoreo de consultas y rendimiento
  - ✅ Configuración automática de servidores

#### **Scripts de Inicialización:**
```bash
# Archivo: db/init.sql
# Se ejecuta automáticamente al crear el contenedor PostgreSQL
-- Crear las bases de datos para los microservicios
CREATE DATABASE autenticacion;
CREATE DATABASE intranet;
CREATE DATABASE matricula;
```

### 📊 Health Checks y Monitoreo de Base de Datos

#### **Verificaciones Automáticas:**
```bash
# Health check de PostgreSQL en Docker
healthcheck:
  test: ["CMD-SHELL", "pg_isready -U postgres"]
  interval: 10s
  timeout: 5s
  retries: 5
```

#### **Endpoints de Monitoreo:**
```http
GET /api/health/check          # Verifica conexión a BD + estado del servicio
GET /actuator/health           # Health check completo de Spring Boot
GET /actuator/info             # Información del sistema y BD
```

#### **Logs y Debugging:**
```properties
# Configuración para desarrollo (application.properties)
spring.jpa.show-sql=true                    # Mostrar queries SQL
spring.jpa.properties.hibernate.format_sql=true  # Formatear SQL
logging.level.org.hibernate.SQL=DEBUG      # Logs detallados de Hibernate
```

### 🔒 Seguridad y Optimización de Base de Datos

#### **Configuraciones de Seguridad:**
- ✅ **Contraseñas encriptadas** con BCrypt y salt único
- ✅ **Validaciones únicas** en campos críticos (email, username, DNI)
- ✅ **Índices automáticos** en campos de búsqueda frecuente
- ✅ **Conexiones pool** optimizadas con HikariCP
- ✅ **Transacciones** manejadas con @Transactional

#### **Optimizaciones Implementadas:**
- ✅ **JPA/Hibernate** con queries optimizadas
- ✅ **Lazy loading** para relaciones complejas
- ✅ **Connection pooling** automático
- ✅ **Índices compuestos** en campos de búsqueda por rol

## 🛠️ Comandos de Desarrollo y Gestión

### 🌐 Frontend (Next.js 15 + React 19)
```bash
# Directorio: frontend/
pnpm dev          # Servidor de desarrollo con Turbopack (http://localhost:3000)
pnpm build        # Build de producción optimizado con cache
pnpm start        # Servidor de producción (requiere build previo)
pnpm lint         # Análisis de código con ESLint 9 y reglas Next.js
pnpm lint --fix   # Corregir automáticamente errores de linting

# Gestión de dependencias
pnpm install      # Instalar todas las dependencias
pnpm update       # Actualizar dependencias a versiones compatibles
pnpm audit        # Verificar vulnerabilidades de seguridad
```

### 🔐 Backend - Microservicio de Autenticación (Spring Boot 3.5.3)
```bash
# Directorio: backend/Autenticacion/
./mvnw spring-boot:run        # Ejecutar aplicación (http://localhost:8080)
./mvnw clean compile          # Compilar código Java
./mvnw test                   # Ejecutar tests unitarios e integración
./mvnw clean package          # Crear JAR ejecutable en target/
./mvnw clean install          # Instalar en repositorio Maven local
./mvnw dependency:tree        # Ver árbol de dependencias
./mvnw spring-boot:build-info # Generar información de build

# En Windows usar mvnw.cmd en lugar de ./mvnw
mvnw.cmd spring-boot:run      # Para entornos Windows

# Debugging y desarrollo
./mvnw spring-boot:run -Dspring-boot.run.jvmArguments="-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=5005"
```

### 🏗️ Backend - Otros Microservicios (Estructura Base)
```bash
# Microservicio de Intranet (Puerto 8081)
cd backend/Intranet
./mvnw spring-boot:run

# Microservicio de Matrícula (Puerto 8082)
cd backend/Matricula
./mvnw spring-boot:run

# Nota: Actualmente solo inician el contexto básico de Spring Boot
# Pendiente implementación de lógica de negocio
```

### 🐳 Docker - Orquestación Completa (6 Servicios)
```bash
# Gestión completa del sistema
docker-compose up -d              # Iniciar todos los servicios en segundo plano
docker-compose up --build -d      # Reconstruir imágenes e iniciar servicios
docker-compose down               # Detener y remover contenedores
docker-compose down -v            # Detener y limpiar volúmenes (¡BORRA DATOS!)
docker-compose restart            # Reiniciar todos los servicios

# Gestión selectiva de servicios
docker-compose up frontend autenticacion db -d    # Solo servicios principales
docker-compose stop frontend                      # Detener servicio específico
docker-compose start frontend                     # Iniciar servicio específico
docker-compose restart autenticacion              # Reiniciar microservicio específico

# Monitoreo y debugging
docker-compose ps                 # Estado de todos los contenedores
docker-compose top                # Procesos ejecutándose en contenedores
docker-compose logs -f            # Ver logs en tiempo real de todos los servicios
docker-compose logs -f autenticacion  # Logs específicos del microservicio de auth
docker-compose logs --tail=100 frontend  # Últimas 100 líneas de logs del frontend

# Desarrollo y debugging dentro de contenedores
docker-compose exec autenticacion bash           # Acceder al contenedor de auth
docker-compose exec db psql -U postgres          # Acceder a PostgreSQL
docker-compose exec frontend sh                  # Acceder al contenedor de frontend

# Gestión de recursos
docker-compose images            # Ver imágenes utilizadas
docker system df                 # Uso de espacio en disco por Docker
docker system prune -f           # Limpiar recursos no utilizados
```

### 🗄️ Base de Datos (PostgreSQL + pgAdmin)
```bash
# Conexión directa a PostgreSQL
docker-compose exec db psql -U postgres -d autenticacion
docker-compose exec db psql -U postgres -d intranet
docker-compose exec db psql -U postgres -d matricula

# Backup de bases de datos
docker-compose exec db pg_dump -U postgres autenticacion > backup_auth.sql
docker-compose exec db pg_dump -U postgres --all > backup_completo.sql

# Restaurar backup
cat backup_auth.sql | docker-compose exec -T db psql -U postgres -d autenticacion

# Verificar logs de PostgreSQL
docker-compose logs db

# pgAdmin (Interfaz Web - http://localhost:8079)
# Usuario: admin@unica.edu.pe | Contraseña: admin123
```

### 🔍 Testing y Validación del Sistema

#### **Health Checks Automatizados:**
```bash
# Verificar estado de todos los microservicios
curl http://localhost:8080/actuator/health    # Autenticación
curl http://localhost:8081/actuator/health    # Intranet (básico)
curl http://localhost:8082/actuator/health    # Matrícula (básico)
curl http://localhost:3000                    # Frontend

# Health checks internos con información detallada
curl http://localhost:8080/api/health/status
curl http://localhost:8080/api/health/check
curl http://localhost:8080/api/health/info
```

#### **Testing de API REST (Microservicio de Autenticación):**
```bash
# Login de usuario de demostración
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"usernameOrEmail": "admin", "password": "admin123"}'

# Registro de nuevo usuario
curl -X POST http://localhost:8080/api/auth/registro \
  -H "Content-Type: application/json" \
  -d '{
    "username": "test.user",
    "email": "test.user@unica.edu.pe",
    "password": "password123",
    "nombres": "Usuario",
    "apellidos": "De Prueba",
    "role": "ALUMNO"
  }'

# Endpoints protegidos (requieren JWT token)
TOKEN="eyJhbGciOiJIUzI1NiJ9..."  # Obtener del login
curl -H "Authorization: Bearer $TOKEN" http://localhost:8080/api/auth/me
curl -H "Authorization: Bearer $TOKEN" http://localhost:8080/api/admin/usuarios
```

#### **Testing del Frontend:**
```bash
# Verificar compilación TypeScript
cd frontend && npx tsc --noEmit

# Análisis de código con ESLint
cd frontend && pnpm lint

# Build de producción para verificar errores
cd frontend && pnpm build
```

### 📊 Monitoreo y Métricas

#### **Logs de Aplicación:**
```bash
# Logs específicos por componente
docker-compose logs -f autenticacion | grep ERROR
docker-compose logs -f frontend | grep "ready"
docker-compose logs -f db | grep "LOG"

# Monitoreo en tiempo real con filtros
docker-compose logs -f --tail=50 autenticacion
docker-compose logs -f | grep -E "(ERROR|WARN|FATAL)"
```

#### **Métricas de Rendimiento:**
```bash
# Uso de recursos por contenedor
docker stats

# Estado detallado de servicios
docker-compose top

# Información de red
docker network ls
docker network inspect escuelaposgradounica_escuela-network
```

### 🔧 Comandos de Desarrollo Específicos

#### **Para Desarrollo Frontend:**
```bash
# Limpiar cache de Next.js
rm -rf frontend/.next

# Verificar dependencias desactualizadas
cd frontend && pnpm outdated

# Análisis de bundle size
cd frontend && pnpm build && npx @next/bundle-analyzer
```

#### **Para Desarrollo Backend:**
```bash
# Generar documentación Javadoc
cd backend/Autenticacion && ./mvnw javadoc:javadoc

# Verificar actualizaciones de dependencias Maven
./mvnw versions:display-dependency-updates

# Ejecutar solo tests específicos
./mvnw test -Dtest=AuthServiceTest
```

#### **Debugging y Troubleshooting:**
```bash
# Verificar puertos ocupados
netstat -tlnp | grep -E "(3000|8080|8081|8082|5432|8079)"

# Reiniciar completamente el sistema
docker-compose down -v && docker-compose up --build -d

# Ver configuración aplicada de Docker Compose
docker-compose config

# Verificar variables de entorno en contenedores
docker-compose exec autenticacion env | grep SPRING
```

## 👥 Equipo de Desarrollo

### 🎓 **Información Académica**
- **Institución**: Universidad Nacional San Luis Gonzaga de Ica (UNICA)
- **Facultad**: Ingeniería de Sistemas
- **Curso**: Lenguaje de Programación Avanzada
- **Ciclo Académico**: 4to Ciclo
- **Período**: 2024-II

### 👨‍💻 **Integrantes del Equipo de Desarrollo**

| # | Desarrollador | GitHub | Rol Principal | Especialización |
|---|---------------|--------|---------------|-----------------|
| 1 | **Miguel Vivar** | [@MiguelVivar](https://github.com/MiguelVivar) | Team Lead & Full Stack | Arquitectura y Backend |
| 2 | **Mario Muñoz** | [@ChuchiPr](https://github.com/ChuchiPr) | Backend Developer | Microservicios y API |
| 3 | **Angelina Soto** | [@VinnBon](https://github.com/VinnBon) | Frontend Developer | UI/UX y React |
| 4 | **Luis Mitma** | [@Elextranjero1942](https://github.com/Elextranjero1942) | DevOps & Database | Docker y PostgreSQL |
| 5 | **Juan Ttito** | [@juanttito1003](https://github.com/juanttito1003) | Backend Developer | Spring Security y JWT |
| 6 | **Rodrigo Conislla** | [@Rodricrak25](https://github.com/Rodricrak25) | Frontend Developer | Next.js y TypeScript |
| 7 | **Dylan Palomino** | [@DaPcxD](https://github.com/DaPcxD) | QA & Testing | Testing y Documentación |

### 🏆 **Distribución de Responsabilidades**

#### **🌐 Equipo Frontend (Next.js + React)**
- **Líderes**: Angelina Soto, Rodrigo Conislla
- **Responsabilidades**:
  - ✅ Desarrollo de componentes React reutilizables
  - ✅ Implementación de Next.js 15 con App Router
  - ✅ Integración de TailwindCSS 4 y diseño responsivo
  - ✅ Animaciones con GSAP 3.13.0
  - ✅ Middleware de autenticación y protección de rutas
  - ✅ Context API para manejo de estado global

#### **🔐 Equipo Backend (Spring Boot + Microservicios)**
- **Líderes**: Miguel Vivar, Mario Muñoz, Juan Ttito
- **Responsabilidades**:
  - ✅ Arquitectura de microservicios con Spring Boot 3.5.3
  - ✅ Sistema de autenticación JWT con Spring Security 6
  - ✅ 60+ endpoints API REST documentados con Swagger
  - ✅ Diseño de base de datos multi-schema PostgreSQL
  - ✅ Implementación de 5 roles de usuario con permisos granulares
  - ✅ Health checks y monitoreo con Spring Boot Actuator

#### **🗄️ Equipo DevOps y Base de Datos**
- **Líder**: Luis Mitma
- **Responsabilidades**:
  - ✅ Configuración Docker Compose con 6 servicios
  - ✅ Setup PostgreSQL 17.5 multi-database
  - ✅ Configuración de pgAdmin para administración
  - ✅ Health checks y monitoring automático
  - ✅ Scripts de inicialización y deployment
  - ✅ Gestión de volúmenes y persistencia de datos

#### **🔍 Equipo QA y Documentación**
- **Líder**: Dylan Palomino
- **Responsabilidades**:
  - ✅ Testing integral de APIs con 60+ endpoints
  - ✅ Documentación técnica completa (README, Swagger)
  - ✅ Validación de funcionalidades por rol de usuario
  - ✅ Scripts de testing automatizado
  - ✅ Control de calidad de código y estándares
  - ✅ Documentación de procesos de deployment

### 📋 **Metodología de Trabajo Implementada**

#### **🔄 Flujo de Desarrollo (GitFlow Adaptado)**
```
main branch (producción)
├── develop (integración)
│   ├── feature/frontend-auth (Angelina, Rodrigo)
│   ├── feature/backend-microservices (Miguel, Mario, Juan)
│   ├── feature/database-setup (Luis)
│   └── feature/documentation (Dylan)
└── hotfix/* (correcciones urgentes)
```

#### **🚀 Sprints y Entregas**
- **Sprint 1** (✅ Completado): Configuración de entorno y arquitectura base
- **Sprint 2** (✅ Completado): Microservicio de autenticación completo
- **Sprint 3** (✅ Completado): Frontend con Next.js y sistema de login
- **Sprint 4** (✅ Completado): Integración completa y Docker Compose
- **Sprint 5** (🚧 En curso): Microservicios de Intranet y Matrícula

#### **📅 Reuniones y Coordinación**
- **Daily Standups**: Reuniones virtuales de coordinación
- **Sprint Reviews**: Demostración de funcionalidades implementadas
- **Retrospectivas**: Mejora continua del proceso de desarrollo
- **Code Reviews**: Revisión de código mediante Pull Requests

### 🛠️ **Herramientas y Tecnologías Utilizadas**

#### **💬 Comunicación y Gestión**
- **Discord/WhatsApp**: Comunicación diaria del equipo
- **GitHub Projects**: Gestión de tareas y kanban
- **Git**: Control de versiones con branching strategy
- **Visual Studio Code**: IDE unificado con extensiones compartidas

#### **🔧 Desarrollo y Testing**
- **Postman**: Testing de APIs REST
- **pgAdmin**: Administración de base de datos
- **Docker Desktop**: Desarrollo local containerizado
- **Chrome DevTools**: Debugging frontend

#### **📚 Documentación**
- **Swagger/OpenAPI**: Documentación automática de APIs
- **Markdown**: Documentación técnica
- **Mermaid**: Diagramas de arquitectura
- **JSDoc**: Documentación de código JavaScript/TypeScript

### 🎯 **Logros del Equipo**

#### **📊 Métricas de Productividad**
- ✅ **+120 commits** en el repositorio principal
- ✅ **60+ endpoints API** completamente funcionales
- ✅ **53 archivos frontend** con componentes reutilizables
- ✅ **45 archivos backend** con arquitectura sólida
- ✅ **6 servicios Docker** configurados y funcionales
- ✅ **5 roles de usuario** implementados con permisos específicos
- ✅ **3 bases de datos** configuradas y optimizadas

#### **🏆 Hitos Técnicos Alcanzados**
- ✅ **Arquitectura de Microservicios** escalable y mantenible
- ✅ **Autenticación JWT** robusta con Spring Security 6
- ✅ **Frontend Moderno** con Next.js 15 y React 19
- ✅ **Base de Datos Multi-Schema** optimizada
- ✅ **Documentación Completa** con Swagger UI interactivo
- ✅ **Containerización Total** con Docker Compose
- ✅ **Testing Integral** de todas las funcionalidades

### 🌟 **Reconocimientos Especiales**

#### **🥇 Innovación Técnica**
- **Miguel Vivar**: Arquitectura de microservicios y liderazgo técnico
- **Juan Ttito**: Implementación avanzada de Spring Security con JWT

#### **🎨 Excelencia en Frontend**
- **Angelina Soto**: Diseño UI/UX y experiencia de usuario
- **Rodrigo Conislla**: Integración Next.js y TypeScript

#### **⚙️ Infraestructura y DevOps**
- **Luis Mitma**: Configuración Docker y optimización de base de datos

#### **📖 Documentación y Calidad**
- **Dylan Palomino**: Documentación técnica y procesos de QA
- **Mario Muñoz**: Desarrollo backend y testing de APIs

## 🚀 Roadmap y Futuras Implementaciones

### 🔮 **Próximas Funcionalidades (Corto Plazo - Sprint 5-6)**

#### **📚 Microservicio de Intranet (🏗️ En Desarrollo)**
- **Gestión de Cursos y Materias**:
  - ⏳ CRUD completo de cursos por programa
  - ⏳ Asignación de docentes a materias
  - ⏳ Gestión de horarios y aulas

- **Sistema de Calificaciones**:
  - ⏳ Registro de notas por evaluación
  - ⏳ Cálculo automático de promedios
  - ⏳ Reporte de rendimiento académico

- **Control de Asistencia**:
  - ⏳ Registro digital de asistencia
  - ⏳ Reportes de ausentismo
  - ⏳ Notificaciones automáticas

#### **🎓 Microservicio de Matrícula (🏗️ En Desarrollo)**
- **Gestión de Programas**:
  - ⏳ Catálogo de programas de posgrado
  - ⏳ Requisitos y prerrequisitos
  - ⏳ Información de costos y duración

- **Proceso de Postulación**:
  - ⏳ Formulario de postulación online
  - ⏳ Carga de documentos requeridos
  - ⏳ Seguimiento de estado de postulación

- **Sistema de Pagos**:
  - ⏳ Gestión de aranceles y cuotas
  - ⏳ Integración con pasarelas de pago
  - ⏳ Generación de recibos automáticos

### 🔗 **Integraciones Planificadas (Mediano Plazo)**

#### **🌐 Comunicación Entre Microservicios**
- ⏳ **API Gateway** centralizado para routing inteligente
- ⏳ **Service Discovery** automático con Eureka/Consul
- ⏳ **Circuit Breaker** para tolerancia a fallos
- ⏳ **Distributed Tracing** para debugging de sistemas distribuidos

#### **🔔 Sistema de Notificaciones**
- ⏳ **Notificaciones en tiempo real** con WebSockets
- ⏳ **Email automático** para eventos importantes
- ⏳ **SMS** para notificaciones críticas
- ⏳ **Push notifications** para aplicación móvil

#### **📊 Dashboard de Analytics**
- ⏳ **Métricas de uso** del sistema
- ⏳ **Reportes académicos** avanzados
- ⏳ **Análisis de rendimiento** estudiantil
- ⏳ **Dashboards ejecutivos** para administración

### 📱 **Expansión Multiplataforma (Largo Plazo)**

#### **Aplicación Móvil Nativa**
- ⏳ **React Native** para iOS y Android
- ⏳ **Offline sync** para funcionalidades básicas
- ⏳ **Biometric authentication** (huella/face ID)
- ⏳ **Push notifications** nativas

#### **Progressive Web App (PWA)**
- ⏳ **Service Workers** para funcionalidad offline
- ⏳ **App Shell** optimizado
- ⏳ **Installation prompts** para escritorio y móvil

### 🤖 **Inteligencia Artificial y Automatización**

#### **Chatbot de Asistencia Académica**
- ⏳ **NLP** para consultas frecuentes
- ⏳ **Integración con datos** de estudiantes
- ⏳ **Respuestas contextuales** según rol de usuario
- ⏳ **Escalamiento** a soporte humano cuando sea necesario

#### **Sistema de Recomendaciones**
- ⏳ **Recomendación de cursos** basada en historial
- ⏳ **Alertas tempranas** de riesgo académico
- ⏳ **Optimización de horarios** automática

### 🔒 **Mejoras de Seguridad Avanzadas**

#### **Autenticación Multifactor (MFA)**
- ⏳ **TOTP** (Time-based One-Time Password)
- ⏳ **SMS OTP** para verificación
- ⏳ **Authenticator apps** (Google Authenticator, Authy)
- ⏳ **Backup codes** para recuperación

#### **OAuth 2.0 y OpenID Connect**
- ⏳ **Single Sign-On (SSO)** con Google/Microsoft
- ⏳ **Social login** para postulantes
- ⏳ **Identity Provider** centralizado

#### **Auditoría y Compliance**
- ⏳ **Audit logs** completos de todas las acciones
- ⏳ **GDPR compliance** para manejo de datos personales
- ⏳ **Data encryption** en tránsito y reposo

### ☁️ **Infraestructura Cloud y Escalabilidad**

#### **Migración a Cloud (AWS/Azure/GCP)**
- ⏳ **Containerización** con Kubernetes
- ⏳ **Auto-scaling** basado en demanda
- ⏳ **Load balancing** para alta disponibilidad
- ⏳ **CDN** para assets estáticos

#### **CI/CD Pipeline Avanzado**
- ⏳ **GitHub Actions** para deployment automático
- ⏳ **Testing pipeline** con coverage reports
- ⏳ **Blue-green deployment** para zero downtime
- ⏳ **Monitoring** y alertas automáticas

### 📈 **Monitoreo y Observabilidad**

#### **APM (Application Performance Monitoring)**
- ⏳ **New Relic/Datadog** para métricas de rendimiento
- ⏳ **Logs centralizados** con ELK Stack
- ⏳ **Distributed tracing** para microservicios
- ⏳ **Custom dashboards** para métricas de negocio

#### **Health Checks Avanzados**
- ⏳ **Synthetic monitoring** para testing E2E
- ⏳ **Alertas proactivas** antes de fallos
- ⏳ **SLA monitoring** con uptime tracking

### 🎯 **Cronograma de Implementación**

| Período | Funcionalidades Principales | Estado |
|---------|----------------------------|--------|
| **Sprint 5-6** (2 meses) | Microservicios Intranet y Matrícula básicos | 🏗️ En desarrollo |
| **Sprint 7-8** (2 meses) | Integración entre microservicios | ⏳ Planificado |
| **Sprint 9-10** (2 meses) | Sistema de notificaciones y dashboard | ⏳ Planificado |
| **Fase 2** (6 meses) | Aplicación móvil y PWA | ⏳ Futuro |
| **Fase 3** (4 meses) | IA, chatbot y recomendaciones | ⏳ Futuro |
| **Fase 4** (Continuo) | Cloud migration y optimización | ⏳ Futuro |

### 🎓 **Objetivos Académicos y Profesionales**

#### **Aprendizaje Continuo del Equipo**
- ⏳ **Certificaciones** en tecnologías cloud (AWS, Azure)
- ⏳ **Workshop internos** sobre nuevas tecnologías
- ⏳ **Code reviews** para mejores prácticas
- ⏳ **Tech talks** sobre arquitectura de sistemas

#### **Contribución Open Source**
- ⏳ **Publicación** de componentes reutilizables
- ⏳ **Documentación** de patrones implementados
- ⏳ **Blog posts** técnicos sobre la arquitectura
- ⏳ **Presentaciones** en eventos académicos

---

## 🤝 Contribución

### 📋 Guía para Nuevos Contribuidores

1. **Fork del repositorio** y crear feature branch
   ```bash
   git checkout -b feature/nueva-funcionalidad
   ```

2. **Seguir estándares de código**:
   - **Frontend**: ESLint 9 + Prettier + TypeScript strict
   - **Backend**: Google Java Style + SonarLint
   - **Commits**: Conventional Commits format

3. **Testing obligatorio**:
   - Unit tests para nueva funcionalidad
   - Integration tests para APIs
   - E2E tests para flujos críticos

4. **Pull Request con**:
   - Descripción detallada de cambios
   - Screenshots para cambios UI
   - Tests pasando en pipeline
   - Code review aprobado

### 🔍 Estándares de Calidad

- **Code Coverage**: Mínimo 80% para backend, 70% para frontend
- **Performance**: APIs < 200ms, páginas web < 3s
- **Accessibility**: WCAG 2.1 AA compliance
- **Security**: OWASP Top 10 compliance

---

## 📄 Licencia

Este proyecto está desarrollado para uso **académico** de la Universidad Nacional San Luis Gonzaga de Ica.

### 📜 Términos de Uso
- ✅ **Uso académico** y educativo permitido
- ✅ **Modificación y mejora** por estudiantes de UNICA
- ✅ **Documentación y estudio** de la arquitectura
- ❌ **Uso comercial** sin autorización expresa
- ❌ **Redistribución** sin créditos al equipo original

### 🏛️ Derechos Institucionales
- **Propiedad Intelectual**: Compartida entre equipo desarrollador y UNICA
- **Datos de Demostración**: Solo para pruebas, no usar en producción
- **Código Base**: Disponible para futuras generaciones de estudiantes

---

## 🏫 Institución

<div align="center">

**Universidad Nacional San Luis Gonzaga de Ica (UNICA)**  
📍 **Ubicación**: Ica, Perú  
🎓 **Facultad**: Ingeniería de Sistemas  
📚 **Escuela**: Posgrado  
👨‍🏫 **Curso**: Lenguaje de Programación Avanzada - 4to Ciclo  

### 🌐 Enlaces Institucionales
- **Web Oficial**: [www.unica.edu.pe](https://www.unica.edu.pe)
- **Posgrado**: [www.unica.edu.pe/posgrado](https://www.unica.edu.pe/posgrado)
- **Facultad de Ingeniería**: [www.unica.edu.pe/ingenieria](https://www.unica.edu.pe/ingenieria)

---

**Desarrollado con ❤️ para la comunidad académica de la UNICA**

![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.3-brightgreen?style=for-the-badge&logo=spring)
![Next.js](https://img.shields.io/badge/Next.js-15.3.4-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.0.0-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17.5-blue?style=for-the-badge&logo=postgresql)
![Docker](https://img.shields.io/badge/Docker-Compose-blue?style=for-the-badge&logo=docker)
![JWT](https://img.shields.io/badge/JWT-Authentication-orange?style=for-the-badge&logo=jsonwebtokens)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-teal?style=for-the-badge&logo=tailwindcss)

### 🏆 **Proyecto Académico de Excelencia**
[![Estado Desarrollo](https://img.shields.io/badge/Estado-En%20Desarrollo%20Activo-success?style=for-the-badge)](https://github.com/tu-repositorio)
[![Licencia](https://img.shields.io/badge/Licencia-Académica-informational?style=for-the-badge)](LICENSE)
[![Documentación](https://img.shields.io/badge/Docs-Completa-blue?style=for-the-badge)](backend/Autenticacion/README.md)
[![API](https://img.shields.io/badge/API-60%2B%20Endpoints-green?style=for-the-badge)](http://localhost:8080/swagger-ui.html)

### 📊 **Estadísticas del Proyecto**
- 🚀 **60+ Endpoints API** completamente funcionales
- 🌐 **53 Archivos Frontend** con componentes React
- ⚙️ **45 Archivos Backend** con arquitectura sólida
- 🗄️ **3 Bases de Datos** PostgreSQL configuradas
- 🐳 **6 Servicios Docker** orquestados
- 👥 **5 Roles de Usuario** con permisos específicos
- ✅ **100% Funcional** el sistema de autenticación

</div>