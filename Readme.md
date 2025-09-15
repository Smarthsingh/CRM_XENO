XCRM – AI Powered Customer Relationship Manager

🚀 **XCRM** is a full-stack CRM platform with AI-driven campaign messaging, customer segmentation, and analytics.  
Built with **React + Vite (frontend)**, **Node.js + Express (backend)**, **MongoDB (database)**, and **Groq AI API (AI suggestions)**.  
Deployed on **Vercel (frontend)** and **Render (backend)**.

---

## ✨ Features
- 🔑 **Authentication** – Secure login with token-based access.
- 📢 **Campaign Management** – Create, edit, delete, and send campaigns.
- 📊 **Segmentation Analytics** – Analyze customer segments and performance.
- 🧑‍🤝‍🧑 **Audience Management** – Manage and view customers in campaigns.
- 🤖 **AI Suggestions** – Generate personalized marketing messages using **Groq AI**.
- 📈 **Statistics Dashboard** – View sent/failed stats for campaigns.

---

## 🏗️ Architecture

![Architecture]([https://i.imgur.com/example.png](https://drive.google.com/file/d/1KCGXSsMHC7EaIfWcq32S-EFMZ52kpfV3/view?usp=share_link))


---
⚙️ Tech Stack

Frontend: React (Vite), Material UI, React Router

Backend: Node.js, Express.js, MongoDB, Mongoose

AI: Groq API (llama-3.1-8b-instant model)

Deployment: Vercel (frontend), Render (backend)

Other Tools: Swagger API Docs, CORS

---

📂 Folder Structure

XCRM/
│── backend/           # Node.js + Express API
│   ├── server.js
│   ├── routes/
│   ├── models/
│   └── config/
│
│── frontend/          # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   ├── App.jsx
│   │   └── ...
│   └── vite.config.js
│
│── README.md


---

🚀 Local Setup Instructions
1. Clone the repo
git clone https://github.com/Smarthsingh/CRM_XENO.git
cd CRM_XENO

2. Backend Setup
cd backend
npm install


Create a .env file:

MONGO_URI=your_mongodb_connection
PORT=4000
GROQ_API_KEY=your_groq_api_key


Start backend:

npm start

3. Frontend Setup
cd frontend
npm install


Create a .env file:

VITE_API_URL=http://localhost:4000


Start frontend:

npm run dev


Now visit 👉 http://localhost:5173

---

🌐 Deployment

Frontend: Deployed on Vercel

Backend: Deployed on Render

Make sure to set the .env variables in Vercel Dashboard and Render Dashboard.
 
---

⚡ AI Features

Uses Groq AI (LLaMA-3.1-8b-instant) for generating short, creative marketing messages.

Integrated via /api/ai/suggest-message.

---

🛠️ Known Limitations

Free hosting → Backend (Render free tier) may sleep after inactivity.

AI suggestions depend on Groq API quota.

MongoDB connection speed may vary on free cluster.

---

🎥 Demo Video

👉 [Upload to Google Drive or Loom] and share link here.
Video should cover:

Features walkthrough (campaigns, segmentation, audience, AI)

Approach & architecture

Trade-offs (free hosting, API limits)

AI demo in action








