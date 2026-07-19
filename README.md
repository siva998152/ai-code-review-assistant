# 🚀 AI Code Review Assistant

An AI-powered full-stack web application that analyzes **JavaScript** code using **ESLint** for static analysis and **Google Gemini AI** for intelligent code review.

The application helps developers identify code issues, understand warnings, receive AI-powered improvement suggestions, generate optimized code, manage previous reviews, visualize review statistics, and export detailed review reports.

---

## 🌐 Live Demo

**Frontend:**
https://ai-code-review-assistant-beige-sigma.vercel.app/

**Backend API:**
https://ai-code-review-assistant-yyly.onrender.com/

**Health Check:**
https://ai-code-review-assistant-yyly.onrender.com/api/health

---

# ✨ Key Highlights

* 🤖 AI-powered JavaScript code review
* 🔍 ESLint-based static code analysis
* 🔐 Secure JWT Authentication
* 👤 User Profile Management
* 📂 JavaScript File Upload Support
* 📊 Dashboard Analytics
* 📝 AI-generated Code Explanation
* 💡 Best Practice Recommendations
* ⚡ Performance & Security Suggestions
* 📄 PDF Report Generation
* 📋 Review History Management
* 🗄 PostgreSQL Database Integration
* ☁️ Fully Deployed Application

---

# 📖 Project Overview

Writing clean, secure, and maintainable code is one of the most important aspects of software development. However, manual code reviews can be time-consuming and developers may unintentionally overlook bugs, security risks, or performance issues.

The **AI Code Review Assistant** automates this process by combining **ESLint static analysis** with **Google Gemini AI** to provide instant, detailed, and easy-to-understand code reviews.

The system not only identifies issues but also explains why they occur, recommends best practices, generates improved code, and stores review history for future reference.

---

# ✨ Features

## 🔐 Authentication & Account Management

* User Registration
* Secure Login
* JWT Authentication
* Protected Routes
* Forgot Password
* Reset Password
* View Profile
* Update Profile
* Change Password
* Logout

---

## 💻 JavaScript Code Review

* Integrated Code Editor
* Paste JavaScript Code
* Upload `.js` Files
* ESLint Static Analysis
* Error Detection
* Warning Detection
* Rule Information
* Issue Locations
* AI Code Explanation
* AI Suggestions
* Refactored JavaScript Code
* Overall Code Quality Review

---

## 📂 Review Management

* Automatically Save Reviews
* View Previous Reviews
* Open Previous Reviews
* Delete Reviews
* User-specific Review History

---

## 📊 Dashboard Analytics

The dashboard displays:

* Total Reviews
* Total Findings
* Total Errors
* Total Warnings

Statistics update automatically whenever reviews are created or deleted.

---

## 📄 Export Features

* Copy Improved Code
* Download Improved Code as `.js`
* Generate PDF Review Reports

Each PDF includes:

* Static Analysis Summary
* Static Analysis Findings
* AI Overview
* AI Issues & Explanations
* AI Suggestions
* Improved Code
* Generation Timestamp
* Multi-page Support
* Page Numbers

---

# 🛠 Tech Stack

## Frontend

* React
* Vite
* JavaScript
* Tailwind CSS
* Axios
* React Router
* React Hot Toast
* Lucide React
* jsPDF

---

## Backend

* Node.js
* Express.js
* PostgreSQL
* JWT Authentication
* bcrypt
* ESLint
* Google Gemini API

---

# 🏗 Application Architecture

```text
                   User
                     │
                     ▼
             React Frontend
                     │
             HTTP / REST API
                     │
                     ▼
             Express Backend
             ┌────────┴────────┐
             ▼                 ▼
      PostgreSQL DB     Review Services
                               │
                 ┌─────────────┴─────────────┐
                 ▼                           ▼
         ESLint Static Analysis     Gemini AI Review
                               │
                               ▼
                     Review Saved in Database
                               │
                               ▼
                  Results Displayed to User
```

---

# 📁 Project Structure

```text
ai-code-review-assistant/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── styles/
│   │   └── utils/
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

---

# ⚙️ Getting Started

## Prerequisites

Install:

* Node.js
* npm
* PostgreSQL
* Git

You also need a **Google Gemini API Key**.

---

## Clone Repository

```bash
git clone https://github.com/siva998152/ai-code-review-assistant.git

