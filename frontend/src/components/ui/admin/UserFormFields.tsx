import { UserFormFieldsProps } from "@/types/Admin";

export default function UserFormFields({ 
  formData, 
  isEditMode,
  onChange 
}: UserFormFieldsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nombres *
        </label>
        <input
          type="text"
          value={formData.nombres}
          onChange={(e) => onChange('nombres', e.target.value)}
          className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Ingrese los nombres"
          title="Nombres del usuario"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Apellidos *
        </label>
        <input
          type="text"
          value={formData.apellidos}
          onChange={(e) => onChange('apellidos', e.target.value)}
          className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Ingrese los apellidos"
          title="Apellidos del usuario"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email *
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => onChange('email', e.target.value)}
          className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="correo@ejemplo.com"
          title="Correo electrónico del usuario"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          DNI *
        </label>
        <input
          type="text"
          value={formData.dni || ''}
          onChange={(e) => onChange('dni', e.target.value)}
          className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="12345678"
          title="Documento Nacional de Identidad"
          maxLength={8}
          pattern="[0-9]{8}"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Teléfono
        </label>
        <input
          type="tel"
          value={formData.telefono || ''}
          onChange={(e) => onChange('telefono', e.target.value)}
          className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="987654321"
          title="Número de teléfono"
          maxLength={15}
        />
      </div>
      
      <div className="sm:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Dirección
        </label>
        <input
          type="text"
          value={formData.direccion || ''}
          onChange={(e) => onChange('direccion', e.target.value)}
          className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Ingrese la dirección completa"
          title="Dirección de residencia"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Usuario *
        </label>
        <input
          type="text"
          value={formData.username}
          onChange={(e) => onChange('username', e.target.value)}
          className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Nombre de usuario"
          title="Nombre de usuario para el sistema"
          required
        />
      </div>
      
      {!isEditMode && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contraseña *
          </label>
          <input
            type="password"
            value={formData.password || ''}
            onChange={(e) => onChange('password', e.target.value)}
            className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Contraseña del usuario"
            title="Contraseña para el usuario"
            required
          />
        </div>
      )}
      
      <div className={isEditMode ? "sm:col-span-2" : ""}>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Rol *
        </label>
        <select
          value={formData.role}
          onChange={(e) => onChange('role', e.target.value)}
          className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          title="Seleccione el rol del usuario"
          required
        >
          <option value="POSTULANTE">Postulante</option>
          <option value="ALUMNO">Alumno</option>
          <option value="DOCENTE">Docente</option>
          <option value="COORDINADOR">Coordinador</option>
          <option value="ADMIN">Administrador</option>
        </select>
      </div>
      
      {(formData.role === 'ALUMNO' || formData.role === 'POSTULANTE') && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Código de Estudiante
          </label>
          <input
            type="text"
            value={formData.codigoEstudiante || ''}
            onChange={(e) => onChange('codigoEstudiante', e.target.value)}
            className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Código de estudiante"
            title="Código único del estudiante"
          />
        </div>
      )}
      
      {(formData.role === 'DOCENTE' || formData.role === 'COORDINADOR') && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Código de Docente
            </label>
            <input
              type="text"
              value={formData.codigoDocente || ''}
              onChange={(e) => onChange('codigoDocente', e.target.value)}
              className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Código de docente"
              title="Código único del docente"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Especialidad
            </label>
            <input
              type="text"
              value={formData.especialidad || ''}
              onChange={(e) => onChange('especialidad', e.target.value)}
              className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Especialidad del docente"
              title="Área de especialización"
            />
          </div>
        </>
      )}
      
      {formData.role === 'POSTULANTE' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Programa de Interés
          </label>
          <input
            type="text"
            value={formData.programaInteres || ''}
            onChange={(e) => onChange('programaInteres', e.target.value)}
            className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Programa académico de interés"
            title="Programa al que desea postular"
          />
        </div>
      )}
      
      {isEditMode && (
        <div className="sm:col-span-2">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-amber-700 text-sm">
              <strong>Nota:</strong> Para cambiar la contraseña, debe hacerse a través de un proceso separado de seguridad.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
