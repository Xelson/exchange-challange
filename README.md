# Exchange rates challange

This application provides the ability to view exchange rates using the API [vatcomply](https://vatcomply.com/) or [fxratesapi](https://fxratesapi.com/)

Built with React, [Reatom v1000](https://reatom.dev), [Ark-UI](https://ark-ui.com/) and [Panda CSS](https://panda-css.com/)
ESLint is used for linting and formatting

## Installation
1. To run the application, Node.js is required (tested on 24.0.2) and pnpm package manager

```bash
pnpm install
```

2. Create a `.env.local` file and add environment variables there:

To use vatcomply:
```env
VITE_EXCHANGE_RATES_PROVIDER=vatcomply
```

To use fxratesapi:
```env
VITE_EXCHANGE_RATES_PROVIDER=fxrates
VITE_FXRATES_API_KEY=your_api_key_here
```

This is not a mandatory step, if the environment file is not created, the application will use the vatcomply API

3. Run the application:
```bash
pnpm dev
```

## Key decisions
1) Ark-UI was chosen as the UI library, as it has one of the richest collections of components, whose compositional API 
allows covering any use cases and requirements
2) The buildtime CSS-in-JS engine Panda CSS was chosen for styling, as it provides a complete framework for type-safe organization of tokens, 
recipes and other styling entities. This is the ideal balance between high DX of css-in-js and performance through static style analysis,
inline styles allow very fast layout without an existing design system
3) Reatom v1000 was undoubtedly chosen for state management, as it is the most flexible, performant and feature-rich signal reactivity library
with a bunch of batteries included. This is the ideal choice for SPA, because things like routing, forms, network requests, caching strategies can be described
in a unified reactive system, which provides maximum expressiveness and flexibility. This choice allows avoiding the variety of heterogeneous libraries such
as tanstack query, react-hook-form, react-router and others, while getting more capabilities and features with minimal bundle size

### Caching strategy
A persistent Map was chosen for caching, which synchronizes its state in local storage and into which network requests for exchange rates write. When
the browser goes offline, the application starts taking rates directly from the cache, while online the data is simply saved to the cache