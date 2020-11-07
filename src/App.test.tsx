import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders link to Home page', () => {
  const { getByText } = render(<App />);
  const homeLink = getByText('Login');
  expect(homeLink).toBeInTheDocument();
});
