import type { Metadata } from "next";
import { FavoritesProvider } from "@/lib/favorites-context";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Portal Dimensional | Rick y Morty",
    template: "%s | Portal Dimensional",
  },
  description: "Explora personajes y episodios del universo de Rick y Morty.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es">
      <body>
        <FavoritesProvider>
          <div className="site-background">
            <SiteHeader />
            {children}
            <SiteFooter />
          </div>
        </FavoritesProvider>
      </body>
    </html>
  );
}
