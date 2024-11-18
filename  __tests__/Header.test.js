import { render, screen } from '@testing-library/react';
import Header from '../src/app/page';

describe('Search component', () => {
  test('Tiene que mostrar el encabezado con input y button', () => {
    // Renderiza el componente
    render(<Header />);
    
    // Verifica contenedor (ahora usando `getByRole` o `getByTestId`)
    const searchContainer = screen.getByTestId('search-container');
    expect(searchContainer).toBeInTheDocument();

    // Verifica el input con el placeholder
    const searchInput = screen.getByPlaceholderText('Pikachu, Charmander ...');
    expect(searchInput).toBeInTheDocument();
    
    // Verifica el botón
    const searchButton = screen.getByRole('button', { name: /search/i });
    expect(searchButton).toBeInTheDocument();

  });
});