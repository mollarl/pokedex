import "@/styles/globals.css";
import "@/styles/main.css";

export const metadata = {
  title: "Pokédex",
  description: "Pokédex react next",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        {children}
      </body>
    </html>
  );
}