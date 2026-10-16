"use client";

import Link from "next/link";
import { CharacterCard } from "@/components/character-card";
import { EpisodeCard } from "@/components/episode-card";
import { useFavorites } from "@/lib/favorites-context";

export default function FavoritesPage() {
  const { favorites } = useFavorites();

  return (
    <main className="page-shell">
      <section className="page-intro">
        <p className="eyebrow">TU COLECCIÓN PERSONAL</p>
        <h1>Favoritos<span className="title-dot">.</span></h1>
        <p className="intro-copy">Guarda personajes y episodios para volver a ellos cuando quieras.</p>
      </section>

      {favorites.length === 0 ? (
        <div className="message-panel">
          <span className="empty-icon" aria-hidden="true">♡</span>
          <h2>Aún no tienes favoritos</h2>
          <p>Explora el multiverso y guarda lo que más te guste.</p>
          <Link className="button-link" href="/characters">Explorar personajes</Link>
        </div>
      ) : (
        <>
          <p className="results-summary">{favorites.length} elementos guardados</p>
          <div className="card-grid">
            {favorites.map((favorite) =>
              favorite.kind === "character" ? (
                <CharacterCard key={`character-${favorite.data.id}`} character={favorite.data} />
              ) : (
                <EpisodeCard key={`episode-${favorite.data.id}`} episode={favorite.data} />
              ),
            )}
          </div>
        </>
      )}
    </main>
  );
}
