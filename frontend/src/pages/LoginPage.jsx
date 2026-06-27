import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axiosConfig";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useAuth();

  if (currentUser) {
    navigate("/");
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/auth/login", { email, password });
      if (response.data.success) {
        setCurrentUser(response.data.user);
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="form-container">
        <h2>Login</h2>
        <form onSubmit={handleSubmit} className="standard-form">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <button type="submit" className="btn-primary">
            Login
          </button>
        </form>
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
}

export default LoginPage;
