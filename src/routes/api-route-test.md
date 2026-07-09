# Resume API Thunder Client Testing Guide

Base URL used in these examples:

```txt
http://localhost:5173
```

This guide tests the full better-auth + resume API flow:

1. Create an account
2. Log in
3. View the resume list
4. Create a resume
5. View one resume
6. Edit the resume
7. Duplicate the resume
8. Delete the resume

After logging in, Thunder Client should preserve the auth cookie automatically. If authenticated resume requests return `401 Unauthorized`, confirm that Thunder Client cookies are enabled and that the login request succeeded.

---

## 1. Create Account

```http
POST http://localhost:5173/api/auth/sign-up/email
```

### Headers

```txt
Content-Type: application/json
```

### Body

```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "Password123!"
}
```

### Expected Result

A successful better-auth signup response. The exact response shape may vary depending on your better-auth configuration.

---

## 2. Log In

```http
POST http://localhost:5173/api/auth/sign-in/email
```

### Headers

```txt
Content-Type: application/json
```

### Body

```json
{
  "email": "test@example.com",
  "password": "Password123!"
}
```

### Expected Result

A successful login response and a session cookie stored by Thunder Client.

---

## 3. View Resume List

```http
GET http://localhost:5173/api/resumes
```

### Optional Filtered Request

```http
GET http://localhost:5173/api/resumes?q=developer&page=1&offset=0
```

### Expected Response

```json
{
  "resumes": [],
  "page": 1,
  "offset": 0,
  "returned": 0
}
```

The `resumes` array will contain resume objects once resumes have been created.

---

## 4. Create Resume

```http
POST http://localhost:5173/api/resumes
```

### Headers

```txt
Content-Type: application/json
```

### Body

```json
{
  "title": "Software Developer Resume",
  "subtitle": [
    {
      "label": "Email",
      "value": "test@example.com"
    },
    {
      "label": "Location",
      "value": "Boise, ID"
    }
  ],
  "sections": [
    {
      "type": "timeline",
      "title": "Experience",
      "entries": [
        {
          "type": "timeline",
          "heading": "Junior Software Developer",
          "subheading": "Example Company",
          "location": "Remote",
          "startDate": "2025-01",
          "endDate": "Present",
          "bullets": [
            "Built and maintained full-stack web applications.",
            "Worked with TypeScript, SvelteKit, and MongoDB."
          ]
        }
      ]
    },
    {
      "type": "list",
      "title": "Skills",
      "entries": [
        {
          "type": "list",
          "heading": "Technical Skills",
          "items": ["TypeScript", "SvelteKit", "MongoDB", "Node.js"]
        }
      ]
    }
  ],
  "spacing": {
    "bullet": 1.2,
    "section": 1.5
  },
  "font": {
    "family": "Arial",
    "sizes": {
      "title": 28,
      "heading": 18,
      "bullet": 12
    }
  }
}
```

### Expected Response

```json
{
  "message": "Resume created successfully",
  "_id": "REPLACE_WITH_RETURNED_ID",
  "title": "Software Developer Resume",
  "createdAt": "2026-07-09T00:00:00.000Z"
}
```

Copy the returned `_id`. Use it in the following requests wherever you see `RESUME_ID_HERE`.

---

## 5. View One Resume

```http
GET http://localhost:5173/api/resumes/RESUME_ID_HERE
```

### Expected Response

```json
{
  "resume": {
    "_id": "RESUME_ID_HERE",
    "user_id": "AUTH_USER_ID",
    "title": "Software Developer Resume",
    "subtitle": [],
    "sections": [],
    "spacing": {
      "bullet": 1.2,
      "section": 1.5
    },
    "font": {
      "family": "Arial",
      "sizes": {
        "title": 28,
        "heading": 18,
        "bullet": 12
      }
    },
    "createdAt": "2026-07-09T00:00:00.000Z",
    "updatedAt": "2026-07-09T00:00:00.000Z"
  }
}
```

