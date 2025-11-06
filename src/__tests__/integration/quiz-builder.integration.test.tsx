import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '@/App';
import { renderAndCheckA11y } from '@/test-utils';

describe('Quiz Builder Integration Tests', () => {
  beforeEach(() => {
    // Clear localStorage before each test to ensure clean state
    localStorage.clear();
  });

  describe('Add/Remove Questions', () => {
    it('should add a Single Choice question to the quiz', async () => {
      const user = userEvent.setup();
      await renderAndCheckA11y(<App />);

      const addButton = screen.getByRole('button', {
        name: /add first question/i,
      });
      await user.click(addButton);

      // Verify the question was added
      expect(screen.getByText(/question 1/i)).toBeInTheDocument();
      // Default type is Single Choice
      expect(
        screen.getByRole('combobox', { name: /question 1 type/i }),
      ).toHaveValue('single_choice');
    });

    it('should add multiple questions of all three types', async () => {
      const user = userEvent.setup();
      await renderAndCheckA11y(<App />);

      // Add first question (Single Choice by default)
      const addFirstButton = screen.getByRole('button', {
        name: /add first question/i,
      });
      await user.click(addFirstButton);

      // Add second question and change to Multiple Choice
      const addNewButton = screen.getByRole('button', {
        name: /add new question/i,
      });
      await user.click(addNewButton);
      const typeSelects = screen.getAllByRole('combobox', {
        name: /question \d+ type/i,
      });
      await user.selectOptions(typeSelects[1], 'multiple_choice');

      // Add third question and change to Short Text
      await user.click(addNewButton);
      const updatedTypeSelects = screen.getAllByRole('combobox', {
        name: /question \d+ type/i,
      });
      await user.selectOptions(updatedTypeSelects[2], 'short_text');

      // Verify all three questions exist with correct types
      expect(screen.getByText(/question 1/i)).toBeInTheDocument();
      expect(screen.getByText(/question 2/i)).toBeInTheDocument();
      expect(screen.getByText(/question 3/i)).toBeInTheDocument();

      const finalTypeSelects = screen.getAllByRole('combobox', {
        name: /question \d+ type/i,
      });
      expect(finalTypeSelects[0]).toHaveValue('single_choice');
      expect(finalTypeSelects[1]).toHaveValue('multiple_choice');
      expect(finalTypeSelects[2]).toHaveValue('short_text');
    });

    it('should remove a question from the quiz', async () => {
      const user = userEvent.setup();
      await renderAndCheckA11y(<App />);

      // Add two questions
      const addFirstButton = screen.getByRole('button', {
        name: /add first question/i,
      });
      await user.click(addFirstButton);
      const addNewButton = screen.getByRole('button', {
        name: /add new question/i,
      });
      await user.click(addNewButton);

      expect(screen.getByText(/question 1/i)).toBeInTheDocument();
      expect(screen.getByText(/question 2/i)).toBeInTheDocument();

      // Remove the first question
      const removeButtons = screen.getAllByRole('button', {
        name: /remove question/i,
      });
      await user.click(removeButtons[0]);

      // Verify only one question remains (the second question is now renumbered to question 1)
      expect(screen.getByText(/question 1/i)).toBeInTheDocument();
      expect(screen.queryByText(/question 2/i)).not.toBeInTheDocument();
    });

    it('should remove all questions from the quiz', async () => {
      const user = userEvent.setup();
      await renderAndCheckA11y(<App />);

      // Add three questions
      const addFirstButton = screen.getByRole('button', {
        name: /add first question/i,
      });
      await user.click(addFirstButton);
      const addNewButton = screen.getByRole('button', {
        name: /add new question/i,
      });
      await user.click(addNewButton);
      await user.click(addNewButton);

      // Remove all questions
      const removeButtons = screen.getAllByRole('button', {
        name: /remove question/i,
      });
      for (let i = removeButtons.length - 1; i >= 0; i--) {
        await user.click(removeButtons[i]);
      }

      // Verify no questions remain
      expect(screen.queryByText(/question 1/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/question 2/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/question 3/i)).not.toBeInTheDocument();
    });

    it('should support undo/redo for add/remove operations', async () => {
      const user = userEvent.setup();
      await renderAndCheckA11y(<App />);

      // Add a question
      const addButton = screen.getByRole('button', {
        name: /add first question/i,
      });
      await user.click(addButton);
      expect(screen.getByText(/question 1/i)).toBeInTheDocument();

      // Undo - should remove the question
      const undoButton = screen.getByRole('button', { name: /undo/i });
      await user.click(undoButton);
      expect(screen.queryByText(/question 1/i)).not.toBeInTheDocument();

      // Redo - should add the question back
      const redoButton = screen.getByRole('button', { name: /redo/i });
      await user.click(redoButton);
      expect(screen.getByText(/question 1/i)).toBeInTheDocument();
    });
  });

  describe('Validation Blocks Invalid Quiz', () => {
    it('should block publishing when quiz has no title', async () => {
      const user = userEvent.setup();
      await renderAndCheckA11y(<App />);

      // Add a valid question
      const addButton = screen.getByRole('button', {
        name: /add first question/i,
      });
      await user.click(addButton);

      // Fill in question title
      const questionTitleInput = screen.getByRole('textbox', {
        name: /question required/i,
      });
      await user.type(questionTitleInput, 'What is your favorite color?');

      // Fill in option text
      const optionInputs = screen.getAllByRole('textbox', {
        name: /option \d+ required/i,
      });
      await user.type(optionInputs[0], 'Red');
      await user.type(optionInputs[1], 'Blue');

      // Mark first option as correct
      const radioButtons = screen.getAllByRole('radio');
      await user.click(radioButtons[0]);

      // Verify Publish button is disabled (no quiz title)
      const publishButton = screen.getByRole('button', { name: /publish/i });
      expect(publishButton).toBeDisabled();

      // Add quiz title
      const quizTitleInput = screen.getByRole('textbox', {
        name: /quiz title/i,
      });
      await user.type(quizTitleInput, 'Color Quiz');

      // Now Publish button should be enabled
      expect(publishButton).toBeEnabled();
    });

    it('should block publishing when Single Choice question has no correct answer', async () => {
      const user = userEvent.setup();
      await renderAndCheckA11y(<App />);

      // Add quiz title
      const quizTitleInput = screen.getByRole('textbox', {
        name: /quiz title/i,
      });
      await user.type(quizTitleInput, 'Test Quiz');

      // Add a Single Choice question
      const addButton = screen.getByRole('button', {
        name: /add first question/i,
      });
      await user.click(addButton);

      const questionTitleInput = screen.getByRole('textbox', {
        name: /question required/i,
      });
      await user.type(questionTitleInput, 'Question 1');

      // Fill in option text
      const optionInputs = screen.getAllByRole('textbox', {
        name: /option \d+ required/i,
      });
      await user.type(optionInputs[0], 'Option A');
      await user.type(optionInputs[1], 'Option B');

      // Don't mark any option as correct
      // Publish button should be disabled
      const publishButton = screen.getByRole('button', { name: /publish/i });
      expect(publishButton).toBeDisabled();

      // Mark first option as correct
      const radioButtons = screen.getAllByRole('radio');
      await user.click(radioButtons[0]);

      // Now Publish button should be enabled
      expect(publishButton).toBeEnabled();
    });

    it('should block publishing when Multiple Choice question has no correct answers', async () => {
      const user = userEvent.setup();
      await renderAndCheckA11y(<App />);

      // Add quiz title
      const quizTitleInput = screen.getByRole('textbox', {
        name: /quiz title/i,
      });
      await user.type(quizTitleInput, 'Test Quiz');

      // Add a Multiple Choice question
      const addButton = screen.getByRole('button', {
        name: /add first question/i,
      });
      await user.click(addButton);

      const typeSelect = screen.getByRole('combobox', {
        name: /question 1 type/i,
      });
      await user.selectOptions(typeSelect, 'multiple_choice');

      const questionTitleInput = screen.getByRole('textbox', {
        name: /question required/i,
      });
      await user.type(questionTitleInput, 'Question 1');

      // Fill in option text
      const optionInputs = screen.getAllByRole('textbox', {
        name: /option \d+ required/i,
      });
      await user.type(optionInputs[0], 'Choice A');
      await user.type(optionInputs[1], 'Choice B');

      // Don't mark any option as correct
      // Publish button should be disabled
      const publishButton = screen.getByRole('button', { name: /publish/i });
      expect(publishButton).toBeDisabled();

      // Mark first option as correct
      const checkboxes = screen.getAllByRole('checkbox');
      await user.click(checkboxes[0]);

      // Now Publish button should be enabled
      expect(publishButton).toBeEnabled();
    });

    it('should block publishing when quiz has multiple validation errors', async () => {
      const user = userEvent.setup();
      await renderAndCheckA11y(<App />);

      // Add a question without quiz title, question title, or correct answer
      const addButton = screen.getByRole('button', {
        name: /add first question/i,
      });
      await user.click(addButton);

      // Publish button should be disabled
      const publishButton = screen.getByRole('button', { name: /publish/i });
      expect(publishButton).toBeDisabled();

      // Add quiz title (one error resolved)
      const quizTitleInput = screen.getByRole('textbox', {
        name: /quiz title/i,
      });
      await user.type(quizTitleInput, 'Test Quiz');

      // Still disabled (missing question title and correct answer)
      expect(publishButton).toBeDisabled();

      // Add question title (another error resolved)
      const questionTitleInput = screen.getByRole('textbox', {
        name: /question required/i,
      });
      await user.type(questionTitleInput, 'Question 1');

      // Still disabled (missing correct answer and option text)
      expect(publishButton).toBeDisabled();

      // Fill in option text
      const optionInputs = screen.getAllByRole('textbox', {
        name: /option \d+ required/i,
      });
      await user.type(optionInputs[0], 'Answer 1');
      await user.type(optionInputs[1], 'Answer 2');

      // Still disabled (missing correct answer)
      expect(publishButton).toBeDisabled();

      // Mark correct answer (all errors resolved)
      const radioButtons = screen.getAllByRole('radio');
      await user.click(radioButtons[0]);

      // Now Publish button should be enabled
      expect(publishButton).toBeEnabled();
    });

    it('should enable publishing when quiz is completely valid with all question types', async () => {
      const user = userEvent.setup();
      await renderAndCheckA11y(<App />);

      // Add quiz title
      const quizTitleInput = screen.getByRole('textbox', {
        name: /quiz title/i,
      });
      await user.type(quizTitleInput, 'Complete Quiz');

      // Add Single Choice question
      const addFirstButton = screen.getByRole('button', {
        name: /add first question/i,
      });
      await user.click(addFirstButton);
      const questionInputs = screen.getAllByRole('textbox', {
        name: /question required/i,
      });
      await user.type(questionInputs[0], 'Single Choice Question');

      // Fill in option text for Single Choice
      let optionInputs = screen.getAllByRole('textbox', {
        name: /option \d+ required/i,
      });
      await user.type(optionInputs[0], 'SC Option 1');
      await user.type(optionInputs[1], 'SC Option 2');

      const radioButtons = screen.getAllByRole('radio');
      await user.click(radioButtons[0]);

      // Add Multiple Choice question
      const addNewButton = screen.getByRole('button', {
        name: /add new question/i,
      });
      await user.click(addNewButton);
      const typeSelects = screen.getAllByRole('combobox', {
        name: /question \d+ type/i,
      });
      await user.selectOptions(typeSelects[1], 'multiple_choice');
      const updatedQuestionInputs = screen.getAllByRole('textbox', {
        name: /question required/i,
      });
      await user.type(updatedQuestionInputs[1], 'Multiple Choice Question');

      // Fill in option text for Multiple Choice
      optionInputs = screen.getAllByRole('textbox', {
        name: /option \d+ required/i,
      });
      await user.type(optionInputs[2], 'MC Option 1');
      await user.type(optionInputs[3], 'MC Option 2');

      const checkboxes = screen.getAllByRole('checkbox');
      await user.click(checkboxes[0]);

      // Add Short Text question
      await user.click(addNewButton);
      const finalTypeSelects = screen.getAllByRole('combobox', {
        name: /question \d+ type/i,
      });
      await user.selectOptions(finalTypeSelects[2], 'short_text');
      const finalQuestionInputs = screen.getAllByRole('textbox', {
        name: /question required/i,
      });
      await user.type(finalQuestionInputs[2], 'Short Text Question');

      // Publish button should be enabled
      const publishButton = screen.getByRole('button', { name: /publish/i });
      expect(publishButton).toBeEnabled();
    });
  });

  describe('Preview Reflects Builder', () => {
    it('should show added questions in preview mode', async () => {
      const user = userEvent.setup();
      await renderAndCheckA11y(<App />);

      // Add quiz title
      const quizTitleInput = screen.getByRole('textbox', {
        name: /quiz title/i,
      });
      await user.type(quizTitleInput, 'Preview Test Quiz');

      // Add a question
      const addButton = screen.getByRole('button', {
        name: /add first question/i,
      });
      await user.click(addButton);

      const questionTitleInput = screen.getByRole('textbox', {
        name: /question required/i,
      });
      await user.type(questionTitleInput, 'Test Question 1');

      // Switch to preview mode
      const previewButton = screen.getByRole('button', { name: /preview/i });
      await user.click(previewButton);

      // Verify question appears in preview
      expect(screen.getByText('Preview Test Quiz')).toBeInTheDocument();
      expect(screen.getByText('Test Question 1')).toBeInTheDocument();
    });

    it('should reflect question title changes in preview', async () => {
      const user = userEvent.setup();
      await renderAndCheckA11y(<App />);

      // Add quiz with a question
      const quizTitleInput = screen.getByRole('textbox', {
        name: /quiz title/i,
      });
      await user.type(quizTitleInput, 'Edit Test Quiz');

      const addButton = screen.getByRole('button', {
        name: /add first question/i,
      });
      await user.click(addButton);

      const questionTitleInput = screen.getByRole('textbox', {
        name: /question required/i,
      });
      await user.type(questionTitleInput, 'Original Title');

      // Switch to preview and verify
      const previewButton = screen.getByRole('button', { name: /preview/i });
      await user.click(previewButton);
      expect(screen.getByText('Original Title')).toBeInTheDocument();

      // Switch back to edit mode
      const editButton = screen.getByRole('button', { name: /edit/i });
      await user.click(editButton);

      // Edit question title
      const updatedQuestionTitleInput = screen.getByRole('textbox', {
        name: /question required/i,
      });
      await user.clear(updatedQuestionTitleInput);
      await user.type(updatedQuestionTitleInput, 'Updated Title');

      // Switch to preview and verify change
      const previewButton2 = screen.getByRole('button', { name: /preview/i });
      await user.click(previewButton2);
      expect(screen.queryByText('Original Title')).not.toBeInTheDocument();
      expect(screen.getByText('Updated Title')).toBeInTheDocument();
    });

    it('should reflect option changes in preview for Single Choice questions', async () => {
      const user = userEvent.setup();
      await renderAndCheckA11y(<App />);

      // Add quiz with a Single Choice question
      const quizTitleInput = screen.getByRole('textbox', {
        name: /quiz title/i,
      });
      await user.type(quizTitleInput, 'Options Test Quiz');

      const addButton = screen.getByRole('button', {
        name: /add first question/i,
      });
      await user.click(addButton);

      const questionTitleInput = screen.getByRole('textbox', {
        name: /question required/i,
      });
      await user.type(questionTitleInput, 'Choose one:');

      // Edit the first option text
      const optionInputs = screen.getAllByRole('textbox', {
        name: /option \d+ required/i,
      });
      await user.clear(optionInputs[0]);
      await user.type(optionInputs[0], 'Custom Option 1');

      // Add a new option
      const addOptionButton = screen.getByRole('button', {
        name: /add option/i,
      });
      await user.click(addOptionButton);

      const updatedOptionInputs = screen.getAllByRole('textbox', {
        name: /option \d+ required/i,
      });
      await user.type(updatedOptionInputs[2], 'Custom Option 3');

      // Switch to preview mode
      const previewButton = screen.getByRole('button', { name: /preview/i });
      await user.click(previewButton);

      // Verify options appear in preview
      expect(screen.getByText('Custom Option 1')).toBeInTheDocument();
      expect(screen.getByText('Custom Option 3')).toBeInTheDocument();
    });

    it('should reflect option changes in preview for Multiple Choice questions', async () => {
      const user = userEvent.setup();
      await renderAndCheckA11y(<App />);

      // Add quiz with a Multiple Choice question
      const quizTitleInput = screen.getByRole('textbox', {
        name: /quiz title/i,
      });
      await user.type(quizTitleInput, 'Multiple Options Test');

      const addButton = screen.getByRole('button', {
        name: /add first question/i,
      });
      await user.click(addButton);

      const typeSelect = screen.getByRole('combobox', {
        name: /question 1 type/i,
      });
      await user.selectOptions(typeSelect, 'multiple_choice');

      const questionTitleInput = screen.getByRole('textbox', {
        name: /question required/i,
      });
      await user.type(questionTitleInput, 'Select all that apply:');

      // Edit option texts
      const optionInputs = screen.getAllByRole('textbox', {
        name: /option \d+ required/i,
      });
      await user.clear(optionInputs[0]);
      await user.type(optionInputs[0], 'Multi Option 1');
      await user.clear(optionInputs[1]);
      await user.type(optionInputs[1], 'Multi Option 2');

      // Switch to preview mode
      const previewButton = screen.getByRole('button', { name: /preview/i });
      await user.click(previewButton);

      // Verify options appear in preview
      expect(screen.getByText('Multi Option 1')).toBeInTheDocument();
      expect(screen.getByText('Multi Option 2')).toBeInTheDocument();
    });

    it('should show all three question types correctly in preview', async () => {
      const user = userEvent.setup();
      await renderAndCheckA11y(<App />);

      // Add quiz title
      const quizTitleInput = screen.getByRole('textbox', {
        name: /quiz title/i,
      });
      await user.type(quizTitleInput, 'Mixed Question Types Quiz');

      // Add Single Choice question
      const addFirstButton = screen.getByRole('button', {
        name: /add first question/i,
      });
      await user.click(addFirstButton);
      const questionInputs = screen.getAllByRole('textbox', {
        name: /question required/i,
      });
      await user.type(questionInputs[0], 'Single Choice: Pick one');

      // Fill in option text for Single Choice
      let optionInputs = screen.getAllByRole('textbox', {
        name: /option \d+ required/i,
      });
      await user.type(optionInputs[0], 'Option A');
      await user.type(optionInputs[1], 'Option B');

      // Add Multiple Choice question
      const addNewButton = screen.getByRole('button', {
        name: /add new question/i,
      });
      await user.click(addNewButton);
      const typeSelects = screen.getAllByRole('combobox', {
        name: /question \d+ type/i,
      });
      await user.selectOptions(typeSelects[1], 'multiple_choice');
      const updatedQuestionInputs = screen.getAllByRole('textbox', {
        name: /question required/i,
      });
      await user.type(updatedQuestionInputs[1], 'Multiple Choice: Pick many');

      // Fill in option text for Multiple Choice
      optionInputs = screen.getAllByRole('textbox', {
        name: /option \d+ required/i,
      });
      await user.type(optionInputs[2], 'Choice 1');
      await user.type(optionInputs[3], 'Choice 2');

      // Add Short Text question
      await user.click(addNewButton);
      const finalTypeSelects = screen.getAllByRole('combobox', {
        name: /question \d+ type/i,
      });
      await user.selectOptions(finalTypeSelects[2], 'short_text');
      const finalQuestionInputs = screen.getAllByRole('textbox', {
        name: /question required/i,
      });
      await user.type(finalQuestionInputs[2], 'Short Text: Write answer');

      // Switch to preview mode
      const previewButton = screen.getByRole('button', { name: /preview/i });
      await user.click(previewButton);

      // Verify all questions appear in preview
      expect(screen.getByText('Single Choice: Pick one')).toBeInTheDocument();
      expect(
        screen.getByText('Multiple Choice: Pick many'),
      ).toBeInTheDocument();
      expect(screen.getByText('Short Text: Write answer')).toBeInTheDocument();
    });

    it('should reflect quiz title and description changes in preview', async () => {
      const user = userEvent.setup();
      await renderAndCheckA11y(<App />);

      // Add quiz title and description
      const quizTitleInput = screen.getByRole('textbox', {
        name: /quiz title/i,
      });
      await user.type(quizTitleInput, 'Original Quiz Title');

      const quizDescriptionInput = screen.getByRole('textbox', {
        name: /quiz description/i,
      });
      await user.type(quizDescriptionInput, 'Original description text');

      // Add a question so we can switch to preview
      const addButton = screen.getByRole('button', {
        name: /add first question/i,
      });
      await user.click(addButton);
      const questionTitleInput = screen.getByRole('textbox', {
        name: /question required/i,
      });
      await user.type(questionTitleInput, 'Sample Question');

      // Switch to preview
      const previewButton = screen.getByRole('button', { name: /preview/i });
      await user.click(previewButton);

      // Verify original content
      expect(screen.getByText('Original Quiz Title')).toBeInTheDocument();
      expect(screen.getByText('Original description text')).toBeInTheDocument();

      // Switch back to edit
      const editButton = screen.getByRole('button', { name: /edit/i });
      await user.click(editButton);

      // Update title and description
      const updatedQuizTitleInput = screen.getByRole('textbox', {
        name: /quiz title/i,
      });
      await user.clear(updatedQuizTitleInput);
      await user.type(updatedQuizTitleInput, 'Updated Quiz Title');

      const updatedQuizDescriptionInput = screen.getByRole('textbox', {
        name: /quiz description/i,
      });
      await user.clear(updatedQuizDescriptionInput);
      await user.type(updatedQuizDescriptionInput, 'Updated description text');

      // Switch to preview and verify changes
      const previewButton3 = screen.getByRole('button', { name: /preview/i });
      await user.click(previewButton3);
      expect(screen.queryByText('Original Quiz Title')).not.toBeInTheDocument();
      expect(
        screen.queryByText('Original description text'),
      ).not.toBeInTheDocument();
      expect(screen.getByText('Updated Quiz Title')).toBeInTheDocument();
      expect(screen.getByText('Updated description text')).toBeInTheDocument();
    });

    it('should show removed questions are gone in preview', async () => {
      const user = userEvent.setup();
      await renderAndCheckA11y(<App />);

      // Add quiz with two questions
      const quizTitleInput = screen.getByRole('textbox', {
        name: /quiz title/i,
      });
      await user.type(quizTitleInput, 'Remove Test Quiz');

      const addButton = screen.getByRole('button', {
        name: /add first question/i,
      });
      await user.click(addButton);
      const addNewButton = screen.getByRole('button', {
        name: /add new question/i,
      });
      await user.click(addNewButton);

      const questionInputs = screen.getAllByRole('textbox', {
        name: /question required/i,
      });
      await user.type(questionInputs[0], 'Question to Remove');
      await user.type(questionInputs[1], 'Question to Keep');

      // Verify both in preview
      const previewButton = screen.getByRole('button', { name: /preview/i });
      await user.click(previewButton);
      expect(screen.getByText('Question to Remove')).toBeInTheDocument();
      expect(screen.getByText('Question to Keep')).toBeInTheDocument();

      // Switch back to edit and remove first question
      const editButton = screen.getByRole('button', { name: /edit/i });
      await user.click(editButton);

      const removeButtons = screen.getAllByRole('button', {
        name: /remove question/i,
      });
      await user.click(removeButtons[0]);

      // Verify in preview that first question is gone
      const previewButton4 = screen.getByRole('button', { name: /preview/i });
      await user.click(previewButton4);
      expect(screen.queryByText('Question to Remove')).not.toBeInTheDocument();
      expect(screen.getByText('Question to Keep')).toBeInTheDocument();
    });
  });
});
