"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

// Types poke
interface Pokemon {
  name: string;
  image: string;
  abilities: string[];
  types: string[];
}

// Propiedades que recibe el componente
interface PokemonDisplayProps {
  initialPokemonList: Pokemon[] | undefined;
  searchTerm: string;
}

export default function PokemonDisplay({
  initialPokemonList = [], // Valor predeterminado como array vacío si undefined
  searchTerm,
}: PokemonDisplayProps) {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>(initialPokemonList);

  useEffect(() => {
    if (!initialPokemonList || initialPokemonList.length === 0) {
      return; // Si la lista inicial es undefined o vacía, no hacer nada
    }

    if (searchTerm) {
      // Filtrar la lista inicial por coincidencia aproximada
      const filteredPokemon = initialPokemonList.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setPokemonList(filteredPokemon);
    } else {
      setPokemonList(initialPokemonList); // Reset de resultados iniciales
    }
  }, [searchTerm, initialPokemonList]); // Se ejecuta cada vez que searchTerm cambie y en la carga inicial

  if (!pokemonList || pokemonList.length === 0) {
    return <p></p>;
  }

  return (
    <ul className="list">
      {pokemonList.map((pokemon, index) => (
        <li className="card" key={index}>
          <Link
            className="card-link"
            href={{
              pathname: "/details",
              query: { name: pokemon.name },
            }}
          >
            <h3 className="card-name" data-testid={`pokemon-name-${pokemon.name}`}>{pokemon.name}</h3>
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
  );
}