import Image from "next/image";
import logoPosgrado from "@/assets/logoPosgrado.png";
import logoUNICA from "@/assets/logoUNICA.png";

export default function LoginBrandingSection() {
  return (
    <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 relative overflow-hidden flex flex-col justify-center items-center p-8 lg:p-12">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
      <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>

      <div className="relative z-10 text-center">
        {/* Logos */}
        <div className="flex justify-center items-center space-x-8 mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-white/20 rounded-3xl blur-xl"></div>
            <div className="relative bg-white/95 p-4 rounded-3xl shadow-2xl backdrop-blur-sm transform hover:scale-105 transition-transform duration-300">
              <Image
                src={logoUNICA}
                alt="Logo UNICA"
                width={80}
                height={80}
                className="object-contain"
              />
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-white/20 rounded-3xl blur-xl"></div>
            <div className="relative bg-white/95 p-4 rounded-3xl shadow-2xl backdrop-blur-sm transform hover:scale-105 transition-transform duration-300">
              <Image
                src={logoPosgrado}
                alt="Logo Posgrado"
                width={80}
                height={80}
                className="object-contain"
              />
            </div>
          </div>
        </div>

        {/* Título principal */}
        <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 drop-shadow-2xl">
          Bienvenido
        </h1>
        <h2 className="text-xl lg:text-2xl font-semibold text-white/95 mb-6 drop-shadow-lg">
          Escuela de Posgrado UNICA
        </h2>

        {/* Descripción */}
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
          <p className="text-white/90 text-lg leading-relaxed">
            &quot;Formando líderes para el futuro a través de la excelencia académica y la investigación de vanguardia&quot;
          </p>
        </div>

        {/* Elementos decorativos adicionales */}
        <div className="mt-8 flex justify-center space-x-4">
          <div className="w-3 h-3 bg-white/60 rounded-full animate-pulse"></div>
          <div
            className="w-3 h-3 bg-white/40 rounded-full animate-pulse"
            style={{ animationDelay: "0.5s" }}
          ></div>
          <div
            className="w-3 h-3 bg-white/60 rounded-full animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>
      </div>
    </div>
  );
}
