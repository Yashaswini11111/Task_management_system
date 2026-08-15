## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, React Router DOM, Axios, Lucide Icons, Custom CSS Design Tokens
- **Backend**: Node.js, Express.js, Cors, Dotenv
- **Database**: MongoDB with Mongoose (Prepared for Stage 2)
- **Authentication**: JWT & Bcryptjs (Prepared for Stage 3)

---

## 📁 Repository Structure

```
internship_project/
├── backend/                  # Express.js REST API Server
│   ├── src/
│   │   ├── routes/           # API Route Handlers (Health, Auth, Tasks)
│   │   └── app.js            # Express Application Configuration
│   ├── .env                  # Environment Variables (Ignored in Git)
│   ├── .env.example          # Environment Variables Template
│   ├── package.json          # Backend Dependencies & Scripts
│   └── server.js             # Application Entry Point
├── frontend/                 # React.js + Vite Application
│   ├── public/               # Static Assets
│   ├── src/                  # Components, Pages, Assets, Styles
│   │   ├── components/       # Reusable UI Components
│   │   ├── App.jsx           # Root Application View & Stage Monitor
│   │   ├── index.css         # Modern Design System & CSS Tokens
│   │   └── main.jsx          # React Entry Point
│   ├── index.html            # HTML Template
│   ├── package.json          # Frontend Dependencies & Scripts
│   └── vite.config.js        # Vite Configuration with API Proxy
├── README.md                 # Project Documentation
└── .gitignore                # Global Git Ignore File
```

---

## 🚀 How to Run the Application

### 1. Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### 2. Backend Setup
```bash
cd backend
npm install
npm run dev
# Server will start on http://localhost:5000
# Health check available at http://localhost:5000/api/health
```

### 3. Frontend Setup
In a new terminal window:
```bash
cd frontend
npm install
npm run dev
# Frontend will start on http://localhost:5173 (or default Vite port)
```

---

## 🌐 Health Verification API
- **Endpoint**: `GET /api/health`
- **Response**:
```json
{
  "status": "success",
  "message": "Task Management System API is running smoothly",
  "stage": "Stage 1 - Project Setup",
  "timestamp": "2026-08-15T11:20:00.000Z",
  "environment": "development"
}
```
