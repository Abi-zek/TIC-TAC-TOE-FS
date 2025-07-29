const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/User");

const app = express();
app.use(cors());
app.use(express.json());

const MONGO_URI = "mongodb+srv://ABIZEK:UUQsWC7aIBl0SuWq@cluster0.tanq7ca.mongodb.net/tictactoe?retryWrites=true&w=majority";
mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

let board = Array(9).fill(null);
let turn = "X";
let winner = null;
let winningTiles = [];
let sessions = {}; // sessionId → username

function resetGame() {
  board = Array(9).fill(null);
  turn = "X";
  winner = null;
  winningTiles = [];
}

// Login or create user
app.post("/api/login", async (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ error: "Username required" });

  let currentUsername = null;
  let user = await User.findOne({ username });
const isNewUser = !user;

if (isNewUser) {
  user = new User({ username });
  await user.save();
}

// Reset board for every new login
if (username !== currentUsername) {
  resetGame();
  currentUsername = username;
}


  const sessionId = `${username}-${Date.now()}`;
  sessions[sessionId] = username;

  res.json({ sessionId, username });
});

app.get("/api/state", (req, res) => {
  res.json({ board, turn, winner, winningTiles });
});

app.post("/api/move", async (req, res) => {
  const { index, sessionId } = req.body;

  const username = sessions[sessionId];
  if (!username) return res.status(403).json({ error: "Invalid session" });

  if (board[index] || winner) {
    return res.status(400).json({ error: "Invalid move" });
  }

  board[index] = turn;

  const result = checkWinner(board);
 const user = await User.findOne({ username });

if (result) {
  winner = result.winner;
  winningTiles = result.tiles;

  user.games += 1;
  user.wins += 1;
  await user.save();

} else if (board.every(cell => cell !== null)) {
  winner = "Draw";

  user.games += 1;
  await user.save();
}
 else {
    turn = turn === "X" ? "O" : "X";
  }

  res.json({ board, turn, winner, winningTiles });
});

app.post("/api/reset", (req, res) => {
  resetGame();
  res.json({ board, turn, winner, winningTiles });
});

app.post("/api/logout", (req, res) => {
  const { sessionId } = req.body;
  if (sessionId && sessions[sessionId]) {
    delete sessions[sessionId];
  }
  res.json({ message: "Logged out successfully" });
});


app.get("/api/scoreboard", async (req, res) => {
  const users = await User.find({}, { _id: 0, __v: 0 });
  res.json(Object.fromEntries(users.map(u => [u.username, { games: u.games, wins: u.wins }])));
});

function checkWinner(b) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];
  for (let [a, b1, c] of lines) {
    if (b[a] && b[a] === b[b1] && b[a] === b[c]) {
      return { winner: b[a], tiles: [a, b1, c] };
    }
  }
  return null;
}

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


