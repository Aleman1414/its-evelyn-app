import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from './Login';

const MockLogin = () => (
  <BrowserRouter>
    <Login />
  </BrowserRouter>
);

describe('Login Component', () => {
  test('renders login form', () => {
    render(<MockLogin />);
    expect(screen.getByText(/iniciar sesión/i)).toBeInTheDocument();
  });
});