# 🎮 Tic Tac Toe Fullstack Web App

A modern fullstack Tic Tac Toe game built with **React**, **Node.js**, and **MongoDB**, featuring:

- 🔐 User authentication
- 🧠 Game state tracking
- 🏆 Persistent user scores
- 🌗 Dark/light theme toggle
- ✨ Responsive and minimal UI

---

## 🚀 Live Demo

> Coming soon — deploy it on **Vercel** or **Render**!

---

## 📦 Tech Stack

| Frontend       | Backend     | Database   |
|----------------|-------------|------------|
| React (Vite/Cra) | Express.js  | MongoDB Atlas |
| Axios          | Node.js     | Mongoose   |

---

## 🧰 Features

- ✅ Play as both X and O
- 🔒 Login/logout using usernames
- 🧮 Scoreboard tracking wins & games
- 🌙 Dark/light theme switch
- 🟡 Highlight winning tiles
- 📁 Git-managed with branching workflow

---

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/tictactoe-fullstack.git
cd tictactoe-fullstack

2. Install Dependencies
Backend:
bash
Copy
Edit
cd server
npm install
Frontend:
bash
Copy
Edit
cd ../client
npm install
3. Environment Setup
In the server/ folder, create a .env file:

env
Copy
Edit
MONGO_URI=your_mongodb_connection_string
4. Run the App
Start backend:

bash
Copy
Edit
cd server
npm start
Start frontend:

bash
Copy
Edit
cd ../client
npm start
🧠 Folder Structure
bash
Copy
Edit
tictactoe-fullstack/
├── client/         # React frontend
├── server/         # Express backend
├── .gitignore
├── README.md
