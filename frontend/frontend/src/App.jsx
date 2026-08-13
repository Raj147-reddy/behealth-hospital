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
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  const [showRegister, setShowRegister] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [currentPage, setCurrentPage] = useState("home");

  const isAdmin =
    localStorage.getItem("isAdmin") === "true";

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("isAdmin");

    setIsLoggedIn(false);
    setCurrentPage("home");
    setShowAdminLogin(false);
    setShowRegister(false);
  }

  // ==============================
  // NOT LOGGED IN
  // ==============================

  if (!isLoggedIn) {
    if (showAdminLogin) {
      return (
        <AdminLogin
          setIsLoggedIn={setIsLoggedIn}
          setShowAdminLogin={setShowAdminLogin}
        />
      );
    }

    if (showRegister) {
      return (
        <Register
          setShowRegister={setShowRegister}
        />
      );
    }

    return (
      <Login
        setIsLoggedIn={setIsLoggedIn}
        setShowRegister={setShowRegister}
        setShowAdminLogin={setShowAdminLogin}
      />
    );
  }

  // ==============================
  // ADMIN
  // ==============================

  if (isAdmin) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#f5f7fa",
        }}
      >
        <AdminDashboard />

        <button
          onClick={handleLogout}
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            zIndex: 99999,
            padding: "12px 22px",
            background: "#d32f2f",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Logout
        </button>
      </div>
    );
  }

  // ==============================
  // NORMAL USER
  // ==============================

  return (
    <>
      <Navbar
        setCurrentPage={setCurrentPage}
        handleLogout={handleLogout}
      />

      {currentPage === "home" && (
        <>
          <Hero />
          <About />
          <Services />
          <Doctors />
        </>
      )}

      {currentPage === "appointment" && (
        <Appointment />
      )}

      {currentPage === "my-appointments" && (
        <MyAppointments />
      )}

      {currentPage === "profile" && (
        <Profile />
      )}

      <Footer />
    </>
  );
}

export default App;