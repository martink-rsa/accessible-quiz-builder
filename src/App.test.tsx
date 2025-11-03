import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import App from './App';

test('toggles edit/preview modes', () => {
  render(<App />);
  expect(screen.getByText(/edit mode placeholder/i)).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: /preview/i }));
  expect(screen.getByText(/preview mode placeholder/i)).toBeInTheDocument();
});
