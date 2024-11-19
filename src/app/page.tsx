"use client";

import { Pokemon, PokemonDetails } from './types/pokemon';
import { useState, useEffect, startTransition } from "react";
import PokemonDisplay from './components/PokemonDisplay';
import { Search } from '@mui/icons-material';
import axios from 'axios';

export default function PokemonList() {
  const [searchTerm, setSearchTerm] = useState<string>(""); // Término de búsqueda
  const [allPokemonData, setAllPokemonData] = useState<Pokemon[]>([]); // Lista completa
  const [filteredPokemonList, setFilteredPokemonList] = useState<PokemonDetails[]>([]); // Lista filtrada de detalles
  const [loading, setLoading] = useState<boolean>(true); // Estado de carga
  const [offset, setOffset] = useState<number>(0); // Offset para la paginación
  const [totalPokemon, setTotalPokemon] = useState<number>(0);
  const [canLoadMore, setCanLoadMore] = useState<boolean>(true); // Si hay más para cargar
  const limit = 10; // Número de items por carga

  const fetchPokemonByBatch = async (offset: number, limit: number) => {
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
    return { results: response.data.results, count: response.data.count };
  };

  const fetchInitialPokemon = async () => {
    try {
      const { results, count } = await fetchPokemonByBatch(offset, limit);
      setTotalPokemon(count);
      const pokemonData = await Promise.all(
        results.map(async (pokemon: Pokemon) => {
          const detailsResponse = await axios.get(pokemon.url);
          const details = detailsResponse.data;
          return {
            name: details.name,
            image: details.sprites?.front_default || '',
            abilities: Array.isArray(details.abilities) 
            ? details.abilities.map((ability: { ability: { name: string } }) => ability.ability.name) 
            : [],
          types: Array.isArray(details.types)
            ? details.types.map((type: { type: { name: string } }) => type.type.name)
            : [],
        } as PokemonDetails;
        })
      );
      setFilteredPokemonList(pokemonData);
    } catch (error) {
      console.error('Error fetching initial Pokémon:', error);
      setFilteredPokemonList([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMorePokemon = async () => {
    try {
      const { results } = await fetchPokemonByBatch(offset + limit, limit);
      const pokemonData = await Promise.all(
        results.map(async (pokemon: Pokemon) => {
          const detailsResponse = await axios.get(pokemon.url);
          const details = detailsResponse.data;
          return {
            name: details.name,
            image: details.sprites.front_default,
            abilities: details.abilities.map((ability: { ability: { name: string } }) => ability.ability.name),
            types: details.types.map((type: { type: { name: string } }) => type.type.name),
          };
        })
      );
      setFilteredPokemonList((prev) => [...prev, ...pokemonData]); // Concatenar con los anteriores
      setOffset((prevOffset) => prevOffset + limit); // Incrementar offset
    } catch (error) {
      console.error('Error fetching more Pokémon:', error);
    }
  };

  // fetchInitialPokemon solo una vez cuando el componente se monta
  useEffect(() => {
    setLoading(true);
    startTransition(() => { // Reduce tiempo de bloqueo
      fetchInitialPokemon();
    });
  }, []);

  // Actualizar canLoadMore cuando cambien los datos
  useEffect(() => {
    setCanLoadMore(filteredPokemonList.length < totalPokemon);
  }, [filteredPokemonList, totalPokemon]);

  // Función para manejar la búsqueda
  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const searchValue = (e.currentTarget.search as HTMLInputElement).value.trim();
    if (!searchValue) return;

    setLoading(true);
    setOffset(0);
    try {
      let allData = allPokemonData;
      if (!allData.length) {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=10000`);
       allData = response.data.results || [];
        setAllPokemonData(allData);
      }

      const filtered = allData.filter((pokemon: Pokemon) =>
        pokemon.name.toLowerCase().includes(searchValue.toLowerCase())
      );

      const filteredData = await Promise.all(
        filtered.map(async (pokemon: { url: string }) => {
          const detailsResponse = await axios.get(pokemon.url);
          const details = detailsResponse.data;
          return {
            name: details.name,
            image: details.sprites.front_default,
            abilities: details.abilities.map((ability: { ability: { name: string } }) => ability.ability.name),
            types: details.types.map((type: { type: { name: string } }) => type.type.name),
          };
        })
      );

      startTransition(() => {
        setFilteredPokemonList(filteredData);
        setTotalPokemon(filtered.length);
        setSearchTerm(searchValue);
      });
    } catch (error) {
      console.error("Error fetching Pokémon:", error);
      setFilteredPokemonList([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      {loading && <div className='loader' data-testid="loader"></div>}
      <header className="header">
        <h1>Pokédex</h1>
        <h2>Indica el nombre del Pokémon que quieras buscar</h2>
        <form onSubmit={handleSearch}>
          <div className="search-container" data-testid="search-container">
            <input
              type="search"
              name="search"
              placeholder="Pikachu, Charmander ..."
              className="search-input"
            />
            <button className="search-button" color="primary" aria-label="search" type="submit">
              <Search />
            </button>
          </div>
        </form>
      </header>
      <main>
        <PokemonDisplay pokemonList={filteredPokemonList} searchTerm={searchTerm} />
      </main>
      {canLoadMore && !loading && (
        <button className="load-more" onClick={fetchMorePokemon} disabled={loading || !canLoadMore}>
          Ver más resultados
        </button>
      )}
    </div>
  );
}