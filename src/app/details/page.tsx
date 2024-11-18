import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import "@/styles/pagedetails.css";

export async function generateMetadata({ searchParams } : { searchParams: any }) {
  const { name } = await searchParams;
  return {
    title: name ? `Detalles de ${name} - Pokédex` : "Detalles del Pokémon - Pokédex",
    description: name
      ? `Detalles completos del Pokémon ${name}.`
      : "Explorá los detalles de los Pokémon en la Pokédex.",
  };
}

export default async function DetailsPage({ searchParams }: { searchParams: any }) {
  const { name } = await searchParams;

  let pokemonDetails: {
    name: string;
    image: string;
    image2: string;
    abilities: string[];
    types: string[];
    stats: { name: string; base_stat: number }[];
  } | null = null;

  if (name) {
    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
      const details = response.data;

      // Tipado
      pokemonDetails = {
        name: details.name,
        image: details.sprites.front_default,
        image2: details.sprites.back_default,
        abilities: details.abilities.map((ability: { ability: { name: string } }) => ability.ability.name),
        types: details.types.map((type: { type: { name: string } }) => type.type.name),
        stats: details.stats.map((stat: { base_stat: number; stat: { name: string } }) => ({
          name: stat.stat.name,
          base_stat: stat.base_stat,
        })),
      };
    } catch (error) {
      console.error('Error fetching Pokémon details:', error);
    }
  }

  return (
    <div className="page page-details">
      <header className="header header-details">
        <h1>Pokédex</h1>
        <h2 style={{ textAlign: "center" }}>
          Detalles de <span style={{ textTransform: "capitalize" }}>{name}</span>
        </h2>
      </header>
      <main>
        {pokemonDetails ? (
          <div className="card">
            <h2 className="card-name">{name}</h2>
            <div className="card-img-container">
              <Image src={pokemonDetails.image} quality={25} className="card-img" width={100} height={100} alt={`Imagen de ${name}`} ></Image>
              {pokemonDetails.image2 && (<Image src={pokemonDetails.image2} quality={25} className="card-img" width={100} height={100} alt={`Imagen de atrás de ${name}`} ></Image>)}
              
            </div>
            <div className="types-container">
            <h3 className="card-data">Tipo:</h3>
              {pokemonDetails.types.map((type) => (
                <span className={`card-label ${type}`} key={type}>
                  {type}
                </span>
              ))}
            </div>
            <h3 className="card-data">Habilidades:</h3>
              {pokemonDetails.abilities.map((ability) => (
                <span className="card-label" key={ability}>
                {ability}</span>
              ))}
            <h3 className="card-data">Estadísticas:</h3>
            <div className="stats-container">
              {pokemonDetails.stats.map((stat) => (
                <div key={stat.name} className="stat">
                  <span className="stat-name">{stat.name.toUpperCase()}</span>
                  <div className="stat-bar">
                    <div
                      className="stat-bar-fill"
                      style={{
                        width: `${Math.min(stat.base_stat, 100)}%`,
                      }}
                    ></div>
                  </div>
                  <span className="stat-value">{stat.base_stat}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p>No se encontraron detalles para este Pokémon.</p>
        )}
      </main>
      <Link href="/" className='fixed-link'>Volver</Link>
    </div>
  );
}