import { useState } from "react";

const API_URL = "https://behealth-hospital-1.onrender.com";

function AdminLogin({
  setIsLoggedIn,
  setShowAdminLogin,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleAdminLogin(e) {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter admin email and password");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/admin/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
        }
      );

      const data = await response.json();

      console.log(
        "Admin login status:",
        response.status
      );

      console.log(
        "Admin login response:",
        data
      );

      if (!response.ok) {
        alert(
          data.message ||
            "Admin login failed"
        );
        return;
      }

      if (!data.token) {
        alert(
          "Admin login successful, but token was not received."
        );
        return;
      }

      // Save JWT token
      localStorage.setItem(
        "token",
        data.token
      );

      // Save admin user
      if (data.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );
      }

      localStorage.setItem(
        "isAdmin",
        "true"
      );

      alert("Admin login successful");

      // Tell App.jsx that login succeeded
      setIsLoggedIn(true);

    } catch (error) {
      console.error(
        "Admin login error:",
        error
      );

      alert(
        "Cannot connect to backend"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f4f8fc",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          padding: "40px",
          background: "#ffffff",
          borderRadius: "15px",
          boxShadow:
            "0 10px 30px rgba(0, 0, 0, 0.12)",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            color: "#1677ff",
            marginBottom: "10px",
          }}
        >
          BeHealth Hospital
        </h1>

        <h2
          style={{
            textAlign: "center",
            marginBottom: "30px",
            color: "#333",
          }}
        >
          Admin Login
        </h2>

        <form
          onSubmit={handleAdminLogin}
        >
          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            autoComplete="email"
            required
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "15px",
              marginBottom: "20px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              fontSize: "18px",
            }}
          />

          <input
            type="password"
            placeholder="Admin Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            autoComplete="current-password"
            required
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "15px",
              marginBottom: "20px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              fontSize: "18px",
            }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "15px",
              background: "#222",
              color: "#ffffff",
              border: "none",
              borderRadius: "8px",
              fontSize: "20px",
              cursor: loading
                ? "not-allowed"
                : "pointer",
            }}
          >
            {loading
              ? "Logging in..."
              : "Admin Login"}
          </button>
        </form>

        <button
          type="button"
          onClick={() =>
            setShowAdminLogin(false)
          }
          style={{
            width: "100%",
            marginTop: "15px",
            padding: "12px",
            background: "transparent",
            color: "#1677ff",
            border: "1px solid #1677ff",
            borderRadius: "8px",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          Back to User Login
        </button>
      </div>
    </div>
  );
}

export default AdminLogin;