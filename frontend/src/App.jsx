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
import Footer from "./components/Footer/Footer";
import AdminDashboard from "./components/AdminDashboard/AdminDashboard";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  const [showRegister, setShowRegister] = useState(false);

  const [showAdminLogin, setShowAdminLogin] =
    useState(false);

  const [currentPage, setCurrentPage] =
    useState("home");

  // ==================================================
  // LOGGED OUT
  // ==================================================

  if (!isLoggedIn) {
    // ADMIN LOGIN
    if (showAdminLogin) {
      return (
        <AdminLogin
          setIsLoggedIn={setIsLoggedIn}
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

    // USER LOGIN
    return (
      <Login
        setIsLoggedIn={setIsLoggedIn}
        setShowRegister={setShowRegister}
        setShowAdminLogin={setShowAdminLogin}
      />
    );
  }

  // ==================================================
  // LOGOUT
  // ==================================================

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("isAdmin");

    setIsLoggedIn(false);
    setShowRegister(false);
    setShowAdminLogin(false);
    setCurrentPage("home");
  }

  // ==================================================
  // HOME
  // ==================================================

  function renderHome() {
    return (
      <>
        <Hero />
        <About />
        <Services />
        <Doctors />
      </>
    );
  }

  // ==================================================
  // MAIN PAGE
  // ==================================================

  return (
    <>
      <Navbar
        setCurrentPage={setCurrentPage}
        handleLogout={handleLogout}
      />

      {currentPage === "home" &&
        renderHome()}

      {currentPage === "appointment" && (
        <Appointment />
      )}

      {currentPage === "my-appointments" && (
        <MyAppointments />
      )}

      {currentPage === "profile" && (
        <Profile />
      )}

      {currentPage === "admin" && (
        <AdminDashboard />
      )}

      <Footer />
    </>
  );
}

export default App;