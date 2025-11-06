import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderAndCheckA11y } from '@/test-utils';
import { QuestionType } from '@/types/quiz';

import { QuestionTypeSelector } from './QuestionTypeSelector';

describe('QuestionTypeSelector', () => {
  it('should have no accessibility violations', async () => {
    await renderAndCheckA11y(<QuestionTypeSelector onSelect={jest.fn()} />);
  });

  it('should render all question type buttons', () => {
    render(<QuestionTypeSelector onSelect={jest.fn()} />);

    expect(
      screen.getByRole('button', { name: /add single choice question/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /add multiple choice question/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /add short text question/i }),
    ).toBeInTheDocument();
  });

  it('should call onSelect with SINGLE_CHOICE when single choice button is clicked', async () => {
    const user = userEvent.setup();
    const handleSelect = jest.fn();

    render(<QuestionTypeSelector onSelect={handleSelect} />);

    const button = screen.getByRole('button', {
      name: /add single choice question/i,
    });
    await user.click(button);

    expect(handleSelect).toHaveBeenCalledWith(QuestionType.SINGLE_CHOICE);
  });

  it('should call onSelect with MULTIPLE_CHOICE when multiple choice button is clicked', async () => {
    const user = userEvent.setup();
    const handleSelect = jest.fn();

    render(<QuestionTypeSelector onSelect={handleSelect} />);

    const button = screen.getByRole('button', {
      name: /add multiple choice question/i,
    });
    await user.click(button);

    expect(handleSelect).toHaveBeenCalledWith(QuestionType.MULTIPLE_CHOICE);
  });

  it('should call onSelect with SHORT_TEXT when short text button is clicked', async () => {
    const user = userEvent.setup();
    const handleSelect = jest.fn();

    render(<QuestionTypeSelector onSelect={handleSelect} />);

    const button = screen.getByRole('button', {
      name: /add short text question/i,
    });
    await user.click(button);

    expect(handleSelect).toHaveBeenCalledWith(QuestionType.SHORT_TEXT);
  });

  it('should display descriptive text for each question type', () => {
    render(<QuestionTypeSelector onSelect={jest.fn()} />);

    expect(screen.getByText('Single Choice:')).toBeInTheDocument();
    expect(screen.getByText(/radio buttons/i)).toBeInTheDocument();
    expect(screen.getByText('Multiple Choice:')).toBeInTheDocument();
    expect(screen.getByText(/checkboxes/i)).toBeInTheDocument();
    expect(screen.getByText('Short Text:')).toBeInTheDocument();
    expect(screen.getByText(/text response/i)).toBeInTheDocument();
  });

  describe('Snapshots', () => {
    it('should match snapshot', () => {
      const { container } = render(
        <QuestionTypeSelector onSelect={jest.fn()} />,
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
