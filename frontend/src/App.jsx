import { useState } from "react";

import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import Profile from "./components/Profile/Profile";
import MyAppointments from "./components/MyAppointments/MyAppointments";
import AdminDashboard from "./components/AdminDashboard/AdminDashboard";

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
  const [page, setPage] = useState("home");

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const isAdmin = user.is_admin === true;

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setIsLoggedIn(false);
    setPage("home");
  }

  if (!isLoggedIn) {
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
      />
    );
  }

  if (page === "profile") {
    return (
      <>
        <button onClick={() => setPage("home")}>
          Home
        </button>

        <button onClick={() => setPage("appointments")}>
          My Appointments
        </button>

        <button onClick={handleLogout}>
          Logout
        </button>

        <Profile />
      </>
    );
  }

  if (page === "appointments") {
    return (
      <>
        <button onClick={() => setPage("home")}>
          Home
        </button>

        <button onClick={() => setPage("profile")}>
          Profile
        </button>

        <button onClick={handleLogout}>
          Logout
        </button>

        <MyAppointments />
      </>
    );
  }

  if (page === "admin" && isAdmin) {
    return (
      <>
        <button onClick={() => setPage("home")}>
          Home
        </button>

        <button onClick={handleLogout}>
          Logout
        </button>

        <AdminDashboard />
      </>
    );
  }

  return (
    <>
      <nav
        style={{
          padding: "15px",
          background: "#eeeeee",
          display: "flex",
          gap: "10px",
        }}
      >
        <button onClick={() => setPage("home")}>
          Home
        </button>

        <button onClick={() => setPage("profile")}>
          Profile
        </button>

        <button onClick={() => setPage("appointments")}>
          My Appointments
        </button>

        {isAdmin && (
          <button onClick={() => setPage("admin")}>
            Admin Dashboard
          </button>
        )}

        <button onClick={handleLogout}>
          Logout
        </button>
      </nav>

      <Hero />
      <About />
      <Services />
      <Doctors />
      <Appointment />
      <Footer />
    </>
  );
}

export default App;

