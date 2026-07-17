# API Documentation

Base URL: `http://localhost:5000/api`

All protected endpoints require: `Authorization: Bearer <accessToken>`

## Authentication

See [auth.md](auth.md) for full auth API docs.

| Endpoint | Method | Auth | Description |
|---|---|---|---|
| /auth/login | POST | No | Login with email/password |
| /auth/logout | POST | No | Revoke refresh token |
| /auth/refresh | POST | No | Get new access token |
| /auth/me | GET | Yes | Get current user profile |

## Employees

See [employees.md](employees.md) for full employee API docs.

| Endpoint | Method | Auth | Role |
|---|---|---|---|
| /employees | GET | Yes | Admin, HR |
| /employees | POST | Yes | Admin, HR |
| /employees/:id | GET | Yes | Admin, HR |
| /employees/:id | PUT | Yes | Admin, HR |
| /employees/:id | DELETE | Yes | Admin only |
| /employees/:id/profile-image | POST | Yes | Admin, HR |
| /employees/import/csv | POST | Yes | Admin, HR |

## Organization

See [organization.md](organization.md) for full organization API docs.

| Endpoint | Method | Auth | Role |
|---|---|---|---|
| /organization/tree | GET | Yes | All |
| /organization/:id/reportees | GET | Yes | All |
| /organization/:id/manager | PATCH | Yes | Admin, HR |

## Departments

| Endpoint | Method | Auth | Role |
|---|---|---|---|
| /departments | GET | Yes | All |
| /departments | POST | Yes | Admin only |
| /departments/:id | GET | Yes | All |
| /departments/:id | PUT | Yes | Admin only |
| /departments/:id | DELETE | Yes | Admin only |

## Dashboard

| Endpoint | Method | Auth | Role |
|---|---|---|---|
| /dashboard | GET | Yes | Admin, HR |

## Response Format

All responses follow this format:

```json
{
  "success": true,
  "message": "Success",
  "data": { ... }
}
```

Paginated responses include:

```json
{
  "success": true,
  "message": "Success",
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5
  }
}
```

Error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [{ "field": "email", "message": "Invalid email" }]
}
```
