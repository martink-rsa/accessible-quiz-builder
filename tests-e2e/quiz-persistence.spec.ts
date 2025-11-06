import { expect, test } from '@playwright/test';

test.describe('Quiz Persistence', () => {
  test('creates quiz with all question types, previews, reloads, and verifies persistence', async ({
    page,
  }) => {
    // Clear localStorage to start fresh
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.clear();
    });
    await page.reload();

    // Add quiz title
    const titleInput = page.getByRole('textbox', { name: /quiz title/i });
    await titleInput.fill('My Test Quiz');

    // Add quiz description
    const descriptionInput = page.getByRole('textbox', {
      name: /quiz description/i,
    });
    await descriptionInput.fill('This is a test quiz description');

    // Add first question (Single Choice)
    await page.getByRole('button', { name: /add first question/i }).click();

    // Fill in single choice question
    const question1Input = page
      .getByRole('textbox', { name: /question/i })
      .first();
    await question1Input.fill('What is the best programming language?');

    // The question already has 2 default options, no need to add more

    // Fill in options
    const option1 = page.getByRole('textbox', { name: /option 1/i }).first();
    await option1.fill('Python');

    const option2 = page.getByRole('textbox', { name: /option 2/i }).first();
    await option2.fill('JavaScript');

    // Mark correct answer (Python)
    const correctAnswerRadio = page
      .getByRole('radio', { name: /mark "python" as correct answer/i })
      .first();
    await correctAnswerRadio.check();

    // Add second question (Multiple Choice)
    await page.getByRole('button', { name: /add new question/i }).click();

    // Fill in multiple choice question
    const question2Input = page
      .getByRole('textbox', { name: /question/i })
      .nth(1);
    await question2Input.fill('Which of these are programming languages?');

    // Change question type to multiple choice
    const questionTypeSelect = page.locator('[id^="question-type-"]').nth(1);
    await questionTypeSelect.selectOption('multiple_choice');

    // Add one more option (already has 2 by default, need 3 total)
    const addOptionButton2 = page
      .getByRole('button', { name: /add option/i })
      .nth(1);
    await addOptionButton2.click();

    // Fill in options (Question 2 has Option 1, 2, 3 but Question 1 only has Option 1, 2)
    // So for Option 1 and 2, use .nth(1) to get the second question's options
    // For Option 3, use .first() since only Question 2 has it
    const mcOption1 = page.getByRole('textbox', { name: /option 1/i }).nth(1);
    await mcOption1.fill('Python');

    const mcOption2 = page.getByRole('textbox', { name: /option 2/i }).nth(1);
    await mcOption2.fill('JavaScript');

    const mcOption3 = page.getByRole('textbox', { name: /option 3/i }).first();
    await mcOption3.fill('HTML');

    // Mark multiple correct answers (Python and JavaScript)
    await page
      .getByRole('checkbox', { name: /mark "python" as correct answer/i })
      .check();
    await page
      .getByRole('checkbox', { name: /mark "javascript" as correct answer/i })
      .check();

    // Add third question (Short Text)
    await page.getByRole('button', { name: /add new question/i }).click();

    // Fill in short text question
    const question3Input = page
      .getByRole('textbox', { name: /question/i })
      .nth(2);
    await question3Input.fill('Explain the concept of recursion.');

    // Change question type to short text
    const questionTypeSelect3 = page.locator('[id^="question-type-"]').nth(2);
    await questionTypeSelect3.selectOption('short_text');

    // Switch to preview mode
    await page.getByRole('button', { name: /preview/i }).click();

    // Verify quiz content in preview mode
    await expect(
      page.getByRole('heading', { name: 'My Test Quiz' }),
    ).toBeVisible();
    await expect(
      page.getByText('This is a test quiz description'),
    ).toBeVisible();

    // Verify single choice question
    await expect(
      page.getByText('What is the best programming language?'),
    ).toBeVisible();
    await expect(page.getByRole('radio', { name: /python/i })).toBeVisible();
    await expect(
      page.getByRole('radio', { name: /javascript/i }),
    ).toBeVisible();

    // Verify multiple choice question
    await expect(
      page.getByText('Which of these are programming languages?'),
    ).toBeVisible();
    await expect(page.getByRole('checkbox', { name: /python/i })).toBeVisible();
    await expect(
      page.getByRole('checkbox', { name: /javascript/i }),
    ).toBeVisible();
    await expect(page.getByRole('checkbox', { name: /html/i })).toBeVisible();

    // Verify short text question
    await expect(
      page.getByText('Explain the concept of recursion.'),
    ).toBeVisible();
    await expect(
      page.getByRole('textbox', { name: /your answer/i }),
    ).toBeVisible();

    // Reload the page
    await page.reload();

    // Verify quiz persists after reload (should still be in preview mode or back to edit)
    // Check if data is in localStorage
    const quizData = await page.evaluate(() => {
      return localStorage.getItem('accessible-quiz-builder-quiz');
    });
    expect(quizData).toBeTruthy();

    const quiz = JSON.parse(quizData!);
    expect(quiz.title).toBe('My Test Quiz');
    expect(quiz.description).toBe('This is a test quiz description');
    expect(quiz.questions).toHaveLength(3);

    // Verify quiz title in the UI after reload
    await expect(
      page.getByRole('textbox', { name: /quiz title/i }),
    ).toHaveValue('My Test Quiz');
    await expect(
      page.getByRole('textbox', { name: /quiz description/i }),
    ).toHaveValue('This is a test quiz description');

    // Verify questions persist
    await expect(
      page.getByRole('textbox', { name: /question/i }).first(),
    ).toHaveValue('What is the best programming language?');
    await expect(
      page.getByRole('textbox', { name: /question/i }).nth(1),
    ).toHaveValue('Which of these are programming languages?');
    await expect(
      page.getByRole('textbox', { name: /question/i }).nth(2),
    ).toHaveValue('Explain the concept of recursion.');

    // Switch back to preview mode to verify data integrity
    await page.getByRole('button', { name: /preview/i }).click();

    // Verify all content still appears correctly in preview
    await expect(
      page.getByRole('heading', { name: 'My Test Quiz' }),
    ).toBeVisible();
    await expect(
      page.getByText('What is the best programming language?'),
    ).toBeVisible();
    await expect(
      page.getByText('Which of these are programming languages?'),
    ).toBeVisible();
    await expect(
      page.getByText('Explain the concept of recursion.'),
    ).toBeVisible();

    // TODO: Visual regression test - currently failing in CI pipeline due to missing Linux snapshot
    // To fix: run `npx playwright test --update-snapshots --project=chromium` on Linux to generate snapshot
    // await expect(page).toHaveScreenshot('quiz-preview-full.png', {
    //   fullPage: true,
    // });
  });
});
