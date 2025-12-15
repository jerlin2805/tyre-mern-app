import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from '../services/api';

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();


const handleLogin = async () => {
  try {
    const res = await api.post('/auth/login', { email: username, password });
    const data = res.data || {};
    if (data.token) localStorage.setItem('token', data.token);
    localStorage.setItem("isLoggedIn", "true");
    navigate("/add-vehicle");
  } catch (err) {
    console.error(err);
    setError("Invalid username or password");
  }
};


  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Login</h2>

        <input
          type="text"
          placeholder="Email (use admin@example.com)"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />


        <button 
          style={styles.button} 
          onClick={handleLogin}
          type="button"
        >
          Login
        </button>

        {error && <p style={styles.error}>{error}</p>}
      </div>
    </div>
  );
}

export default Login;

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f4f4f4",
    padding: "20px",
    fontFamily: "'Poppins', sans-serif",
  },

  card: {
    background: "#ffffff",
    padding: "40px",
    borderRadius: "16px",
    width: "100%",
    maxWidth: "420px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
    textAlign: "center",
  },

  title: {
    marginBottom: "20px",
    color: "#333",
    fontWeight: "600",
  },

  input: {
    width: "100%",
    padding: "12px",
    margin: "12px 0",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "14px",
    outline: "none",
  },

  button: {
    width: "100%",
    padding: "12px",
    marginTop: "10px",
    background: "#f15a24",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
  },

  error: {
    color: "#ff4c4c",
    marginTop: "12px",
    fontSize: "14px",
  },
};
