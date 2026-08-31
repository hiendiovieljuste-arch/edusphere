import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "EduSphere",
  description: "La plateforme éducative complète",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
