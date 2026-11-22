# SkillSync REST API Documentation

SkillSync exposes a modular, RESTful API adhering to HTTP status code conventions, JSON payloads, and JWT bearer token authentication.

## Base URL
- Local: `http://localhost:5000/api`
- Production: `https://skillsync-backend.onrender.com/api`

---

## Authentication Endpoints (`/api/auth`)

### 1. Register User & Profile
- **Method**: `POST`
- **Path**: `/api/auth/register`
- **Access**: Public
- **Request Body**:
```json
{
  "name": "Sonali Kumari",
  "email": "sonali@skillsync.edu",
  "password": "Password@123",
  "college": "IIT Bombay",
  "department": "Computer Science & Design",
  "academicYear": "3rd Year",
  "role": "student"
}
```
- **Response `201 Created`**:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsIn...",
  "user": {
    "id": "67...",
    "name": "Sonali Kumari",
    "email": "sonali@skillsync.edu",
    "role": "student"
  },
  "profile": { ... }
}
```

### 2. Login User
- **Method**: `POST`
- **Path**: `/api/auth/login`
- **Access**: Public
- **Evaluates 5 CFG Decision Branches**:
  1. `!user` -> `401 Unauthorized`
  2. `isLocked || failedLoginAttempts >= 5` -> `423 Locked`
  3. `!isVerified` -> `403 Forbidden`
  4. `isSuspended` -> `403 Forbidden`
  5. `!isMatch` -> `401 Unauthorized` (increments failed counter)
  6. Success -> `200 OK` (resets counter, returns JWT)

### 3. Get Current User (`/api/auth/me`)
- **Method**: `GET`
- **Header**: `Authorization: Bearer <token>`
- **Response `200 OK`**: `{ success: true, user: { ... }, profile: { ... } }`

---

## Student Profile Endpoints (`/api/profiles`)

### 1. Explore Students (`GET /api/profiles`)
- **Query Params**: `q`, `college`, `skill`, `mode`, `minRating`, `page`, `limit`
- **Response `200 OK`**: Array of student profiles with user details and ratings.

### 2. Get / Update Profile (`GET / PUT /api/profiles/me`)
- **Access**: Private (Student)
- **Body**: `{ headline, bio, avatar, teachSkills, learnSkills, interests, availability, preferredMode }`

### 3. Add Teach Skill (`POST /api/profiles/skills/teach`)
- **Body**: `{ "skillName": "Python", "category": "Programming & Tech", "proficiencyLevel": 5, "description": "..." }`
- **Boundary Validation**: `proficiencyLevel` between 1 and 5 (returns 422 if invalid).

### 4. Add Learn Skill (`POST /api/profiles/skills/learn`)
- **Body**: `{ "skillName": "UI/UX Design", "targetProficiency": 4, "priority": "high" }`

---

## AI Recommendation Endpoints (`/api/recommendations`)

### 1. Get Bilateral Recommendations (`GET /api/recommendations`)
- **Access**: Private
- **Query Params**: `minScore` (e.g. `70`), `skill`
- **Response `200 OK`**:
```json
{
  "success": true,
  "count": 5,
  "recommendations": [
    {
      "candidateProfile": { ... },
      "compatibilityScore": 96,
      "matchType": "Direct Reciprocal Match",
      "matchingSkills": {
        "teachToLearn": "UI/UX Design",
        "learnToTeach": "Python"
      },
      "reasons": [
        "Perfect Reciprocal Match: They teach UI/UX Design which you want to learn, and they want to learn Python which you teach!",
        "Proficiency Match: Teacher has level 5/5 proficiency, meeting your target of 4/5.",
        "Schedule Match: Overlapping availability during study sessions."
      ]
    }
  ]
}
```

---

## Exchange Request Endpoints (`/api/requests`)

### 1. Send Request (`POST /api/requests`)
- **Body**:
```json
{
  "receiverId": "67...",
  "offeredSkill": "Python",
  "requestedSkill": "UI/UX Design",
  "initialMessage": "Let's exchange skills this weekend!",
  "proposedSchedule": "Weekends (2 hours)",
  "learningMode": "online"
}
```
- **Validation**: Cannot send request to oneself; prevents duplicate pending requests.

### 2. Update Status (`PUT /api/requests/:id/status`)
- **Body**: `{ "status": "accepted" | "rejected" | "completed" | "cancelled" }`
- **Side effects on `accepted`**:
  - Automatically initializes `Conversation` for real-time Socket.IO chat.
  - Automatically provisions `LearningProgress` roadmaps for both students.
  - Emits real-time notification to sender.
- **Side effects on `completed`**:
  - Increments completed exchange count on both student profiles.
  - Unlocks verified 1-5 star review submission.

---

## Real-Time Chat Endpoints (`/api/chat`)

- `GET /api/chat/conversations`: Returns list of conversations for current user.
- `GET /api/chat/conversations/:id/messages`: Returns chat history and marks unread messages as read.
- `POST /api/chat/conversations/:id/messages`: Restricts messaging strictly to accepted/completed exchange partners. Emits `new_message` to room `conversation_:id`.

---

## Reviews & Feedback Endpoints (`/api/reviews`)

- `POST /api/reviews`:
  - Enforces review only for `status: completed` exchanges.
  - Enforces 1-5 star boundary check.
  - Recalculates average rating and total reviews on reviewee profile.
- `GET /api/reviews/user/:userId`: Public list of peer reviews for a student.

---

## Learning Progress Endpoints (`/api/progress`)

- `GET /api/progress`: Roadmaps where current user is student or mentor.
- `POST /api/progress/:id/milestones`: Add custom milestone.
- `PUT /api/progress/:id/milestones/:milestoneId`: Check/uncheck milestone (auto-updates progress %).
- `POST /api/progress/:id/notes`: Post shared study notes.

---

## Admin Endpoints (`/api/admin`)

- `GET /api/admin/stats`: Aggregate platform metrics (users, exchanges, messages, reviews, popular skills).
- `GET /api/admin/users`: Search, filter, and inspect student accounts.
- `PUT /api/admin/users/:id/suspend`: Toggle student suspension / reactivation.
- `GET /api/admin/reports`: Safety and incident moderation queue.
- `PUT /api/admin/reports/:id`: Update report status (`resolved` / `dismissed`).
