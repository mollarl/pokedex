import { render, screen, waitFor } from '@testing-library/react';
import PokemonDisplay from '../src/app/components/PokemonDisplay';
import axios from 'axios';

// Mockear axios
jest.mock('axios');

test('Debe renderizar la lista de pokemones', async () => {
  // Configurar el mock de axios para que retorne los datos simulados
  axios.get.mockResolvedValue({
    data: [
      { name: 'bulbasaur', image: '/bulbasaur.png', abilities: ['overgrow'], types: ['grass', 'poison'] },
      { name: 'charmander', image: '/charmander.png', abilities: ['blaze'], types: ['fire'] },
    ]
  });

  // Renderizar el componente con los datos mockeados
  render(
    <PokemonDisplay 
      initialPokemonList={[
        { name: 'bulbasaur', image: '/bulbasaur.png', abilities: ['overgrow'], types: ['grass', 'poison'] },
        { name: 'charmander', image: '/charmander.png', abilities: ['blaze'], types: ['fire'] },
      ]}
      searchTerm=""
    />
  );

  // Esperar a que los elementos de los Pokémon sean renderizados
  await waitFor(() => {
    const bulbasaur = screen.getByTestId('pokemon-name-bulbasaur');
    const charmander = screen.getByTestId('pokemon-name-charmander');
    
    expect(bulbasaur).toBeInTheDocument();
    expect(charmander).toBeInTheDocument();
  });
});