# Todo API Documentation

## Base URL
`http://localhost:3001`

## Categories API

### GET /categories
Get all categories
- **Response**: Array of categories sorted by name (ascending)
- **Example**:
```json
[
  {
    "id": "uuid",
    "name": "Work"
  },
  {
    "id": "uuid",
    "name": "Personal"
  }
]
```

### GET /categories/:id
Get category by ID
- **Parameters**: `id` (string) - Category UUID
- **Response**: Category object with id and name
- **Example**:
```json
{
  "id": "uuid",
  "name": "Work"
}
```
- **Errors**: 404 if category not found

### POST /categories
Create new category
- **Body**:
```json
{
  "name": "string" // required, max 100 chars
}
```
- **Response**: Created category with id and name
- **Example**:
```json
{
  "id": "uuid",
  "name": "Work"
}
```
- **Errors**: 409 if name already exists

### PATCH /categories/:id
Update category
- **Parameters**: `id` (string) - Category UUID
- **Body**:
```json
{
  "name": "string" // optional, max 100 chars
}
```
- **Response**: Updated category with id and name
- **Example**:
```json
{
  "id": "uuid",
  "name": "Work"
}
```
- **Errors**: 404 if category not found, 409 if name already exists

### DELETE /categories/:id
Delete category
- **Parameters**: `id` (string) - Category UUID
- **Response**: 204 No Content
- **Errors**: 404 if category not found

## Todos API

### GET /todos
Get all todos
- **Query Parameters**: 
  - `category` (optional) - Filter by category ID or "All" for all todos
- **Response**: Array of todos with category info
- **Example**:
```json
[
  {
    "id": "uuid",
    "text": "Complete project",
    "completed": false,
    "category": {
      "id": "uuid",
      "name": "Work"
    },
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### GET /todos/:id
Get todo by ID
- **Parameters**: `id` (string) - Todo UUID
- **Response**: Todo object with category info
- **Errors**: 404 if todo not found

### POST /todos
Create new todo
- **Body**:
```json
{
  "text": "string", // required, min 1 char
  "categoryId": "uuid" // required, valid category UUID
}
```
- **Response**: Created todo with category info
- **Business Rule**: Maximum 5 tasks per category
- **Errors**: 
  - 400 if category not found
  - 400 if category already has 5 tasks: "Category '<name>' already has 5 tasks."

### PATCH /todos/:id
Update todo completion status
- **Parameters**: `id` (string) - Todo UUID
- **Body**:
```json
{
  "completed": true // required, boolean
}
```
- **Response**: Updated todo with category info
- **Errors**: 404 if todo not found

### DELETE /todos/:id
Delete todo
- **Parameters**: `id` (string) - Todo UUID
- **Response**: 204 No Content
- **Errors**: 404 if todo not found

## Error Responses

All error responses follow this format:
```json
{
  "statusCode": 400,
  "message": "Error description",
  "error": "Bad Request"
}
```

### Common Error Codes
- `400` - Bad Request (validation errors, invalid data)
- `404` - Not Found (resource doesn't exist)
- `409` - Conflict (duplicate name, etc.)
- `500` - Internal Server Error
