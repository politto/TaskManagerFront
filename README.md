# Front-end setup instruction(must be done after backend and database setup)
  1. CONTACT via email: eakacit@gmail.com FOR .env file(clearly important file), when recieved it, then paste it to root porject folder
  2. run npm i or bun i in your terminal
  3. npm run dev or bun dev
  4. go to browser and proceed to localhost:5173/login
  5. two user accounts can be used to log in and test this web application
    4.1 dd@gmail.com for email and password for password(yes just password)
    4.2 omaygot@ambatukam.oh for email and ambasing for password 
  6. perform adding, editing, deleting, viewing tasks by yourself!

# Front-end key architectural decisions.
  1. Page design
    I designed this project to have React Router DOM to handle page changes and redirection. There will be only auth page and Task management page. it will be easier to maintain and understand

  2. Component design
    Using clean code principles and some of best practices, so this will be designed to be a Component tree with App.tsx as the root, having two branches, Login.tsx and TaskManager.tsx components.

    Login.tsx has no child component.

    TaskManager.tsx has TaskAddAndUpdate.tsx and TaskTable.tsx as its children.

    each component will just do their specific job, loosely coupled with anther components, easier to understand and fix.
  



vvvvv  Auto created Content
# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
