# Todo Backend

NestJS backend with Prisma and SQLite for the Todo application.

## Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create environment file:**
   ```bash
   copy env.example .env
   ```

3. **Generate Prisma client:**
   ```bash
   npm run prisma:generate
   ```

4. **Run database migrations:**
   ```bash
   npm run prisma:migrate
   ```

5. **Seed the database with categories:**
   ```bash
   npm run prisma:seed
   ```

6. **Start the development server:**
   ```bash
   npm run start:dev
   ```

The server will run on `http://localhost:3001` with CORS enabled for `http://localhost:3000`.

## Global Features

### ValidationPipe
- **Global validation** enabled for all DTOs
- **Whitelist mode**: Only defined properties are allowed
- **Transform**: Automatically transforms payloads to DTO instances
- **Forbid non-whitelisted**: Rejects requests with unknown properties

### CORS
- **Enabled** for `http://localhost:3000` (frontend)
- **Methods**: GET, HEAD, PUT, PATCH, POST, DELETE
- **Credentials**: Enabled for authentication

### Request Logging (Development)
- **HTTP requests** are logged with method, URL, status, response time
- **User-Agent** information included
- **Response time** tracking for performance monitoring

## Database Models

- **Category**: id (uuid), name (unique), createdAt, updatedAt
- **Todo**: id (uuid), text, completed (default false), categoryId (FK), createdAt, updatedAt

## API Contracts

### Categories API
- **GET /categories** → Returns array of `{ id, name }` sorted by **name** (ascending)
- Categories are sorted alphabetically by name for consistent ordering

### Todos API
- **GET /todos?category=<id|All>** → Returns todos with category filtering by **ID** (not name)
- **POST /todos** → Business rule: Maximum 5 tasks per category
- **PATCH /todos/:id** → Only updates completed status
- Todos are filtered by category ID for performance and consistency

## Available Scripts

- `npm run start:dev` - Start development server
- `npm run build` - Build for production
- `npm run start:prod` - Start production server
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:seed` - Seed database with initial data
- `npm run test:db` - Test database connection
- `npm run test:validation` - Test API validation (requires running server)
- `npm run test:api` - Comprehensive API test (requires running server)

## Testing

### Automated Testing
```bash
# Test database connection
npm run test:db

# Test API validation
npm run test:validation

# Comprehensive API test
npm run test:api
```

### Manual Testing
See [MANUAL-TESTING.md](./MANUAL-TESTING.md) for detailed manual testing guide.
