# Student Portal (React)

Converted from Angular to React + Vite + TypeScript + Tailwind CSS.

## Features

- **Home** – Landing page
- **Add Student** – Public form to register students
- **Admin Login** – JWT-based authentication
- **Dashboard** – Protected admin area with list / edit / delete students

## Tech Stack

- React 19
- Vite 6
- TypeScript
- React Router 7
- Axios
- Tailwind CSS 4

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## API

By default the app calls `http://localhost:3000/api`.

You can override this with an environment variable:

```bash
# .env
VITE_API_URL=http://localhost:3000/api
```

## Scripts

| Command         | Description              |
|-----------------|--------------------------|
| `npm run dev`   | Start development server |
| `npm run build` | Production build         |
| `npm run preview` | Preview production build |

## Project Structure

```
src/
  components/     # ProtectedRoute
  contexts/       # AuthContext
  pages/          # Home, Login, StudentAdd, Dashboard
  services/       # api, authService, studentService
  App.tsx
  main.tsx
  config.ts
  index.css
```
