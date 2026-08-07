import { useState } from "react";
import "./Login.css";

function Login({ setIsLoggedIn }) {
const [email, setEmail] = useState(" ");
 const [password, setPassword] = useState(" ");

  function handleLogin() {
    if (
      email === "rajasekharreddykoppula1@gmail.com" &&
      password === "123456"
    ) {
      setIsLoggedIn(true);
    } else {
      alert("❌ Invalid Email or Password");
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">
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
      </div>
    </div>
  );
}

export default Login;