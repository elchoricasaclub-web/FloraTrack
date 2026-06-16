import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import HideNextDevIndicator from "../components/floratrack/HideNextDevIndicator";
import AppStatusDock from "../components/ui/AppStatusDock";
import NavigationCloud from "../components/NavigationCloud";

export const metadata: Metadata = {
  title: "FloraTrack",
  description: "Enterprise Compliance Platform"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body>
        <HideNextDevIndicator />
        {children}
        <NavigationCloud />
        <AppStatusDock />
      </body>
    </html>
  );
}


