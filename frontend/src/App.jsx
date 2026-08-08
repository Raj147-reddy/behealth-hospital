import { useState } from "react";

import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import Profile from "./components/Profile/Profile";
import MyAppointments from "./components/MyAppointments/MyAppointments";
import AdminDashboard from "./components/AdminDashboard/AdminDashboard";

import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import About from "./components/About/About";
import Services from "./components/Services/Services";
import Doctors from "./components/Doctors/Doctors";
import Appointment from "./components/Appointment/Appointment";
import Footer from "./components/Footer/Footer";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  const [showRegister, setShowRegister] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showAppointments, setShowAppointments] =
    useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const isAdmin = user.is_admin === true;

  function goHome() {
    setShowProfile(false);
    setShowAppointments(false);
    setShowAdmin(false);
  }

  function goProfile() {
    setShowProfile(true);
    setShowAppointments(false);
    setShowAdmin(false);
  }

  function goAppointments() {
    setShowProfile(false);
    setShowAppointments(true);
    setShowAdmin(false);
  }

  function goAdmin() {
    setShowProfile(false);
    setShowAppointments(false);
    setShowAdmin(true);
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setIsLoggedIn(false);
    setShowProfile(false);
    setShowAppointments(false);
    setShowAdmin(false);
  }

  return (
    <>
      {isLoggedIn ? (
        <>
          <Navbar
            setIsLoggedIn={setIsLoggedIn}
            setShowProfile={setShowProfile}
            setShowAppointments={setShowAppointments}
            setShowAdmin={setShowAdmin}
            isAdmin={isAdmin}
          />

          {showAdmin && isAdmin ? (
            <AdminDashboard />
          ) : showProfile ? (
            <Profile />
          ) : showAppointments ? (
            <MyAppointments />
          ) : (
            <>
              <Hero />
              <About />
              <Services />
              <Doctors />
              <Appointment />
              <Footer />
            </>
          )}
        </>
      ) : showRegister ? (
        <Register
          setShowRegister={setShowRegister}
        />
      ) : (
        <Login
          setIsLoggedIn={setIsLoggedIn}
          setShowRegister={setShowRegister}
        />
      )}
    </>
  );
}

export default App;