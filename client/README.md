
# 🛍️ ShopLocal – Generative AI-Powered E-commerce Platform  

ShopLocal is a modern full-stack e-commerce platform that connects local buyers and sellers with intelligent AI-driven recommendations and product insights.

---

## 🚀 Overview

The platform enhances traditional e-commerce by integrating AI features such as AI chatbot and personalized recommendations based on user behavior.

---

## 🖥️ Frontend (UI)

### ✨ Features
- 🛒 Product listing and management
- 🔎 Advanced search and filtering
- 🤖 AI-powered recommendations and chatbot
- 📱 Responsive and modern UI
- ⚡ Smooth and fast user experience


### 🛠 Tech Stack
- React (Vite)
- Tailwind CSS
- JavaScript

---

## ⚙️ Backend

### ✨ Features
- 🔐 User authentication(JWT) and authorization
- 📦 Product, category and brand management
- 📊 Analytics dashboard (admin/brands)
- 💬 User interaction tracking (views, clicks, purchases)
- 🔗 API for frontend communication



### 🛠 Tech Stack
- Django
- Django REST Framework


### Database
- PostgreSQL

### AI/ML
- OpenAI API / HuggingFace models
- LangChain (RAG-based recommendations)

---

## 🤖 AI Features

### 🔹 Tag Generation
- Automatically generates product tags from descriptions using LLM models

### 🔹 Recommendation System
- Personalized product recommendations based on:
  - User interactions (views, clicks, purchases)
  - Content similarity
  - Retrieval-based ranking

### 🛠 AI Stack
- OpenAI API / HuggingFace models
- LangChain

---

## 🔗 System Flow

User → Frontend → Backend → AI Engine → Recommendations

---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repository
```bash
git clone https://github.com/yourusername/shoplocal.git
cd shoplocal

### 2️⃣ Run Backend
cd backend
create virtual environment (venv)
pip install -r requirements.txt
python manage.py runserver

### 3️⃣ Run Frontend
cd frontend
npm install
npm run dev

🔐 Environment Variables
OPENAI_API_KEY=your_key
DATABASE_URL=your_db_url
SECRET_KEY=django_secret