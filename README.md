# Settings Management System

A full-stack application for managing JSON configuration settings with CRUD operations.

## Tech Stack

- **Backend**: Node.js + Express (TypeScript)
- **Frontend**: React (TypeScript)
- **Database**: PostgreSQL with JSONB
- **Containerization**: Docker & Docker Compose

## Getting Started

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/)
- (Optional) Node.js 18+ and npm if running backend/frontend locally without Docker

### Run with Docker Compose

From the project root:

```bash
docker-compose up --build
```

This starts:

- **PostgreSQL** on `localhost:5432`
- **Backend** on `http://localhost:3000`
- **Frontend** on `http://localhost:5173`

Open [http://localhost:5173](http://localhost:5173) in a browser to use the Settings Manager.

## Custom Configuration (Optional)

To customize database credentials or other settings:

1. **Copy the example environment file:**
```bash
   cp .env.example .env
```

2. **Edit `.env` with your preferred values:**
```env
   POSTGRES_DB=settings_db
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=your_password_here
   NODE_ENV=development
```

## Run backend and frontend locally (no Docker)

1. **Database**: Start PostgreSQL (e.g. via Docker) and ensure a DB exists. Apply `backend/init.sql` if the `settings` table is not yet created.


2. **Backend**:

   ```bash
   cd backend
   npm install
   npm run dev
   ```

3. **Frontend**:

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

   Ensure `frontend/src/service/api.ts` points at your backend URL (default `http://localhost:3000`).

## Demo/How to test:
https://youtu.be/BwyhyPMjqaw

## API Reference

Base URL: `http://localhost:3000` (or your backend host).

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/settings` | List of all settings with pagination. Query: `limit` (default 10), `offset` (default 0). |
| `GET` | `/settings/:uid` | Get a single setting by UID. |
| `POST` | `/settings` | Create a setting. Body: JSON object (stored as `json_data`). |
| `PUT` | `/settings/:uid` | Update a setting by UID. Body: JSON object. |
| `DELETE` | `/settings/:uid` | Delete a setting by UID. |

**Examples**

- List: `GET /settings?limit=10&offset=0`
- Create: `POST /settings` with body e.g. `{"theme": "dark", "notifications": true}`
- Update: `PUT /settings/<uuid>` with body `{"theme": "light"}`
- Delete: `DELETE /settings/<uuid>`

Response shapes align with the `Setting` type: `id`, `data` (JSON), `created_at`, `updated_at`.

## Sources used:
- **Backend**
- https://www.youtube.com/watch?v=lYh6LrSIDvY
- https://www.youtube.com/watch?v=K1a2Bk8NrYQ
- https://www.youtube.com/watch?v=_HG2eB27j00
- https://www.atdatabases.org/docs/pg-guide-typescript
- PostgreSQL documentation: https://www.postgresql.org/docs/current/sql-commands.html
- https://www.youtube.com/watch?v=nvguaJX2FwA
- HTTP Error codes: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status
- Pagination help: https://www.geeksforgeeks.org/sql/pagination-in-sql/

- **Frontend**:
- Axios examples: https://geshan.com.np/blog/2023/11/axios-typescript/
- Record data type: https://refine.dev/blog/typescript-record-type/#enter-the-record
