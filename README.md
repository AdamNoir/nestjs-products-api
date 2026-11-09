<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# NestJS Products API

A RESTful API for managing products, built with **NestJS** and **TypeScript**. This project provides endpoints for creating, retrieving, updating, and deleting products, with interactive API documentation powered by Swagger.

## Tech Stack

- **Framework:** NestJS
- **Language:** TypeScript
- **API Documentation:** Swagger / OpenAPI
- **Database:** PostgreSQL
- **ORM:** TypeORM

## Getting Started

### Prerequisites

- Node.js
- pnpm
- Docker

### Installation

```bash
git clone https://github.com/YOUR_USERNAME/nestjs-products-api.git
cd nestjs-products-api
pnpm install
```

### Environment Variables

Copy the example environment file:

```bash
cp .env.template .env
```

Configure the required environment variables in .env. Refer to .env.template for the available options.

**Never commit real credentials or secrets.**

### Run the Application - Docker

Build a restapi image and start a database

```bash
docker compose up --build -d
```


### Run the Application - Local

Start the PostgreSQL database using Docker Compose.

Create (or replace) a docker-compose.yml file and pase this code.
```yaml
version: '3'

services:
  db:
    image: postgres:14.3
    restart: always
    ports:
      - "5432:5432"
    environment:
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_NAME}
    container_name: products-db
    volumes:
      - ./postgres:/var/lib/postgresql/data
```

Execute

```bash
docker compose up -d
```

Make sure the database is ready and the connection settings in .env match your Docker configuration.


Run the API

```bash
# Development
pnpm run start:dev

# Production build
pnpm run build

# Production
pnpm run start:prod
```

**Execute '/seed' endpoint**

## API Documentation

Interactive API documentation is available through Swagger UI.

Once the application is running, open:

**http://localhost:3000/api/docs**

Swagger lets you explore available endpoints, inspect request and response schemas, and execute requests directly from your browser.

## API Endpoints

Base URL: `http://localhost:3000/api`

| Method   | Endpoint        | Description              |
| -------- | --------------- | ------------------------ |
| `POST`   | `/products`     | Create a product         |
| `GET`    | `/products`     | Retrieve all products    |
| `GET`    | `/products/:id` | Retrieve a product by ID |
| `PATCH`  | `/products/:id` | Update a product         |
| `DELETE` | `/products/:id` | Delete a product         |
| `GET`    | `/seed`         | Insert new data          |
| `POST`   | `/auth/register`| Create a User            |
| `POST`   | `/auth/login`   | Login a user             |

For request parameters, payload schemas, and response details, refer to the Swagger documentation.

## License

This project is licensed under the [MIT License](LICENSE).
