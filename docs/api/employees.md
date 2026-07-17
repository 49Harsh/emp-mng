# Employees API

## GET /api/employees

**Query params:**
- `page` (default: 1)
- `limit` (default: 10)
- `search` — name, email, or employeeId
- `department` — department ObjectId
- `role` — super_admin | hr_manager | employee
- `status` — active | inactive
- `sortBy` — name | joiningDate | salary | createdAt
- `sortOrder` — asc | desc

**Response 200:**
```json
{
  "success": true,
  "data": [ { "employeeId": "EMP0001", "name": "...", ... } ],
  "pagination": { "page": 1, "limit": 10, "total": 50, "pages": 5 }
}
```

---

## POST /api/employees

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@company.com",
  "password": "Password@123",
  "phone": "+1234567890",
  "department": "<ObjectId>",
  "designation": "Software Engineer",
  "salary": 75000,
  "joiningDate": "2023-01-15",
  "status": "active",
  "role": "employee",
  "reportingManager": "<ObjectId>"
}
```

---

## PUT /api/employees/:id

Same as POST body but all fields optional (min 1 required).

---

## DELETE /api/employees/:id

Soft deletes the employee. Permanent deletion occurs automatically after 30 days via cron job.

---

## POST /api/employees/:id/profile-image

**Content-Type:** `multipart/form-data`  
**Field:** `profileImage` (image file, max 5MB)

---

## POST /api/employees/import/csv

**Content-Type:** `multipart/form-data`  
**Field:** `csvFile` (.csv file)

**CSV Columns:** name, email, phone, department, designation, salary, joiningDate, status, role

**Response:**
```json
{
  "success": true,
  "data": { "created": 5, "failed": 1, "errors": [{ "row": "...", "error": "..." }] }
}
```
