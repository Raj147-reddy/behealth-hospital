import { useState } from "react";

import Login from "./components/Login/Login";
import AdminLogin from "./components/AdminLogin/AdminLogin";
import Register from "./components/Register/Register";
import Navbar from "./components/Navbar/Navbar";

import Hero from "./components/Hero/Hero";
import About from "./components/About/About";
import Services from "./components/Services/Services";
import Doctors from "./components/Doctors/Doctors";
import Appointment from "./components/Appointment/Appointment";
import MyAppointments from "./components/MyAppointments/MyAppointments";
import Profile from "./components/Profile/Profile";

import AdminDashboard from "./components/AdminDashboard/AdminDashboard";
import Footer from "./components/Footer/Footer";

function App() {
  // ==========================================
  // LOGIN STATE
  // ==========================================

  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("token") !== null
  );

  const [showRegister, setShowRegister] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  // ==========================================
  // ADMIN STATE
  // ==========================================

  const [isAdmin, setIsAdmin] = useState(
    localStorage.getItem("isAdmin") === "true"
  );

  // ==========================================
  // CURRENT PAGE
  // ==========================================

  const [currentPage, setCurrentPage] = useState(
    localStorage.getItem("isAdmin") === "true"
      ? "admin-dashboard"
      : "home"
  );

  // ==========================================
  // NORMAL USER LOGIN
  // ==========================================

  const handleNormalLogin = (value) => {
    // Remove any old admin session
    localStorage.removeItem("isAdmin");

    setIsAdmin(false);
    setCurrentPage("home");
    setIsLoggedIn(value);
  };

  // ==========================================
  // ADMIN LOGIN
  // ==========================================

  const handleAdminLogin = (value) => {
    setIsLoggedIn(value);

    if (localStorage.getItem("isAdmin") === "true") {
      setIsAdmin(true);
      setCurrentPage("admin-dashboard");
    } else {
      setIsAdmin(false);
      setCurrentPage("home");
    }
  };

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("isAdmin");

    setIsLoggedIn(false);
    setIsAdmin(false);
    setCurrentPage("home");

    setShowRegister(false);
    setShowAdminLogin(false);
  };

  // ==========================================
  // NOT LOGGED IN
  // ==========================================

  if (!isLoggedIn) {
    // ADMIN LOGIN
    if (showAdminLogin) {
      return (
        <AdminLogin
          setIsLoggedIn={handleAdminLogin}
          setShowAdminLogin={setShowAdminLogin}
        />
      );
    }

    // REGISTER
    if (showRegister) {
      return (
        <Register
          setShowRegister={setShowRegister}
        />
      );
    }

    // NORMAL LOGIN
    return (
      <Login
        setIsLoggedIn={handleNormalLogin}
        setShowRegister={setShowRegister}
        setShowAdminLogin={setShowAdminLogin}
      />
    );
  }

  // ==========================================
  // LOGGED IN
  // ==========================================

  return (
    <div className="app">

      {/* NAVBAR */}

      <Navbar
        setCurrentPage={setCurrentPage}
        handleLogout={handleLogout}
        isAdmin={isAdmin}
      />

      {/* ======================================
          ADMIN SECTION
          ====================================== */}

      {isAdmin ? (
        <>
          {/* ADMIN DASHBOARD */}

          {currentPage === "admin-dashboard" && (
            <AdminDashboard />
          )}

          {/* ADMIN HOME */}

          {currentPage === "admin-home" && (
            <div
              style={{
                padding: "60px 20px",
                textAlign: "center",
                minHeight: "500px",
              }}
            >
              <h1>BeHealth Hospital Admin</h1>

              <p style={{ marginTop: "15px" }}>
                Welcome to the hospital administration panel.
              </p>

              <button
                onClick={() =>
                  setCurrentPage("admin-dashboard")
                }
                style={{
                  marginTop: "25px",
                  padding: "12px 25px",
                  cursor: "pointer",
                }}
              >
                Go to Dashboard
              </button>
            </div>
          )}

          {/* ADMIN APPOINTMENTS */}

          {currentPage === "admin-appointments" && (
            <div
              style={{
                padding: "60px 20px",
                textAlign: "center",
                minHeight: "500px",
              }}
            >
              <h1>Admin Appointments</h1>

              <p style={{ marginTop: "15px" }}>
                Manage hospital appointments from this section.
              </p>
            </div>
          )}

          {/* ADMIN DOCTORS */}

          {currentPage === "admin-doctors" && (
            <div
              style={{
                padding: "60px 20px",
                textAlign: "center",
                minHeight: "500px",
              }}
            >
              <h1>Admin Doctors</h1>

              <p style={{ marginTop: "15px" }}>
                Manage hospital doctors from this section.
              </p>
            </div>
          )}
        </>
      ) : (
        <>
          {/* ======================================
              NORMAL USER SECTION
              ====================================== */}

          {/* HOME */}

          {currentPage === "home" && (
            <>
              <Hero />
              <About />
              <Services />
              <Doctors />
            </>
          )}

          {/* ABOUT */}

          {currentPage === "about" && (
            <About />
          )}

          {/* SERVICES */}

          {currentPage === "services" && (
            <Services />
          )}

          {/* DOCTORS */}

          {currentPage === "doctors" && (
            <Doctors />
          )}

          {/* APPOINTMENT */}

          {currentPage === "appointment" && (
            <Appointment />
          )}

          {/* MY APPOINTMENTS */}

          {currentPage === "my-appointments" && (
            <MyAppointments />
          )}

          {/* PROFILE */}

          {currentPage === "profile" && (
            <Profile />
          )}

          {/* CONTACT */}

          {currentPage === "contact" && (
            <div
              style={{
                padding: "50px",
                textAlign: "center",
                minHeight: "500px",
              }}
            >
              <h1>Contact Us</h1>

              <p>
                Contact BeHealth Hospital for more information.
              </p>
            </div>
          )}
        </>
      )}

      {/* FOOTER */}

      <Footer />

    </div>
  );
}

export default App;