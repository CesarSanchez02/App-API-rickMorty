import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="brand" href="/characters" aria-label="Portal Rick y Morty, inicio">
          <span className="brand-mark" aria-hidden="true">R&M</span>
          <span>PORTAL <strong>DIMENSIONAL</strong></span>
        </Link>
        <nav className="main-nav" aria-label="Navegación principal">
          <Link href="/characters">Personajes</Link>
          <Link href="/episodes">Episodios</Link>
          <Link href="/favorites">Favoritos <span aria-hidden="true">♥</span></Link>
        </nav>
      </div>
    </header>
  );
}
