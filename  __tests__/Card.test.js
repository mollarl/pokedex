import { render, screen, waitFor } from '@testing-library/react';
import PokemonDisplay from '../src/app/components/PokemonDisplay';
import axios from 'axios';

jest.mock('axios');

test('Debe renderizar la lista de pokemones', async () => {
  // Configurar el mock de axios para que retorne los datos simulados
  axios.get.mockResolvedValue({
    data: [
      { name: 'bulbasaur', image: '/bulbasaur.png', abilities: ['overgrow'], types: ['grass', 'poison'] },
      { name: 'charmander', image: '/charmander.png', abilities: ['blaze'], types: ['fire'] },
    ]
  });

  // Renderizar el componente con los datos mockeados y un término de búsqueda vacío
  render(
    <PokemonDisplay 
      pokemonList={[
        { name: 'bulbasaur', image: '/bulbasaur.png', abilities: ['overgrow'], types: ['grass', 'poison'] },
        { name: 'charmander', image: '/charmander.png', abilities: ['blaze'], types: ['fire'] },
      ]}
      searchTerm=""
    />
  );


  await waitFor(() => {
    const bulbasaur = screen.getByTestId('pokemon-name-bulbasaur');
    const charmander = screen.getByTestId('pokemon-name-charmander');
    
    expect(bulbasaur).toBeInTheDocument();
    expect(charmander).toBeInTheDocument();
  });
});

test('Debe mostrar mensaje cuando no se encuentran pokemones con el nombre de búsqueda', async () => {
  // Renderizar el componente con un término de búsqueda que no coincida con ningún Pokemon
  render(
    <PokemonDisplay 
      pokemonList={[]}
      searchTerm="xxxxx"
    />
  );

  // Verificar que el mensaje de "no se encontraron pokemones" se muestra
  const message = screen.getByTestId('detail-heading');
  expect(message).toBeInTheDocument();
});