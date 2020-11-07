import React from 'react';
import { render } from '@testing-library/react'; 
import App from './App';

test('renders link to Feedback page', () => {
  const { getByText } = render(<App />);
  const aboutLink = getByText('Feedback');
  expect(aboutLink).toBeInTheDocument();
});
