import { useState } from "react";

const API_URL = "http://localhost:5000";

function AdminLogin({
  setIsLoggedIn,
  setShowAdminLogin,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleAdminLogin(e) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/admin/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      console.log("ADMIN LOGIN RESPONSE:", data);

      if (!response.ok) {
        setError(
          data.message || "Admin login failed"
        );
        setLoading(false);
        return;
      }

      // Save admin login information
      localStorage.setItem(
        "token",
        data.token
      );

      localStorage.setItem(
        "isAdmin",
        "true"
      );

      localStorage.setItem(
        "user",
        JSON.stringify(
          data.user || {
            email: email,
            is_admin: true,
          }
        )
      );

      console.log(
        "Admin login successful"
      );

      // Tell App that login succeeded
      setIsLoggedIn(true);
      setShowAdminLogin(false);
    } catch (error) {
      console.error(
        "Admin login error:",
        error
      );

      setError(
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
        background: "#f4f7f9",
      }}
    >
      <div
        style={{
          width: "400px",
          padding: "35px",
          background: "white",
          borderRadius: "12px",
          boxShadow:
            "0 4px 20px rgba(0,0,0,0.15)",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            marginBottom: "10px",
          }}
        >
          Admin Login
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#666",
            marginBottom: "25px",
          }}
        >
          BeHealth Hospital
        </p>

        {error && (
          <div
            style={{
              background: "#ffe5e5",
              color: "#c62828",
              padding: "12px",
              borderRadius: "6px",
              marginBottom: "15px",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleAdminLogin}>
          <label>Email</label>

          <input
            type="email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            placeholder="Admin email"
            required
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "6px",
              marginBottom: "18px",
              border: "1px solid #ccc",
              borderRadius: "6px",
              boxSizing: "border-box",
            }}
          />

          <label>Password</label>

          <input
            type="password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            placeholder="Admin password"
            required
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "6px",
              marginBottom: "20px",
              border: "1px solid #ccc",
              borderRadius: "6px",
              boxSizing: "border-box",
            }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "13px",
              background: "#087fba",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            {loading
              ? "Logging in..."
              : "Admin Login"}
          </button>
        </form>

        <button
          onClick={() =>
            setShowAdminLogin(false)
          }
          style={{
            width: "100%",
            marginTop: "15px",
            padding: "10px",
            background: "transparent",
            border: "1px solid #ccc",
            borderRadius: "6px",
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