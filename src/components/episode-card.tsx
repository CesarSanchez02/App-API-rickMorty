import Link from "next/link";
import { FavoriteButton } from "@/components/favorite-button";
import type { Episode } from "@/lib/types";

export function EpisodeCard({ episode }: { episode: Episode }) {
  return (
    <article className="episode-card">
      <Link className="episode-art" href={`/episodes/${episode.id}`} aria-label={`Ver ${episode.name}`}>
        <span className="episode-number">EP {episode.episode.replace("S", "").replace("E", " · ")}</span>
        <span className="episode-orbit" aria-hidden="true">✦</span>
        <span className="episode-art-caption">ARCHIVO INTERDIMENSIONAL</span>
      </Link>
      <div className="card-content">
        <div className="card-title-row">
          <Link href={`/episodes/${episode.id}`}><h2>{episode.name}</h2></Link>
          <FavoriteButton item={{ kind: "episode", data: episode }} />
        </div>
        <p><span>Emisión</span>{episode.air_date}</p>
        <p><span>Personajes</span>{episode.characters.length}</p>
      </div>
    </article>
  );
}
