import "./globals.css";
import Navbar from "@/components/layout/Navbar/Navbar";
import Footer from "@/components/layout/Footer/Footer";

export const metadata = {
  title: "Universidad Nacional San Luis Gonzaga - UNICA",
  description:
    "Universidad Nacional San Luis Gonzaga, formando profesionales de excelencia en Ica, Perú",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
