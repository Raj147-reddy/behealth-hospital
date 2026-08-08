import { useState } from "react";
import "./Register.css";

function Register({ setShowRegister }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleRegister() {
    if (!name || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Registration successful");

        setName("");
        setEmail("");
        setPassword("");

        setShowRegister(false);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Register error:", error);
      alert("Cannot connect to backend");
    }
  }

  return (
    <div className="register-container">
      <div className="register-box">
        <h1>🏥 BeHealth Hospital</h1>

        <h2>Create Account</h2>

        <input
          type="text"
          placeholder="Enter Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

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

        <button onClick={handleRegister}>
          Register
        </button>

        <p>
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => setShowRegister(false)}
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}

export default Register;