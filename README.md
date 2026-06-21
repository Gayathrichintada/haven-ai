# 🌱 Haven AI

Haven is a personalized AI companion that remembers users, understands emotions, and provides meaningful conversations through voice, text, and image interactions.

Built with a modern full-stack architecture using React, FastAPI, MongoDB Atlas, and Google Gemini.

---

## ✨ Features

* 🔐 User authentication (Register & Login)
* 🧠 Persistent memory across conversations
* 🎙️ Voice input and voice responses
* 🖼️ Image analysis with AI
* 😊 Mood detection and emotional insights
* 💬 Personalized conversations based on onboarding preferences
* 🎨 Dynamic themes (Midnight, Ocean, Frost, Love)
* 📊 Mood trends and profile insights
* ✏️ Editable user profile
* 📱 Responsive UI for desktop and mobile
* ☁️ Cloud-ready deployment

---

## 🏗️ Tech Stack

### Frontend

* React + Vite
* Tailwind CSS
* React Router
* Framer Motion
* Lucide React

### Backend

* FastAPI
* Python
* Google Gemini API
* MongoDB Atlas
* JWT Authentication

### Database

* MongoDB Atlas

### Deployment

* Frontend: Vercel
* Backend: Render

---

## 📂 Project Structure

```text
haven-ai/
├── backend/
│   ├── app/
│   │   ├── auth.py
│   │   ├── chat.py
│   │   ├── database.py
│   │   ├── insights.py
│   │   ├── main.py
│   │   ├── memory_routes.py
│   │   ├── memory_service.py
│   │   ├── mood_service.py
│   │   ├── profile_routes.py
│   │   ├── profile_service.py
│   │   ├── prompt_builder.py
│   │   └── security.py
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── data/
│   │   ├── pages/
│   │   ├── services/
│   │   └── utils/
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)

```env
MONGODB_URI=your_mongodb_connection_string
GOOGLE_API_KEY=your_google_api_key
JWT_SECRET=your_secret_key
```

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://127.0.0.1:8000
```

### Frontend Production (`frontend/.env.production`)

```env
VITE_API_URL=https://your-backend-url.onrender.com
```

---

## 🚀 Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/Gayathrichintada/haven-ai.git

cd haven-ai
```

### 2. Backend setup

```bash
cd backend

python -m venv venv

# Windows
venv\Scripts\activate

pip install -r requirements.txt

uvicorn app.main:app --reload
```

Backend runs at:

```text
http://127.0.0.1:8000
```

---

### 3. Frontend setup

Open a new terminal:

```bash
cd frontend

npm install

npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```

---

## 🌐 Deployment

### Backend

Deploy to Render using:

* Root Directory: `backend`
* Build Command:

```bash
pip install -r requirements.txt
```

* Start Command:

```bash
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

### Frontend

Deploy to Vercel using:

* Root Directory: `frontend`

Environment variable:

```env
VITE_API_URL=https://your-render-backend-url.onrender.com
```

---

## 🔒 Security

* JWT-based authentication
* Environment variables stored securely
* `.env`, `node_modules`, and `venv` excluded via `.gitignore`
* Passwords stored using hashing

---

## 🛣️ Roadmap

* [ ] Conversation search
* [ ] Export chat history
* [ ] Multi-language support
* [ ] Push notifications
* [ ] AI-generated daily summaries
* [ ] Enhanced analytics dashboard

---

## 👨‍💻 Author

**Gayathri Chintada**

GitHub: https://github.com/Gayathrichintada

---

## ⭐ Support

If you like this project, please consider giving it a star on GitHub.
