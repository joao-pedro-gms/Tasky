# API Testing Examples

This file contains example curl commands to test the Tasky API.

## Prerequisites

Make sure the backend server is running:
```bash
cd backend
npm run dev
```

## User Registration

Register a new user:
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"alice","password":"password123"}'
```

Response:
```json
{
  "message": "Usuário criado com sucesso",
  "token": "abc123...",
  "user": {"id": 1, "username": "alice"}
}
```

## User Login

Login with existing credentials:
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"alice","password":"password123"}'
```

Response:
```json
{
  "message": "Login realizado com sucesso",
  "token": "xyz789...",
  "user": {"id": 1, "username": "alice"}
}
```

## Create Task

Create a new task (requires authentication):
```bash
curl -X POST http://localhost:3001/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "Complete project documentation",
    "description": "Write comprehensive docs for the API",
    "deadline": "2025-12-31",
    "tags": ["documentation", "urgent"]
  }'
```

Response:
```json
{
  "id": 1,
  "name": "Complete project documentation",
  "description": "Write comprehensive docs for the API",
  "createdAt": "2025-11-13T12:00:00.000Z",
  "deadline": "2025-12-31",
  "tags": ["documentation", "urgent"],
  "userId": 1,
  "completed": false
}
```

## List All Tasks

Get all tasks for the authenticated user:
```bash
curl -X GET http://localhost:3001/api/tasks \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

Response:
```json
[
  {
    "id": 1,
    "name": "Complete project documentation",
    "description": "Write comprehensive docs for the API",
    "createdAt": "2025-11-13T12:00:00.000Z",
    "deadline": "2025-12-31",
    "tags": ["documentation", "urgent"],
    "userId": 1,
    "completed": false
  }
]
```

## Get Single Task

Get a specific task by ID:
```bash
curl -X GET http://localhost:3001/api/tasks/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Update Task

Update a task (mark as completed):
```bash
curl -X PUT http://localhost:3001/api/tasks/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"completed": true}'
```

Update task details:
```bash
curl -X PUT http://localhost:3001/api/tasks/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "Updated task name",
    "description": "Updated description",
    "deadline": "2025-12-25",
    "tags": ["documentation", "urgent", "review"]
  }'
```

## Delete Task

Delete a task:
```bash
curl -X DELETE http://localhost:3001/api/tasks/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

Response: `204 No Content`

## Logout

Logout and invalidate the token:
```bash
curl -X POST http://localhost:3001/api/auth/logout \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

Response:
```json
{
  "message": "Logout realizado com sucesso"
}
```

## Error Examples

### Unauthorized Access
```bash
curl -X GET http://localhost:3001/api/tasks
```

Response:
```json
{
  "error": "Token de autenticação não fornecido"
}
```

### Invalid Credentials
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"alice","password":"wrongpassword"}'
```

Response:
```json
{
  "error": "Credenciais inválidas"
}
```

### Accessing Another User's Task
```bash
# User A tries to access User B's task
curl -X GET http://localhost:3001/api/tasks/999 \
  -H "Authorization: Bearer USER_A_TOKEN"
```

Response:
```json
{
  "error": "Tarefa não encontrada"
}
```