The exact `subtitle` and `sections` values should match the resume you created.

---

## 6. Edit Resume

```http
PUT http://localhost:5173/api/resumes/RESUME_ID_HERE
```

### Headers

```txt
Content-Type: application/json
```

### Body

```json
{
  "title": "Updated Software Developer Resume",
  "subtitle": [
    {
      "label": "Email",
      "value": "test@example.com"
    },
    {
      "label": "Portfolio",
      "value": "https://example.com"
    }
  ],
  "sections": [
    {
      "type": "timeline",
      "title": "Experience",
      "entries": [
        {
          "type": "timeline",
          "heading": "Software Developer",
          "subheading": "Updated Example Company",
          "location": "Boise, ID",
          "startDate": "2025-01",
          "endDate": "Present",
          "bullets": [
            "Developed SvelteKit applications backed by MongoDB.",
            "Implemented authenticated API routes using better-auth.",
            "Created reusable resume editing components."
          ]
        }
      ]
    },
    {
      "type": "structured",
      "title": "Projects",
      "entries": [
        {
          "type": "structured",
          "heading": "Resume Builder App",
          "startDate": "2026-01",
          "endDate": "2026-07",
          "bullets": [
            "Built a resume builder with custom sections and persistent user data.",
            "Used Zod schemas for request validation."
          ]
        }
      ]
    },
    {
      "type": "list",
      "title": "Skills",
      "entries": [
        {
          "type": "list",
          "heading": "Technical Skills",
          "items": ["TypeScript", "SvelteKit", "MongoDB", "Zod", "better-auth"]
        }
      ]
    }
  ],
  "spacing": {
    "bullet": 1.25,
    "section": 1.75
  },
  "font": {
    "family": "Inter",
    "sizes": {
      "title": 30,
      "heading": 18,
      "bullet": 12
    }
  }
}
```

### Expected Response

```json
{
  "message": "Resume updated successfully",
  "id": "RESUME_ID_HERE",
  "title": "Updated Software Developer Resume",
  "updatedAt": "2026-07-09T00:00:00.000Z"
}
```

---

## 7. Duplicate Resume

```http
POST http://localhost:5173/api/resumes/RESUME_ID_HERE
```

### Headers

```txt
Content-Type: application/json
```

### Body

```json
{
  "title": "Duplicated Resume Copy"
}
```

### Expected Response

```json
{
  "message": "Resume duplicated successfully",
  "originalResumeId": "RESUME_ID_HERE",
  "_id": "NEW_DUPLICATED_RESUME_ID",
  "title": "Duplicated Resume Copy",
  "createdAt": "2026-07-09T00:00:00.000Z"
}
```

Copy the duplicated `_id` if you want to view, edit, or delete the copied resume.

---

## 8. Delete Resume

```http
DELETE http://localhost:5173/api/resumes/RESUME_ID_HERE
```

You can delete either the original resume ID or the duplicated resume ID.

### Expected Response

```json
{
  "message": "Resume deleted successfully",
  "id": "RESUME_ID_HERE",
  "title": "Updated Software Developer Resume",
  "updatedAt": "2026-07-09T00:00:00.000Z"
}
```

---

## Common Errors

### Unauthorized

```json
{
  "message": "Unauthorized",
  "status": 401
}
```

This usually means you are not logged in, the session cookie was not stored, or Thunder Client is not sending cookies with the request.

### Invalid Resume ID

```json
{
  "message": "Invalid resume ID",
  "status": 400
}
```

This means the `id` in the URL is not a valid MongoDB ObjectId.

### Resume Not Found

```json
{
  "message": "Resume not found",
  "status": 404
}
```

This usually means the resume does not exist or does not belong to the currently authenticated user.

### Invalid Resume Data

```json
{
  "message": "Invalid resume data",
  "status": 400,
  "errors": {}
}
```

This means the request body did not pass your Zod validation schema.
