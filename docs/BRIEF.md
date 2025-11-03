# Accessible Quiz Builder Brief

Accessible Quiz Builder lets an instructor create questions, preview the quiz as a student, and persist the quiz locally.

**Core features**

1. Question management
   1. Add/remove questions
   2. Types: Single choice, Multiple choice, Short text
   3. Choice types: add/remove options; mark correct answer(s)
2. Validation
   1. Title required
   2. Choice types: ≥ 2 options and at least one marked correct
3. Instant Preview
   1. Toggle Edit/Preview; Preview simulates student view (no scoring needed)
4. Persistence
   1. Save & restore quiz via LocalStorage
5. Resilience & UX
   1. Undo last change
   2. Clear quiz with confirmation
   3. Clear Empty / Loading (if applicable) / Error states

**Testing**

1. Integration (Testing Library): 
   1. Add/remove questions
   2. Validation blocks invalid quiz
   3. Preview reflects builder
2. E2E (Playwright): create → preview → refresh → restore (happy path)
