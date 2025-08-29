# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

# Invitación de boda — Esmeralda & Jorge

Invitación web para la boda de Jorge Hugo Rodríguez Peñaloza y Esmeralda Dueñas Fuentes. Evento en Comala, Colima. Fecha: 29 de noviembre de 2025.

## Scripts
- `npm run dev`: entorno de desarrollo
- `npm run build`: build de producción
- `npm run preview`: previsualizar build

## GitHub Pages
- Workflow en `.github/workflows/deploy.yml`
- Publica automáticamente al hacer push en `main`
 - Fuente: GitHub Actions (no se usa rama `gh-pages` ni script `deploy`)

### Extras añadidos
- Favicon personalizado en `public/favicon.svg` y referenciado desde `index.html`.
- Metatags Open Graph/Twitter con imagen absoluta para compartir correctamente.
- `public/404.html` como fallback para GitHub Pages (redirección a `/boda-jorge-esmeralda/`).

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

## Servidor PDF (fallback)

Se agregó un pequeño servidor local que genera PDFs A6 de la invitación cuando la generación cliente falla.

- Archivo: `scripts/pdf-server.mjs`
- Puerto por defecto: `4410`

Cómo ejecutar (desde la raíz del repo):

```bash
node scripts/pdf-server.mjs
# luego en otra terminal
curl -sS "http://localhost:4410/api/pdf?invite=5&code=001" --output tmp/generated-invite-5.pdf
```

Estado / health:

```bash
curl -sS http://localhost:4410/api/health
```

El PDF de prueba generado se guarda en `tmp/generated-invite-5.pdf`.

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
