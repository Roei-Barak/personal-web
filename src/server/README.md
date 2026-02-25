# Ski Trip Manager Backend

## Setup

1. Install dependencies:
   ```bash
   npm install express better-sqlite3 bcryptjs jsonwebtoken cors
   ```

2. Start the server:
   ```bash
   node src/server/server.js
   ```

## Endpoints

- `POST /api/register` — Register new user (seeds INIT data)
- `POST /api/login` — Login, returns JWT
- `GET /api/items` — Get packing items (auth required)
- `POST /api/items` — Add item
- `PUT /api/items/:id` — Edit item
- `DELETE /api/items/:id` — Delete item

(Repeat for reminders, resorts, insurance, places, uploads)

## Notes
- All data is per user (each user gets their own packing list, reminders, etc.)
- INIT data is seeded for new users
- Extend endpoints for all entities as needed
