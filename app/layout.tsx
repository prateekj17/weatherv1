import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "WeatherIQ — Live Weather Intelligence", description: "Live weather, seven-day forecasts and weather analytics for any city." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}