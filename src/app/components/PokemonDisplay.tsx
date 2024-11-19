"use client";

import React from "react";
import Link from "next/link";
import { PokemonDetails } from "../types/pokemon";

interface PokemonDisplayProps {
  pokemonList: PokemonDetails[];
  searchTerm: string;
}

const PokemonDisplay: React.FC<PokemonDisplayProps> = ({
  pokemonList,
  searchTerm,
}) => {

  if (!pokemonList || pokemonList.length === 0 && searchTerm !== "") {
    return <p className="detail-heading" data-testid="detail-heading">No se encontraron pokemones con el nombre <strong>{searchTerm}</strong>. Intenta realizar otra búsqueda.</p>;
  }

  return (
  <>
    {
    (pokemonList && pokemonList.length !== 0 && searchTerm !== "") && (
      <h3 className="detail-heading">Resultados con el nombre <strong>{searchTerm}</strong>.</h3>)
    }
    <div className="listing">
      <ul className="list">
        {pokemonList.map((pokemon, index) => (
          <li className="card" data-testid={`pokemon-name-${pokemon.name}`} key={index}>
            <Link
              className="card-link"
              href={{
                pathname: "/details",
                query: { name: pokemon.name },
              }}
            >
              <h3 className="card-name">{pokemon.name}</h3>
              <img
                className="card-img"
                src={pokemon.image}
                alt={pokemon.name}
                loading={index < 2 ? "eager" : "lazy"}
              />
              <p className="card-data">
                {pokemon.types.map((type, index) => (
                  <span className={`card-label ${type}`} key={index}>
                    {type}
                  </span>
                ))}
              </p>
              <p className="card-data">
                <strong>Habilidades:</strong> {pokemon.abilities.join(", ")}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  </>
  );
};
export default PokemonDisplay;