import { useState } from "react";
import "./Login.css";

function Login({ setIsLoggedIn, setShowRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    if (!email || !password) {
      alert("❌ Please enter email and password");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Login successful:", data);

        // Save JWT token in browser
        localStorage.setItem("token", data.token);

        // Save user information
        localStorage.setItem("user", JSON.stringify(data.user));

        alert("✅ Login successful");

        setIsLoggedIn(true);
      } else {
        alert(`❌ ${data.message}`);
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("❌ Cannot connect to backend");
    }
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>🏥 BeHealth Hospital</h1>

        <h2>Welcome Back</h2>

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

        <button onClick={handleLogin}>
          Login
        </button>

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