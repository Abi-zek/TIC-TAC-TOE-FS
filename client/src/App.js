import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [username, setUsername] = useState("");
  const [tempUsername, setTempUsername] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [board, setBoard] = useState(Array(9).fill(null));
  const [turn, setTurn] = useState("X");
  const [winner, setWinner] = useState(null);
  const [winningTiles, setWinningTiles] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [players, setPlayers] = useState([]);
  const [scores, setScores] = useState({});

  useEffect(() => {
    if (sessionId) {
      fetchState();
      fetchScoreboard();
    }
  }, [sessionId]);

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const handleLogin = async () => {
    if (!tempUsername.trim()) return;

    const res = await axios.post("http://localhost:5000/api/login", {
      username: tempUsername,
    });

    setSessionId(res.data.sessionId);
    setUsername(res.data.username);
    setTempUsername(""); // optional reset
  };

  const logout = async () => {
    await axios.post("http://localhost:5000/api/logout", { sessionId });
    setSessionId("");
    setUsername("");
  };

  const fetchState = async () => {
    const res = await axios.get("http://localhost:5000/api/state");
    setBoard(res.data.board);
    setTurn(res.data.turn);
    setWinner(res.data.winner);
    setWinningTiles(res.data.winningTiles);
    setPlayers(res.data.players);
  };

  const fetchScoreboard = async () => {
    const res = await axios.get("http://localhost:5000/api/scoreboard");
    setScores(res.data);
  };

  const makeMove = async (index) => {
    if (winner || board[index]) return;
    try {
      await axios.post("http://localhost:5000/api/move", { index, sessionId });
      fetchState();
      fetchScoreboard();
    } catch (err) {
      alert(err.response?.data?.error || "Invalid move");
    }
  };

  const resetGame = async () => {
    await axios.post("http://localhost:5000/api/reset");
    fetchState();
  };

  const toggleTheme = () => setDarkMode(!darkMode);

  const renderSquare = (i) => (
    <button
      key={i}
      className={`square ${winningTiles.includes(i) ? "highlight" : ""}`}
      onClick={() => makeMove(i)}
    >
      {board[i]}
    </button>
  );

  if (!sessionId) {
    return (
      <div className="login-container">
        <div className="login-box">
          <h2>Login to Play</h2>
          <input
            type="text"
            value={tempUsername}
            onChange={(e) => setTempUsername(e.target.value)}
            placeholder="Enter username"
          />
          <button onClick={handleLogin}>Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="game">
      <h1>Tic Tac Toe</h1>
      <button onClick={toggleTheme}>
        {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
      </button>
      <p>Logged in as: <strong>{username}</strong></p>
      <button onClick={logout}>🚪 Logout</button>

      <div className="board">
        {[0, 1, 2].map((row) => (
          <div className="row" key={row}>
            {renderSquare(row * 3)}
            {renderSquare(row * 3 + 1)}
            {renderSquare(row * 3 + 2)}
          </div>
        ))}
      </div>

      {winner ? (
        <p className="winner">
          {winner === "Draw" ? "It's a Draw!" : `Winner: ${winner}`}
        </p>
      ) : (
        <p>Current Turn: {turn}</p>
      )}

      <button onClick={resetGame}>Reset Game</button>

      <h2>Scoreboard</h2>
      <table style={{ margin: "auto" }}>
        <thead>
          <tr>
            <th>User</th>
            <th>Games</th>
            <th>Wins</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(scores).map(([user, data]) => (
            <tr key={user}>
              <td>{user}</td>
              <td>{data.games}</td>
              <td>{data.wins}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