cd ai-code-review-assistant
```

---

## Backend Setup

```bash
cd backend

npm install
```

Create a `.env` file.

```env
PORT=5000

DB_HOST=localhost
DB_PORT=5432
DB_USER=your_postgresql_username
DB_PASSWORD=your_postgresql_password
DB_NAME=your_database_name

JWT_SECRET=your_secure_jwt_secret

GEMINI_API_KEY=your_gemini_api_key
```

Never commit your `.env` file.

Start the backend:

```bash
npm run dev
```

Backend runs on:

```
http://localhost:5000
```

---

## Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Open the URL displayed by Vite.

---

# 🔗 API Overview

## Authentication

| Method | Endpoint                  |
| ------ | ------------------------- |
| POST   | /api/auth/register        |
| POST   | /api/auth/login           |
| POST   | /api/auth/forgot-password |
| POST   | /api/auth/reset-password  |
| GET    | /api/auth/profile         |
| PUT    | /api/auth/profile         |
| PUT    | /api/auth/change-password |

---

## Reviews

| Method | Endpoint             |
| ------ | -------------------- |
| POST   | /api/reviews/analyze |
| GET    | /api/reviews         |
| GET    | /api/reviews/stats   |
| GET    | /api/reviews/:id     |
| DELETE | /api/reviews/:id     |

Protected endpoints require:

```
Authorization: Bearer <token>
```

---

# 🔄 Review Workflow

```text
User submits JavaScript code
            │
            ▼
JWT Authentication
            │
            ▼
ESLint Static Analysis
            │
            ▼
Gemini AI Review
            │
            ▼
Review Saved in PostgreSQL
            │
            ▼
Results Displayed
            │
      ┌─────┴─────┐
      ▼           ▼
History      Export Results
             PDF / JS / Copy
```

---

# 🔒 Security

* Password Hashing using bcrypt
* JWT Authentication
* Protected API Routes
* User-specific Database Queries
* Environment Variables
* Server-side Validation
* Password Verification before Change Password
* Secure API Key Management

---

# 📚 What I Learned

Through this project, I strengthened my understanding of:

* React.js
* Node.js
* Express.js
* PostgreSQL
* REST APIs
* JWT Authentication
* ESLint Integration
* Google Gemini AI Integration
* PDF Generation
* Full-Stack Application Development
* Deployment using Vercel, Render, and Neon

---

# 🚧 Known Limitations

* Supports **JavaScript only**
* AI reviews depend on Google Gemini API availability
* API quota limits may temporarily affect review generation
* Production email delivery for password reset is not yet implemented
* Frontend environment configuration should be migrated completely to environment variables for production

---

# 🚀 Future Enhancements

* Multi-language Support
* GitHub Repository Integration
* Email-based Password Reset
* OAuth Authentication
* Configurable ESLint Rules
* Dashboard Charts
* Search & Filter Reviews
* Review Pagination
* AI Retry & Provider Fallback
* Automated Testing
* Docker Support
* CI/CD Pipeline

---

# 📸 Screenshots

> **Add screenshots here before final submission.**

Suggested screenshots:

* Login Page
* Register Page
* Dashboard
* Static Analysis Results
* AI Review Results
* Review History
* Profile Page
* PDF Report

---

# 👨‍💻 Author

**V. Siva Mallesh**

Computer Science & Engineering Student

Passionate about **Full-Stack Development, Cloud Computing, and Artificial Intelligence**.

**GitHub:**
https://github.com/siva998152

**LinkedIn:**
(Add your LinkedIn Profile)

---

# 📌 Project Status

✅ Authentication Completed

✅ Profile Management Completed

✅ AI Review Completed

✅ ESLint Static Analysis Completed

✅ Dashboard Analytics Completed

✅ Review History Completed

✅ PDF Export Completed

✅ Deployment Completed

🚀 Future enhancements are planned for upcoming versions.

---

# ☁️ Deployment

| Service     | Platform        |
| ----------- | --------------- |
| Frontend    | Vercel          |
| Backend     | Render          |
| Database    | Neon PostgreSQL |
| AI Provider | Google Gemini   |

---

# 📄 License

This project is currently provided for educational and portfolio purposes.

---

⭐ **If you found this project helpful or interesting, consider giving it a star on GitHub!**
