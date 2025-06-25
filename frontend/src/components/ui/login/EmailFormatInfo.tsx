export default function EmailFormatInfo() {
  return (
    <div className="mt-8 max-w-2xl mx-auto">
      <div className="bg-gradient-to-r from-amber-50/80 to-orange-50/80 backdrop-blur-sm border border-amber-200/50 rounded-2xl p-6 shadow-lg">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 p-2 bg-amber-100 rounded-full">
            <svg
              className="h-6 w-6 text-amber-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-amber-800 mb-1">
              Formato de Correo Institucional
            </h3>
            <p className="text-sm text-amber-700">
              Tu correo institucional debe tener el formato{" "}
              <span className="font-semibold">12345678@unica.edu.pe</span> (8
              dígitos seguidos de @unica.edu.pe). Este corresponde a tu código
              de estudiante o trabajador.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
