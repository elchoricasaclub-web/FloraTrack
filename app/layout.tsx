import React from 'react';
import './globals.css';

export const metadata = {
  title: 'FloraTrack GACP',
  description: 'Sistema de Gestión y Trazabilidad GACP',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
