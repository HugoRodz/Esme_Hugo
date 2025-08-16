# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

# Invitación de boda — Jorge & Esmeralda

Invitación web para la boda de Jorge Hugo Rodríguez Peñaloza y Esmeralda Dueñas Fuentes. Evento en Comala, Colima. Fecha: 29 de noviembre de 2025.

## Scripts
- `npm run dev`: entorno de desarrollo
- `npm run build`: build de producción
- `npm run preview`: previsualizar build

## GitHub Pages
- Workflow en `.github/workflows/deploy.yml`
- Publica automáticamente al hacer push en `main`
 - Fuente: GitHub Actions (no se usa rama `gh-pages` ni script `deploy`)

_Nota:_ despliegue de prueba desde Mac para verificar flujo de Actions.

## Diseño
- Vite + React + TypeScript
- Tailwind v4 (plugin oficial para Vite)
- Tipografías: Marcellus (serif), Inter (sans)

## Próximos pasos
- Reemplazar "Foto del jardín" por una imagen real en `src/assets`
- Agregar sección de mapa y rutas
- Agregar formulario de RSVP conectado a un backend (o Google Forms / Airtable)

## Imágenes
- Sube tus imágenes a `public/images/` (se versionan con `.gitkeep`).
- Para usarlas, referencia rutas absolutas desde `public`: `/images/archivo.jpg`.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
