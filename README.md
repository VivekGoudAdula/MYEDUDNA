# 🧬 MyEduDNA: AI-Powered Personalized Learning Path

![MyEduDNA Banner](https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6)

![App Screenshot](frontend/public/image.png)

MyEduDNA is a revolutionary learning platform that uses AI to analyze a student's "Educational DNA"—their unique learning style, strengths, and weaknesses—to provide highly personalized career roadmaps, interactive courses, and expert mentorship.

## 🚀 Key Features

- **🧬 DNA Assessment**: A deep-dive quiz that identifies your learning style (Visual, Kinesthetic, etc.) and academic level.
- **🗺️ Career Roadmaps**: AI-generated, multi-phase roadmaps tailored to your specific goals and learning profile.
- **🎓 Smart Course Player**: Dynamic learning modules including reading material, video content, and integrated quizzes.
- **🔬 Virtual Lab**: Interactive 3D simulations for Physics and Engineering (Optics, Projectile Motion, Circuits, Logic Gates).
- **🤝 Mentor Network**: Smart matching system that connects students with mentors based on skill compatibility and DNA profiles.
- **🤖 AI Coach**: Personalized insights and actionable suggestions to improve your learning efficiency.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS + Custom Design System
- **Animations**: Motion (Framer Motion)
- **3D Graphics**: Three.js / React Three Fiber
- **Icons**: Lucide React

### Backend
- **Framework**: FastAPI (Python 3.11)
- **Database**: MongoDB (Motor Async Driver)
- **AI/LLM**: Groq API (Llama 3.3 models)
- **Auth**: JWT (JSON Web Tokens) with passlib/bcrypt

---

## 💻 Local Setup

### Prerequisites
- Node.js (v18+)
- Python (3.11+)
- MongoDB (Running locally or on Atlas)

### 1. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```
Create a `.env` file in the `backend` folder:
```env
MONGODB_URI=your_mongodb_uri
MONGODB_DB_NAME=myedudna
JWT_SECRET_KEY=your_secret
GROQ_API_KEY=your_groq_key
```
Run the server:
```bash
uvicorn main:app --reload
```

### 2. Frontend Setup
```bash
cd frontend
npm install
```
Create a `.env` file in the `frontend` folder:
```env
VITE_API_BASE_URL=http://localhost:8000
```
Run the app:
```bash
npm run dev
```

---

## 🌐 Deployment

- **Frontend**: Deployed on [Vercel](https://myedudna.vercel.app/)
- **Backend**: Deployed on [Render](https://myedudna.onrender.com/)

---

## 📝 License
This project is licensed under the Apache-2.0 License.

---
<div align="center">
  Built with ❤️ by <b>Vivek Goud Adula</b>
</div>
