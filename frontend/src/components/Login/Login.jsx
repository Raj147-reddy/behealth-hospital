import { useState } from "react";
import "./Login.css";

const API_URL = "https://behealth-hospital-1.onrender.com";

function Login({ setIsLoggedIn, setShowRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e) {
    e.preventDefault();

    if (!email || !password) {
      alert("? Please enter email and password");
      return;
    }

    try {
      console.log("Login button clicked");

      const response = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password,
        }),
      });

      const data = await response.json();

      console.log("Login response:", data);

      if (!response.ok) {
        alert(data.message || "? Login failed");
        return;
      }

      if (!data.token) {
        alert("? Login failed: no token received");
        return;
      }

      // Clear old authentication data
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Save new authentication data
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      console.log("Login successful");
      console.log("Token saved:", !!localStorage.getItem("token"));

      alert("? Login successful");

      setIsLoggedIn(true);
    } catch (error) {
      console.error("Login error:", error);
      alert("? Cannot connect to backend");
    }
  }

  return (
    <div className="login-container">
      <div className="login-box">

        <h1>BeHealth Hospital</h1>

        <h2>Welcome Back</h2>

        <form onSubmit={handleLogin}>

          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">
            Login
          </button>

        </form>

        <p>
          Don't have an account?{" "}

          <button
            type="button"
            onClick={() => setShowRegister(true)}
          >
            Register
          </button>
        </p>

      </div>
    </div>
  );
}

export default Login;


