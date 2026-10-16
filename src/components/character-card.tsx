import Image from "next/image";
import Link from "next/link";
import { FavoriteButton } from "@/components/favorite-button";
import type { Character } from "@/lib/types";

export function CharacterCard({ character }: { character: Character }) {
  return (
    <article className="character-card">
      <Link className="character-image-link" href={`/characters/${character.id}`}>
        <Image
          className="character-image"
          src={character.image}
          alt={character.name}
          width={400}
          height={400}
          sizes="(max-width: 640px) 100vw, (max-width: 1000px) 50vw, 25vw"
        />
        <span className={`status-badge status-${character.status.toLowerCase()}`}>
          <span aria-hidden="true" />{character.status}
        </span>
      </Link>
      <div className="card-content">
        <div className="card-title-row">
          <Link href={`/characters/${character.id}`}><h2>{character.name}</h2></Link>
          <FavoriteButton item={{ kind: "character", data: character }} />
        </div>
        <p><span>Especie</span>{character.species}</p>
        <p><span>Ubicación</span>{character.location.name}</p>
      </div>
    </article>
  );
}
