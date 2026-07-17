# Organization API

## GET /api/organization/tree

Returns the full reporting hierarchy as a nested tree.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "tree": [
      {
        "_id": "...",
        "name": "Super Admin",
        "designation": "CTO",
        "children": [
          {
            "_id": "...",
            "name": "Alice Dev",
            "children": []
          }
        ]
      }
    ]
  }
}
```

---

## GET /api/organization/:id/reportees

Returns direct reports (one level only) for an employee.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "reportees": [
      { "_id": "...", "name": "Bob Dev", "designation": "Engineer", ... }
    ]
  }
}
```

---

## PATCH /api/organization/:id/manager

Update an employee's reporting manager. Validates against circular chains.

**Body:**
```json
{ "managerId": "<ObjectId>" }
```

Pass `null` as `managerId` to remove the manager.

**Errors:**
- `400` — Self-assignment or circular chain detected
- `404` — Employee or manager not found

**Response 200:**
```json
{
  "success": true,
  "message": "Reporting manager updated",
  "data": { "employee": { ... } }
}
```
