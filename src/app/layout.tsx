import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { DEFAULT_METADATA } from "@/lib/constants/metadata";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "900"],
  variable: "--font-poppins",
  display: "swap",
});

// Mangueira Black is not available on Google Fonts.
// Once the .woff2 file is provided, uncomment the localFont import below
// and add the mangueira.variable to the html className.
// For now, headings use Poppins weight 900 as a fallback via the CSS variable.
//
// import localFont from "next/font/local";
// const mangueira = localFont({
//   src: [{ path: "../../public/fonts/MangueiraBlack.woff2", weight: "900", style: "normal" }],
//   variable: "--font-mangueira",
//   display: "swap",
// });

export const metadata: Metadata = DEFAULT_METADATA;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-GT" className={`${poppins.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-body text-navy">
        {children}
        <GoogleAnalytics />
      </body>
    </html>
  );
}
