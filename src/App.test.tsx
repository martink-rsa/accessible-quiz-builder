import { render, screen, fireEvent } from '@testing-library/react';
import { axe } from 'jest-axe';
import React from 'react';
import App from '@/App';
import { renderAndCheckA11y, checkA11y } from '@/test-utils';

test('toggles edit/preview modes', () => {
  render(<App />);

  // In edit mode, should see quiz title input
  expect(screen.getByLabelText(/quiz title/i)).toBeInTheDocument();
  expect(
    screen.getByRole('button', { name: /add first question/i }),
  ).toBeInTheDocument();

  // Switch to preview mode
  fireEvent.click(screen.getByRole('button', { name: /preview/i }));

  // In preview mode, should see preview content
  expect(
    screen.getByText(/No questions in this quiz yet/i),
  ).toBeInTheDocument();
  expect(screen.getByText(/Add questions in Edit mode/i)).toBeInTheDocument();
});

// Example 1: Using the renderAndCheckA11y helper for automatic accessibility testing
test('App component has no accessibility violations (using helper)', async () => {
  await renderAndCheckA11y(<App />);
  // The helper automatically checks for violations - test passes if no violations found
});

// Example 2: Explicit jest-axe usage for more control
test('App component has no accessibility violations (explicit)', async () => {
  const { container } = render(<App />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

// Example 3: Checking accessibility after user interactions
test('App remains accessible after toggling between modes', async () => {
  const { container } = render(<App />);

  // Check initial accessibility in Edit mode
  await checkA11y(container);

  // Switch to Preview mode
  fireEvent.click(screen.getByRole('button', { name: /preview/i }));

  // Verify still accessible in Preview mode
  await checkA11y(container);

  // Switch back to Edit mode
  fireEvent.click(screen.getByRole('button', { name: /edit/i }));

  // Verify still accessible after switching back
  await checkA11y(container);
});

describe('Snapshots', () => {
  it('should match snapshot in edit mode', () => {
    const { container } = render(<App />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
