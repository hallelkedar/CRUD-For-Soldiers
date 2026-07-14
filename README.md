# CRUD For Soldiers

A RESTful CRUD API for managing soldier records, built with **Node.js**, **Express**, and **MySQL**. Data validation is handled with **Zod**, and the database runs in a **Docker** container via `docker-compose`.

## Features

- Create, read, update, and delete soldier records
- Filter/search soldiers by field
- Dedicated endpoint to update a soldier's status
- Request body validation with Zod schemas
- Centralized error handling middleware
- MySQL database auto-initialized on startup (creates the database and `soldiers` table if they don't exist)

## Tech Stack

- **Runtime:** Node.js (ES Modules)
- **Framework:** Express 5
- **Database:** MySQL 9 (via `mysql2`)
- **Validation:** Zod
- **Containerization:** Docker Compose
- **Env management:** dotenv

## Project Structure

```
CRUD-For-Soldiers/
├── app.js                   # Express app setup and middleware
├── data/
│   ├── setup.js              # DB connection, database & table initialization
│   └── repository.js         # Generic repository (CRUD queries) for soldiers
├── routes/
│   └── soldierRouter.js      # Soldier API routes
├── utils/
│   └── validation.js         # Zod schemas for request validation
├── docker-compose.yml        # MySQL service definition
└── package.json
```

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [Docker](https://www.docker.com/) & Docker Compose

## Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/hallelkedar/CRUD-For-Soldiers.git
   cd CRUD-For-Soldiers
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the project root:
   ```env
   DB_HOST=<your_host_name>
   DB_PORT=<your_database_port>
   DB_USER=<your_database_user>
   DB_NAME=<your_database_name>
   MYSQL_ROOT_PASSWORD=<your_root_password>
   ```

4. **Start the MySQL database**
   ```bash
   docker-compose up -d
   ```

5. **Run the app**
   ```bash
   node app.js
   ```

   The database and `soldiers` table are created automatically on startup if they don't already exist.

## Database Schema

The `soldiers` table:

| Column         | Type          | Notes                        |
|----------------|---------------|-------------------------------|
| id             | INT           | Primary key, auto-increment  |
| name           | VARCHAR(30)   | Required                     |
| role           | TEXT          | Required                     |
| soldier_rank   | VARCHAR(20)   | Default: `'pte'`             |
| unit           | VARCHAR(30)   | Required                     |
| age            | INT           |                               |
| status         | VARCHAR(30)   | Default: `'active'`          |
| created_at     | TIMESTAMP     | Default: current timestamp   |

## API Endpoints

| Method | Endpoint            | Description                        |
|--------|----------------------|-------------------------------------|
| GET    | `/`                  | Get all soldiers                   |
| GET    | `/:id`               | Get a soldier by ID                |
| POST   | `/`                  | Create a new soldier               |
| PUT    | `/:id`               | Update a soldier's details         |
| PATCH  | `/:id/status`        | Update a soldier's status          |
| DELETE | `/:id`               | Delete a soldier                   |

### Example: Create a soldier

**Request**
```http
POST /
Content-Type: application/json

{
  "name": "David Cohen",
  "role": "Rifleman",
  "soldier_rank": "sgt",
  "unit": "Golani",
  "age": 21
}
```

**Response**
```json
{
  "success": true,
  "data": "Soldier (1) created successfully."
}
```

### Example: Update status

**Request**
```http
PATCH /1/status
Content-Type: application/json

{
  "status": "on leave"
}
```

## Validation Rules

- `name`: 2–30 characters
- `soldier_rank`: 3–20 characters
- `status`: 2–30 characters (optional on create)
- `role`, `unit`: required strings
- `age`: number

Updates (`PUT`) accept a partial version of the schema, so only the fields being changed need to be included.

## Error Handling

Errors are caught by a centralized error-handling middleware and returned in a consistent format:

```json
{
  "success": false,
  "message": "Error description"
}
```