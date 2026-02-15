import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat" });

export const metadata: Metadata = {
  title: "Anak Kampoeng Auto Garage | Luxury Custom & Service",
  description: "Bengkel kustom dan servis berkelas untuk mesin kesayangan lo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${inter.variable} ${montserrat.variable} font-sans bg-matte text-white antialiased`}>
        {children}
      </body>
    </html>
  );
}
