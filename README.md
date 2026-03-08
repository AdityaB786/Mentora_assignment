# Mentora Backend

Mentora Backend is a production-structured MVP backend for a mentorship platform. It provides JWT authentication, role-based access control for parents and mentors, student and lesson management, lesson bookings, mentor session tracking, and an LLM-powered summarization endpoint with rate limiting.

## Project Structure

```text
mentora-backend
├── src
│   ├── config
│   │   └── db.js
│   ├── controllers
│   │   ├── authController.js
│   │   ├── bookingController.js
│   │   ├── lessonController.js
│   │   ├── llmController.js
│   │   ├── sessionController.js
│   │   └── studentController.js
│   ├── middleware
│   │   ├── authMiddleware.js
│   │   ├── rateLimiter.js
│   │   └── roleMiddleware.js
│   ├── models
│   │   ├── Booking.js
│   │   ├── Lesson.js
│   │   ├── Session.js
│   │   ├── Student.js
│   │   └── User.js
│   ├── routes
│   │   ├── authRoutes.js
│   │   ├── bookingRoutes.js
│   │   ├── lessonRoutes.js
│   │   ├── llmRoutes.js
│   │   ├── sessionRoutes.js
│   │   └── studentRoutes.js
│   └── server.js
├── .env.example
├── package.json
└── README.md
```

## Setup Instructions

1. Ensure you have Node.js 18+ and a MongoDB instance available.
2. Install dependencies:

```bash
npm install
```

3. Copy the example environment file and update it:

```bash
cp .env.example .env
```

## Environment Variables

The application uses the following environment variables:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/mentora
JWT_SECRET=replace_with_a_long_random_secret
OPENAI_API_KEY=replace_with_your_openai_api_key
```

## How To Run The Project

Development mode:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

Health check:

```bash
curl http://localhost:5000/health
```

## API Endpoints

### Authentication

Signup:

```bash
curl -X POST http://localhost:5000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Priya Sharma",
    "email": "priya@example.com",
    "password": "strongpass123",
    "role": "parent"
  }'
```

Login:

```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "priya@example.com",
    "password": "strongpass123"
  }'
```

Get current user:

```bash
curl http://localhost:5000/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Students

Create student as parent:

```bash
curl -X POST http://localhost:5000/students \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer PARENT_JWT_TOKEN" \
  -d '{
    "name": "Aarav Sharma",
    "age": 13
  }'
```

List students for authenticated parent:

```bash
curl http://localhost:5000/students \
  -H "Authorization: Bearer PARENT_JWT_TOKEN"
```

### Lessons

Create lesson as mentor:

```bash
curl -X POST http://localhost:5000/lessons \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer MENTOR_JWT_TOKEN" \
  -d '{
    "title": "Introduction to Algebra",
    "description": "A beginner-friendly lesson covering variables, expressions, and equations."
  }'
```

### Bookings

Book a lesson for a student as parent:

```bash
curl -X POST http://localhost:5000/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer PARENT_JWT_TOKEN" \
  -d '{
    "studentId": "STUDENT_ID",
    "lessonId": "LESSON_ID"
  }'
```

### Sessions

Create a session as mentor:

```bash
curl -X POST http://localhost:5000/sessions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer MENTOR_JWT_TOKEN" \
  -d '{
    "lessonId": "LESSON_ID",
    "date": "2026-03-08T10:00:00.000Z",
    "topic": "Solving linear equations",
    "summary": "Covered balancing both sides of an equation and basic practice problems."
  }'
```

Fetch sessions by lesson:

```bash
curl http://localhost:5000/lessons/LESSON_ID/sessions \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### LLM Summarization

Summarize long text:

```bash
curl -X POST http://localhost:5000/llm/summarize \
  -H "Content-Type: application/json" \
  -d '{
    "text": "This is a long piece of text that is definitely more than fifty characters long and is suitable for testing the summarization endpoint."
  }'
```

Expected success response:

```json
{
  "summary": "- ...\n- ...\n- ...",
  "model": "gpt-4o-mini"
}
```

Notes for summarization validation:

- Returns `400` if `text` is missing.
- Returns `400` if `text` is empty.
- Returns `400` if `text` is shorter than 50 characters.
- Returns `413` if `text` exceeds 10000 characters.
- Returns `502` with `"LLM service unavailable"` if the provider call fails.

## Implementation Notes

- Passwords are hashed with `bcrypt`.
- JWT authentication protects secured routes.
- Parents can only manage their own students and bookings.
- Mentors can only create lessons and sessions for lessons they own.
- The summarize endpoint is rate-limited to 10 requests per minute per IP.
