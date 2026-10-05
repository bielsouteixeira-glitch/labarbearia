import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

const siteTitle = "La Barbearia | Corte, barba e agendamento online";
const siteDescription =
  "Conheça a La Barbearia, consulte serviços e valores na agenda oficial e agende seu horário online pelo Salonsoft.";
const logoUrl = "/images/la-barbearia/logo-la-barbearia.png";

// Netlify exposes the deployed URL at build time. Falls back so local
// development and `next build` outside Netlify still produce valid metadata.
const siteUrl =
  process.env.URL ?? process.env.DEPLOY_PRIME_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: siteTitle,
  description: siteDescription,
  applicationName: "La Barbearia",
  category: "Barbearia",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    type: "website",
    locale: "pt_BR",
    siteName: "La Barbearia",
    images: [
      {
        url: logoUrl,
        alt: "Emblema oficial da La Barbearia",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: [logoUrl],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
