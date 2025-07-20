# Learning Management System Backend

**Author:** Aman Verma  
**College:** IIIT Bhagalpur  
**LinkedIn:** [https://linkedin.com/in/amanvermaiiit](https://linkedin.com/in/amanvermaiiit)  
**Backend URL:** https://learning-management-system-ub67.onrender.com  
**Video URL:** _Provided Later_

---

## Tech Stack
- Node.js, Express.js
- MongoDB
- JWT, bcrypt

---

## API Endpoints

###  Authentication
- `POST {{base}}/auth/signup` — Sign up (roles: `user` by default, `admin` optional)
- `POST {{base}}/auth/login` — Login using JWT

###  Courses
- `GET {{base}}/courses` — Get basic info (title, description, price); open to all
- `POST {{base}}/courses` — Admin only: Add course
- `GET {{base}}/courses/:id` — Authenticated & enrolled users only: Get course with lessons/quizzes
- `POST {{base}}/courses/:id/enroll` — Enroll user to course

###  Lessons
- `POST {{base}}/lessons` — Admin only: Add lessons to course

###  Quizzes
- `POST {{base}}/quizzes` — Admin only: Add quiz to course (with MCQs, one correct option)
- `POST {{base}}/quizzes/:id/attempt` — Enrolled users can attempt quiz

### Progress
- `POST {{base}}/lesson/:lessonId/complete` — Mark lesson as completed
- `GET {{base}}/course/:courseId` — View user progress (enrolled users only)

---

_Replace `{{base}}` with:_ `https://learning-management-system-ub67.onrender.com`
