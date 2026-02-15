# BudgetBite

A Vite + React + TypeScript app with Radix UI, Lucide icons, and Tailwind CSS.

## Prerequisites
- Node.js LTS (installed via winget or from nodejs.org)

Install via winget (recommended on Windows):
```powershell
winget install OpenJS.NodeJS.LTS
```

## Install
```powershell
cd C:\WebProjects\GIT-Projects\UFA-Projects\BudgetBites\BudgetBite
npm install
```

## Run (dev)
Start the Vite dev server:
```powershell
npm run dev
```
If `npm` or `node` isn’t recognized in this terminal, set PATH for this session and retry:
```powershell
$env:Path = "$env:ProgramFiles\nodejs;$env:Path"
npm run dev
```
The app will be available at:
- http://localhost:5173/

### Dev API proxy (no CORS needed)
- Requests to `/api/*` are proxied to `http://localhost:8080` by Vite during development.
- See proxy config in [vite.config.ts](vite.config.ts).

## Build & Preview (prod)
```powershell
npm run build
npm run preview
```
Preview will start on a local port and serve the `dist/` output.

### Production API options
- Same-origin deploy: serve frontend and backend from the same host, e.g., behind Nginx.
- Or set an explicit API base URL via env:
  - Copy `.env.example` to `.env` and set `VITE_API_BASE_URL` (e.g., `https://api.example.com`).
  - The app will call `${VITE_API_BASE_URL}/api/...` in production.
- Or enable CORS on the API to allow the frontend origin.

### Nginx example (SPA + API proxy)
```
server {
  listen 80;
  server_name app.example.com;

  root /var/www/budgetbite/dist;
  index index.html;

  location /api/ {
    proxy_pass http://localhost:8080/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }

  location / {
    try_files $uri /index.html;
  }
}
```

## Lint & Format
```powershell
npm run lint
npm run lint:fix
npm run format
```

## Troubleshooting
- npm/node not recognized:
  - Open a new terminal after installing Node, or temporarily set PATH:
    ```powershell
    $env:Path = "$env:ProgramFiles\nodejs;$env:Path"
    ```
- Partial/failed install errors (e.g., EPERM on Windows):
  - Close apps that may lock files, then clean and reinstall:
    ```powershell
    Remove-Item -Recurse -Force node_modules; Remove-Item -Force package-lock.json; npm install
    ```
- Port already in use (5173):
  - Either close the other process, or run:
    ```powershell
    npx kill-port 5173
    # or change port
    vite --port 5174
    ```
- Styles not applied:
  - Ensure Tailwind is loaded via the `styles.css` import in [main.tsx](main.tsx).
- Blank page or network 404s in dev:
  - Hard refresh your browser or clear cache. Check terminal for Vite errors.

## Project Scripts
- dev: Run Vite dev server
- build: Type-check then build to `dist/`
- preview: Preview the production build
- lint/lint:fix/format: Code quality tools

## Notable Files
- Entry: [index.html](index.html), [main.tsx](main.tsx)
- App: [App.tsx](App.tsx)
- UI: [components/ui](components/ui)
- Images helper: [components/figma/ImageWithFallback.tsx](components/figma/ImageWithFallback.tsx)
- Tailwind: [tailwind.config.ts](tailwind.config.ts), [postcss.config.js](postcss.config.js), [styles.css](styles.css)
- Build config: [vite.config.ts](vite.config.ts)
- Env file example: [.env.example](.env.example)
- TS config: [tsconfig.json](tsconfig.json)
- Package manifest: [package.json](package.json)