# Contributing

## Developing

Once you've created a project and installed dependencies with `npm install`, start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

[Trello](https://trello.com/b/OhRBFcVH/endlessresume)

## Building

To create a production version of your app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.

## Environment Setup

The app requires the following variables in `.src`

```zsh
DATABASE_URL="mongodb+srv://**********************************"
```

## Full Technology List

### Frontend

- [Svelte](https://svelte.dev/), [SvektKit](https://svelte.dev/docs/kit/introduction)
- [HTML](https://developer.mozilla.org/en-US/docs/Web/HTML), [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS), & [TypeScript](https://www.typescriptlang.org/)

### Backend

- [MongoDB](https://www.mongodb.com/), [MongoDB Atlas](https://www.mongodb.com/products/platform/atlas-database)
- [Better-auth](https://better-auth.com/)
- [Netlify](https://www.netlify.com/)

### DevOps

- [Github Actions](https://docs.github.com/en/actions)
- [Playwright](https://playwright.dev/)
- [Vitest](https://vitest.dev/)

### Dev Environment

- [npm](https://www.npmjs.com/), [node.js](https://nodejs.org/en)
- [Prettier](https://prettier.io/), [Husky](https://typicode.github.io/husky/), [Lint Staged](https://github.com/lint-staged/lint-staged)
- [eslint](https://eslint.org/)

### Other Libraries

- [Zod](https://zod.dev/)
- [pre-text](https://chenglou.me/pretext/)
- TODO: Library to create PDF. [pdf-js](https://mozilla.github.io/pdf.js/) to display pdfs?
- TODO: Library for offline editing maybe? dexie?
