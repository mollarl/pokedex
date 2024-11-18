import { render, screen, waitFor } from '@testing-library/react';
import Page from '../src/app/page';
import axios from 'axios';

jest.mock('axios');

describe('PokList', () => {
  
  test('Muestra loader antes de finalizar la carga', () => {
    // Simula que la API aún no ha respondido
    axios.get.mockImplementationOnce(() => new Promise(() => {}));

    // Renderiza la página
    render(<Page />);

    // Verifica que el loader se muestre
    const loader = screen.getByTestId('loader');
    expect(loader).toBeInTheDocument();
  });
});