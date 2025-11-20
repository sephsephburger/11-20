# Repository Guidelines

This repository is organized around a daily sprint for `11-20`. All contributors and agents must follow the rules below when making changes.

## Project Structure & Workflow

- Root files: `IDEATION.md`, `PRD.md`, `TODO.md`, `.gitignore`.
- All implementation work is driven by `TODO.md`.
- Process rules:
  - All work is based on `TODO.md`.
  - Work TODOs in order of priority, starting from `P1`.
  - Only one TODO item may be in progress at a time.
  - When a TODO is completed, update `TODO.md` directly.
  - If extra work is needed, add a new TODO entry before implementing.

## Development, Build, and Test

- This repo currently has no code or build system defined.
- When you introduce code, add a short “How to run / test” section to `PRD.md` and update this file with key commands (for example: `npm test`, `python -m pytest`, or `npm run dev`).

## Coding Style & Naming

- Match the language ecosystem you introduce (e.g., Prettier/ESLint for JS, `black`/`ruff` for Python).
- Prefer clear, descriptive names over abbreviations.
- Keep functions small, single-responsibility, and colocate tests near implementation when practical.

## Testing Guidelines

- Add tests alongside new code whenever feasible.
- Use the dominant framework for the chosen language (e.g., Jest/Vitest for JS, Pytest for Python).
- Document how to run tests in `PRD.md`.

## Commit & PR Guidelines

- Use concise, present-tense commit messages (e.g., `Add P1 login flow`).
- Scope each commit to a small, logical change set.
- Pull requests should:
  - Reference relevant TODO items.
  - Briefly describe the change and rationale.
  - Include screenshots or logs when UI or behavior changes.

