# Notes App

Simple full-stack notes application built with:

-   Frontend: React + Vite
-   Backend: Express.js
-   Database: PostgreSQL

The app supports creating, editing, viewing, and deleting notes.

------------------------------------------------------------------------

## Features

-   Create, edit, delete notes
-   Instant UI updates (no full refetch)
-   REST API with Express
-   PostgreSQL persistence
-   Environment-based configuration
-   Single command to run frontend + backend

------------------------------------------------------------------------

## Requirements

Install before running:

-   Node.js (LTS recommended)
-   npm
-   PostgreSQL

Check installations:

node -v npm -v psql --version

------------------------------------------------------------------------

## Setup

### 1. Clone the repository

git clone `<https://github.com/luisahorlledecastro/notes-app>`{=html} cd notes-app

------------------------------------------------------------------------

### 2. Install dependencies

Install root dev tools:

npm install

Install backend dependencies:

cd server npm install cd ..

Install frontend dependencies:

cd client npm install cd ..

------------------------------------------------------------------------

### 3. Environment variables

Create an env file based on the template:

cp server/.env.example server/.env

Default example:

PORT=4000 DATABASE_URL=postgres://localhost:5432/notesdb

Adjust if your Postgres setup differs.

------------------------------------------------------------------------

### 4. Create the database

Create a local database:

createdb notesdb

Create the notes table:

psql notesdb -c "CREATE TABLE notes ( id SERIAL PRIMARY KEY, title TEXT
NOT NULL, content TEXT NOT NULL, created_at TIMESTAMP DEFAULT NOW() );"

------------------------------------------------------------------------

## Development

Run both frontend and backend together from the project root:

npm run dev

Frontend runs at: http://localhost:5173

Backend runs at: http://localhost:4000

------------------------------------------------------------------------

## API Endpoints

Health GET /health

Database Check GET /dbcheck

Notes GET /notes \# list notes POST /notes \# create note PUT /notes/:id
\# update note DELETE /notes/:id \# delete note

------------------------------------------------------------------------

## Environment Files

The real .env file is not committed.

Use:

server/.env.example

as a template.

------------------------------------------------------------------------

## Scripts

Root scripts:

npm run dev \# run frontend + backend together npm run dev:server \# run
backend only npm run dev:client \# run frontend only

Backend scripts (server/package.json):

npm run dev \# nodemon server

Frontend scripts (client/package.json):

npm run dev \# vite dev server

------------------------------------------------------------------------

## Tech Notes

-   Frontend state updates locally after API calls for faster UI.
-   API logic lives in client/src/api.js.
-   UI split into NoteForm and NoteList components.

------------------------------------------------------------------------

## Future Improvements

-   Authentication
-   Pagination
-   Docker setup
-   Deployment automation
-   UI styling

------------------------------------------------------------------------

## License

MIT
