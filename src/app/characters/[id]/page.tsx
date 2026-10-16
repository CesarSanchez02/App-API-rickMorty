import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FavoriteButton } from "@/components/favorite-button";
import { getCharacter } from "@/lib/rick-and-morty";

export default async function CharacterDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const character = await getCharacter(id);
  if (!character) notFound();

  return (
    <main className="page-shell detail-shell">
      <Link className="back-link" href="/characters">← Volver a personajes</Link>
      <article className="detail-card">
        <div className="detail-image-wrap">
          <Image src={character.image} alt={character.name} width={600} height={600} priority />
        </div>
        <div className="detail-content">
          <p className="eyebrow">ARCHIVO DE PERSONAJE · #{character.id}</p>
          <div className="detail-heading">
            <h1>{character.name}</h1>
            <FavoriteButton item={{ kind: "character", data: character }} />
          </div>
          <p className="detail-status">
            <span className={`status-dot status-dot-${character.status.toLowerCase()}`} />
            {character.status === "Alive" ? "Vivo" : character.status === "Dead" ? "Muerto" : "Desconocido"}
          </p>
          <dl className="detail-facts">
            <div><dt>Especie</dt><dd>{character.species}</dd></div>
            <div><dt>Género</dt><dd>{character.gender}</dd></div>
            <div><dt>Tipo</dt><dd>{character.type || "Sin especificar"}</dd></div>
            <div><dt>Origen</dt><dd>{character.origin.name}</dd></div>
            <div><dt>Última ubicación</dt><dd>{character.location.name}</dd></div>
            <div><dt>Apariciones</dt><dd>{character.episode.length} episodios</dd></div>
          </dl>
        </div>
      </article>
    </main>
  );
}
