import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app header', () => {
  render(<App />);
  // The app header contains the title text
  const header = screen.getByText(/OT Closet Inventory/i);
  expect(header).toBeInTheDocument();
});
