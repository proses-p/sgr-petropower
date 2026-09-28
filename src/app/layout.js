import "./globals.css";
import localFont from "next/font/local";

const manrope = localFont({
  src: "./fonts/manrope-latin-wght-normal.woff2",
  display: "swap",
  variable: "--font-manrope",
  weight: "200 800",
});

export const metadata = {
  title: { default: "SGR Petropower Engineering", template: "%s | SGR Petropower Engineering" },
  description: "SGR Petropower Engineering delivers disciplined engineering, construction, power and petroleum solutions.",
  openGraph: { title: "SGR Petropower Engineering", description: "Engineering confidence into complex industrial and energy projects.", type: "website" },
};


export default function RootLayout({ children }) {
  return (
    <html lang="en" className={manrope.variable}>
      <body>{children}</body>
    </html>
  );
}