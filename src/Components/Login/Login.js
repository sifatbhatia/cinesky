import React, { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post("https://weather-app-backend-4a2p.onrender.com/api/v1/auth/login", {
        email,
        password,
      });

      // Store the token in localStorage
      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem("userName", response.data.user.displayName);
      
      // Redirect to home page
      navigate("/home");
    } catch (error) {
      if (error.response?.data?.code === 'auth/user-not-found') {
        setError("No account found with this email");
      } else if (error.response?.data?.code === 'auth/wrong-password') {
        setError("Incorrect password");
      } else {
        setError("Failed to log in. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login weather container">
      <h1 className="title is-1">Login</h1>

      {error && (
        <div className="notification is-danger">
          {error}
        </div>
      )}

      <form onSubmit={handleLogin}>
        <div className="field">
          <label className="label">Email</label>
          <div className="control">
            <input
              className="input"
              type="email"
              name="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="field">
          <label className="label">Password</label>
          <div className="control">
            <input
              className="input"
              type="password"
              name="password"
              required
              minLength="6"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button 
              className={`button is-link ${loading ? 'is-loading' : ''}`}
              type="submit"
              disabled={loading}
            >
              Login
            </button>
          </div>
          <div className="control">
            <button
              className="button is-link is-light"
              type="button"
              onClick={() => navigate("/register")}
            >
              Register
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Login;
