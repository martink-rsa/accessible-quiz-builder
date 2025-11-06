import { RenderOptions, RenderResult, render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { ReactElement } from 'react';

// Extend Jest matchers (this is redundant with setupTests.ts but TypeScript needs it here)
expect.extend(toHaveNoViolations);

/**
 * Custom render function that automatically checks for accessibility violations
 * using jest-axe after rendering a component.
 *
 * @param ui - The React component to render
 * @param options - Optional render options to pass to @testing-library/react
 * @returns The render result from @testing-library/react
 *
 * @example
 * ```tsx
 * test('component is accessible', async () => {
 *   await renderAndCheckA11y(<MyComponent />);
 * });
 * ```
 */
export async function renderAndCheckA11y(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
): Promise<RenderResult> {
  const renderResult = render(ui, options);
  const results = await axe(renderResult.container);
  expect(results).toHaveNoViolations();
  return renderResult;
}

/**
 * Helper function to run accessibility checks on an already-rendered component.
 * Use this when you need to check accessibility after user interactions or state changes.
 *
 * @param container - The container element to check (usually from render().container)
 *
 * @example
 * ```tsx
 * test('component remains accessible after interaction', async () => {
 *   const { container, getByRole } = render(<MyComponent />);
 *
 *   // Initial check
 *   await checkA11y(container);
 *
 *   // Interact with component
 *   fireEvent.click(getByRole('button'));
 *
 *   // Check again after interaction
 *   await checkA11y(container);
 * });
 * ```
 */
export async function checkA11y(container: Element): Promise<void> {
  const results = await axe(container);
  expect(results).toHaveNoViolations();
}
