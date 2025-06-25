import "./globals.css";
import Navbar from "@/components/layout/Navbar/Navbar";
import Footer from "@/components/layout/Footer/Footer";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata = {
  title: "Universidad Nacional San Luis Gonzaga - UNICA",
  description:
    "Universidad Nacional San Luis Gonzaga, formando profesionales de excelencia en Ica, Perú",
  icons: {
    icon: "/logoPosgrado.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>
          <Navbar />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
