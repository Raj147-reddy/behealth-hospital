import { useState } from "react";
import "./Login.css";

const API_URL = "https://behealth-hospital-1.onrender.com";

function Login({
  setIsLoggedIn,
  setShowRegister,
  setShowAdminLogin,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      console.log("Login button clicked");

      const response = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = await response.json();

      console.log("Login status:", response.status);
      console.log("Login response:", data);

      if (!response.ok) {
        alert(data.message || "Login failed");
        return;
      }

      if (!data.token) {
        alert("Login successful, but token was not received.");
        return;
      }

      // Save JWT token
      localStorage.setItem("token", data.token);

      // Save user information
      if (data.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

        localStorage.setItem(
          "isAdmin",
          data.user.is_admin === true ? "true" : "false"
        );
      }

      console.log("Login successful");

      alert("Login successful");

      // Update React login state
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Login error:", error);
      alert("Cannot connect to backend");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-container">
      <div className="login-box">

        {/* ============================= */}
        {/* HOSPITAL TITLE */}
        {/* ============================= */}

        <h1>BeHealth Hospital</h1>

        <h2>Welcome Back</h2>

        {/* ============================= */}
        {/* USER LOGIN FORM */}
        {/* ============================= */}

        <form onSubmit={handleLogin}>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />

          <button
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        {/* ============================= */}
        {/* REGISTER */}
        {/* ============================= */}

        <p>
          Don't have an account?{" "}

          <button
            type="button"
            onClick={() => setShowRegister(true)}
            style={{
              background: "none",
              border: "none",
              color: "#1677ff",
              cursor: "pointer",
              fontSize: "16px",
              padding: 0,
            }}
          >
            Register
          </button>
        </p>

        {/* ============================= */}
        {/* ADMIN LOGIN */}
        {/* ============================= */}

        <div
          style={{
            marginTop: "25px",
            paddingTop: "20px",
            borderTop: "1px solid #ddd",
            textAlign: "center",
          }}
        >
          <p
            style={{
              marginBottom: "10px",
              color: "#555",
            }}
          >
            Are you an administrator?
          </p>

          <button
            type="button"
            onClick={() => setShowAdminLogin(true)}
            style={{
              width: "100%",
              padding: "12px",
              background: "#222",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            Admin Login
          </button>
        </div>

      </div>
    </div>
  );
}

export default Login;