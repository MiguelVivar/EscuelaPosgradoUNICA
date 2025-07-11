# 📅 Períodos Académicos - Implementación

## 📋 Descripción

La página de Períodos Académicos ha sido implementada para conectarse con el **microservicio de Matrícula** a través de su API REST. Esta implementación sigue la arquitectura de microservicios del proyecto y se conecta a la base de datos PostgreSQL dedicada `matricula`.

## 🏗️ Arquitectura Implementada

```
┌─────────────────┐    HTTP/REST    ┌─────────────────┐    JPA/Hibernate    ┌─────────────────┐
│   Frontend      │◄─────────────►  │ Microservicio   │◄─────────────────►  │  PostgreSQL     │
│  Next.js 15     │    Port 8082    │   Matrícula     │     Port 5432       │ Base: matricula │
│ (Port 3000)     │                 │ Spring Boot 3.5 │                     │                 │
└─────────────────┘                 └─────────────────┘                     └─────────────────┘
```

## 📁 Archivos Creados/Modificados

### 1. **Servicio de Matrícula** 
📄 `frontend/src/services/matriculaService.ts`

- **Funcionalidades**:
  - ✅ `getPeriodosAcademicos()` - Obtener todos los períodos
  - ✅ `createPeriodoAcademico()` - Crear nuevo período
  - ✅ `updatePeriodoAcademico()` - Actualizar período existente
  - ✅ `deletePeriodoAcademico()` - Eliminar período
  - ✅ `togglePeriodoHabilitado()` - Cambiar estado habilitado
  - ✅ `checkHealth()` - Verificar estado del servicio

- **Manejo de Errores**:
  - Verificación de estado del servicio
  - Manejo graceful de servicios no disponibles
  - Mensajes de error informativos
  - Fallback a datos vacíos en caso de error

### 2. **Componente de Estado de Servicio**
📄 `frontend/src/components/ui/ServiceStatus.tsx`

- **Características**:
  - Indicador visual del estado del servicio (activo/inactivo)
  - Botón de reintentar conexión
  - Animación de carga durante verificación
  - Diseño consistente con la UI del proyecto

### 3. **Página Principal Actualizada**
📄 `frontend/src/app/campus-virtual/matricula/periodos-academicos/page.tsx`

- **Mejoras Implementadas**:
  - Conexión real con API del microservicio
  - Indicador de estado del servicio en tiempo real
  - Manejo de errores y estados de carga
  - Validaciones mejoradas para formularios
  - Mensajes informativos cuando el servicio no está disponible

### 4. **Variables de Entorno**
📄 `frontend/.env.local`

```env
# URLs de los microservicios
NEXT_PUBLIC_MATRICULA_API_URL=http://localhost:8082
NEXT_PUBLIC_INTRANET_API_URL=http://localhost:8081
```

## 🔌 Endpoints de API Utilizados

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/periodos-academicos` | Obtener todos los períodos |
| `POST` | `/api/periodos-academicos` | Crear nuevo período |
| `PUT` | `/api/periodos-academicos/{id}` | Actualizar período |
| `DELETE` | `/api/periodos-academicos/{id}` | Eliminar período |
| `PATCH` | `/api/periodos-academicos/{id}/toggle-habilitado` | Cambiar estado |
| `GET` | `/actuator/health` | Health check del servicio |

## 🗄️ Modelo de Datos

### PeriodoAcademico Interface

```typescript
interface PeriodoAcademico {
  id: number;
  nombre: string;                 // ej: "2025-I"
  anio: string;                  // ej: "2025"
  semestre: string;              // "I", "II", "VERANO"
  fechaInicio: string;           // ISO date
  fechaFin: string;              // ISO date
  fechaInicioMatricula: string;  // ISO date
  fechaFinMatricula: string;     // ISO date
  activo: boolean;               // Estado del período
  habilitado: boolean;           // Habilitado para matrícula
  descripcion?: string;          // Descripción opcional
  fechaCreacion: string;         // ISO date
  fechaActualizacion: string;    // ISO date
}
```

## 🚀 Estado Actual

### ✅ Implementado y Funcional
- **Frontend**: Completamente implementado con UI moderna
- **Servicio**: Conexión con API del microservicio
- **Manejo de Estados**: Loading, error, y estados vacíos
- **Validaciones**: Formularios con validación cliente
- **UX**: Indicadores de estado del servicio

### 🏗️ Pendiente (Backend)
- **Microservicio de Matrícula**: Implementación de controladores
- **Base de Datos**: Creación de entidades JPA
- **Servicios**: Lógica de negocio del backend
- **Autenticación**: Integración con JWT del microservicio Auth

## 🛠️ Próximos Pasos

### 1. **Implementar Backend del Microservicio de Matrícula**

```java
// Ejemplo de entidad JPA necesaria
@Entity
@Table(name = "periodos_academicos")
public class PeriodoAcademico {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String nombre;
    
    // ... otros campos
}
```

### 2. **Crear Controlador REST**

```java
@RestController
@RequestMapping("/api/periodos-academicos")
public class PeriodoAcademicoController {
    
    @GetMapping
    public ResponseEntity<List<PeriodoAcademico>> obtenerTodos() {
        // Implementación
    }
    
    @PostMapping
    public ResponseEntity<PeriodoAcademico> crear(@RequestBody PeriodoForm form) {
        // Implementación
    }
    
    // ... otros endpoints
}
```

### 3. **Configurar Base de Datos**

```sql
-- Script SQL para la tabla
CREATE TABLE periodos_academicos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(20) NOT NULL UNIQUE,
    anio VARCHAR(4) NOT NULL,
    semestre VARCHAR(10) NOT NULL,
    fecha_inicio TIMESTAMP NOT NULL,
    fecha_fin TIMESTAMP NOT NULL,
    fecha_inicio_matricula TIMESTAMP NOT NULL,
    fecha_fin_matricula TIMESTAMP NOT NULL,
    activo BOOLEAN DEFAULT true,
    habilitado BOOLEAN DEFAULT false,
    descripcion TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🧪 Cómo Probar

### 1. **Con Microservicio Activo**
```bash
# Iniciar todos los servicios
docker-compose up -d

# Verificar servicios
curl http://localhost:8082/actuator/health
```

### 2. **Sin Microservicio (Modo Desarrollo)**
- El frontend muestra mensaje informativo
- Indica estado "Servicio Inactivo"
- Opción para reintentar conexión
- No se rompe la aplicación

### 3. **Funcionalidades Probables**
- ✅ Visualización de estado del servicio
- ✅ Manejo graceful de errores
- ✅ UI responsive y moderna
- ✅ Validaciones de formulario
- 🔄 CRUD completo (cuando backend esté listo)

## 📊 Beneficios de esta Implementación

1. **🔄 Preparado para Microservicios**: Arquitectura lista para cuando el backend esté implementado
2. **🛡️ Manejo de Errores**: No se rompe si el servicio no está disponible
3. **👤 UX Mejorada**: Indicadores claros del estado del sistema
4. **🔧 Mantenible**: Código modular y bien estructurado
5. **📱 Responsive**: Funciona en todos los dispositivos
6. **⚡ Performance**: Carga eficiente y optimizada

## 🎯 Conclusión

La implementación está **lista para producción** una vez que el microservicio de Matrícula esté desarrollado. El frontend proporciona una experiencia de usuario completa y maneja elegantemente tanto los casos de éxito como los de error.

El código sigue las mejores prácticas de React/Next.js y está preparado para escalar con la arquitectura de microservicios del proyecto.
