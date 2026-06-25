# Endless Resume Spec

For a full list of technologies and environment setup, see the [Contributing Guide](../../CONTRIBUTING.md).

## Architecture Decision Records

For reasoning behind stack choices, see [ADRs](./adr/README.md)

## Database schemas

All database schemas use [Zod](https://zod.dev/) and can be found in [lib/schemas.ts](../src/lib/schemas.ts)

## Feature List

### Primary Features

- Decorative landing page
- Auth: log in and register an account
- Dashboard: create, list, and delete resumes
- Templates: select a template to create resume from
- Editor: modify resume content
  - add, edit, delete bullet points
  - add or delete sections
  - save all content changes
  - reorder sections, subsections, bullet points
  - configure section & subsection spacing
- Printing:
  - use browser printing to save as PDF or print
  - export to PDF button

### Advanced Features

- Resume height indicator
- Autosave
- PWA and/or Offline editing support
- Editor undo/redo

### Optional, Bonus Stretch Features

- Choose fonts
- Punctuation & Grammer checkers
- Rich Text
- Swap in bullet points or sections from previous resumes
