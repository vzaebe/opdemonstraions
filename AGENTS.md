# AI Project Rules

Use this file as the entry point for project rules.

## Canonical docs
- `docs/README_PROJECT.md` (project overview, dev standards, review process, Conventional Commits)
- `docs/print-service/README.md` (print-service dev guidelines, naming, module add flow)
- `docs/src/ui/README.md` (UI kit principles/components)
- `docs/src/data/README.md` (sample JSON data rules)
- `docs/PROJECT_STRUCTURE.md` (repo layout)

## Rules summary
- Commits: Conventional Commits (`feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`).
- Vue: Composition API, TypeScript, follow Vue 3 Style Guide, add JSDoc where needed.
- Styles: use SCSS variables from the design system; follow BEM; ensure responsiveness and accessibility.
- Change hygiene: add tests for new functionality and update documentation.
- Review gates: ESLint, TypeScript type checks, unit tests, E2E tests.
- Print-service: backend uses Standard.js; frontend uses Vue 3 Composition API with TypeScript strict; naming camelCase (JS) and kebab-case (Vue files).

## Tooling sources of truth
- `eslint.config.ts`
- `.prettierrc.json`
- `.editorconfig`
