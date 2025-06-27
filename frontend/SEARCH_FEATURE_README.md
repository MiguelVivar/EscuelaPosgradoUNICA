# 🔍 Funcionalidad de Búsqueda de Usuarios - Gestión de Usuarios

## 📋 Descripción
Se ha agregado una funcionalidad de búsqueda avanzada para buscar usuarios por nombres y apellidos en el panel de administración.

## ✨ Características Implementadas

### 🔗 Backend
- **Nuevo endpoint**: `GET /api/admin/usuarios/buscar?texto={texto}`
- **Método en AuthService**: `buscarUsuariosPorNombre(String texto)`
- **Query en UsuarioRepository**: Búsqueda en campos `nombres`, `apellidoPaterno` y `apellidoMaterno`
- **Búsqueda insensible a mayúsculas/minúsculas** con coincidencias parciales

### 🎨 Frontend
- **Campo de búsqueda** con icono de lupa integrado
- **Búsqueda automática** con debounce de 800ms tras escribir 2+ caracteres
- **Botón de limpiar búsqueda** (X) cuando hay texto ingresado
- **Indicador visual** de búsqueda en progreso con spinner
- **Integración con filtros** existentes (rol e inactivos)
- **Responsive design** para dispositivos móviles

## 🚀 Cómo Usar

### Para Usuarios
1. **Acceder** al panel de administración (`/campus-virtual/admin`)
2. **Escribir** en el campo de búsqueda (mínimo 2 caracteres)
3. **Esperar** 800ms o presionar **Enter** para búsqueda inmediata
4. **Hacer clic** en el botón "Buscar" para búsqueda manual
5. **Limpiar** la búsqueda haciendo clic en la "X" o borrando todo el texto

### Ejemplos de Búsqueda
- `"Juan"` → Encuentra usuarios con "Juan" en nombres o apellidos
- `"García"` → Encuentra usuarios con "García" en apellidos
- `"Ana Mar"` → Encuentra usuarios con "Ana" y "Mar" en cualquier campo

## 🔧 Detalles Técnicos

### Backend - Endpoint
```java
@GetMapping("/usuarios/buscar")
public ResponseEntity<List<UsuarioResponse>> buscarUsuarios(
    @RequestParam String texto) {
    List<UsuarioResponse> usuarios = authService.buscarUsuariosPorNombre(texto);
    return ResponseEntity.ok(usuarios);
}
```

### Frontend - Integración
```tsx
// Estado de búsqueda
const [searchText, setSearchText] = useState<string>('');
const [isSearching, setIsSearching] = useState(false);

// Función de búsqueda con debounce
const handleSearchChange = (text: string) => {
    setSearchText(text);
    if (text.trim().length >= 2) {
        setTimeout(() => searchUsers(), 800);
    }
};
```

## 🛡️ Seguridad
- **Autenticación requerida**: JWT token válido
- **Autorización**: Solo usuarios con rol `ADMIN` pueden usar la búsqueda
- **Validación**: Parámetros sanitizados en backend
- **Rate limiting**: Debounce previene consultas excesivas

## 📱 Responsive Design
- **Desktop**: Botones con texto completo
- **Mobile**: Iconos compactos para mejor UX
- **Input responsivo** con placeholder adaptativo

## 🎯 Beneficios
- ✅ **Búsqueda rápida** de usuarios por nombre/apellido
- ✅ **Experiencia fluida** con debounce automático
- ✅ **Filtros combinables** con búsqueda
- ✅ **Interfaz intuitiva** con feedback visual
- ✅ **Performance optimizada** con consultas específicas

## 🔄 Compatibilidad
- **Compatible** con filtros de rol existentes
- **Compatible** con filtro de usuarios inactivos
- **Mantiene** funcionalidad original de gestión de usuarios
- **No afecta** otros componentes del sistema
