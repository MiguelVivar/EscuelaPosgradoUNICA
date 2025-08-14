import "./globals.css";
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/contexts/AuthContext";
import ConditionalLayout from "@/components/layout/ConditionalLayout";

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
    <>
    <html lang="es">
      <body className="bg-white">
        <AuthProvider>
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
        </AuthProvider>
      </body>
    </html>
    <Analytics />
    </>
  );
}
