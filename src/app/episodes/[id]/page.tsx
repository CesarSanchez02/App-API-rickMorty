import Link from "next/link";
import { notFound } from "next/navigation";
import { FavoriteButton } from "@/components/favorite-button";
import { getEpisode } from "@/lib/rick-and-morty";

export default async function EpisodeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const episode = await getEpisode(id);
  if (!episode) notFound();

  const characterIds = episode.characters
    .map((url) => url.split("/").pop())
    .filter((characterId): characterId is string => Boolean(characterId));

  return (
    <main className="page-shell detail-shell">
      <Link className="back-link" href="/episodes">← Volver a episodios</Link>
      <article className="episode-detail-card">
        <div className="episode-detail-art">
          <p className="eyebrow">ARCHIVO INTERDIMENSIONAL · {episode.episode}</p>
          <span aria-hidden="true">✦</span>
          <h1>{episode.name}</h1>
          <div className="episode-detail-favorite">
            <FavoriteButton item={{ kind: "episode", data: episode }} />
          </div>
        </div>
        <div className="episode-detail-info">
          <div><span>Fecha de emisión</span><strong>{episode.air_date}</strong></div>
          <div><span>Código</span><strong>{episode.episode}</strong></div>
          <div><span>Personajes</span><strong>{characterIds.length}</strong></div>
        </div>
        <section className="episode-cast">
          <h2>Personajes de este episodio</h2>
          <div className="character-links">
            {characterIds.slice(0, 12).map((characterId) => (
              <Link key={characterId} href={`/characters/${characterId}`}>Personaje #{characterId} ↗</Link>
            ))}
          </div>
          {characterIds.length > 12 && <p>Y {characterIds.length - 12} personajes más en este episodio.</p>}
        </section>
      </article>
    </main>
  );
}
