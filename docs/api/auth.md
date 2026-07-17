# Auth API

## POST /api/auth/login

**Body:**
```json
{ "email": "admin@ems.com", "password": "Admin@12345" }
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJ...",
    "refreshToken": "eyJ...",
    "user": { "_id": "...", "name": "Super Admin", "email": "admin@ems.com", "role": "super_admin" }
  }
}
```

---

## POST /api/auth/logout

**Body:**
```json
{ "refreshToken": "eyJ..." }
```

**Response 200:**
```json
{ "success": true, "message": "Logged out successfully" }
```

---

## POST /api/auth/refresh

**Body:**
```json
{ "refreshToken": "eyJ..." }
```

**Response 200:**
```json
{
  "success": true,
  "data": { "accessToken": "eyJ...", "user": { ... } }
}
```

---

## GET /api/auth/me

**Headers:** `Authorization: Bearer <token>`

**Response 200:**
```json
{
  "success": true,
  "data": { "user": { "_id": "...", "name": "...", "email": "...", "role": "..." } }
}
```
