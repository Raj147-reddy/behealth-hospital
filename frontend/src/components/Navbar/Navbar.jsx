import "./Navbar.css";

function Navbar({
  setIsLoggedIn,
  setShowProfile,
  setShowAppointments,
  setShowAdmin,
  isAdmin,
}) {
  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setIsLoggedIn(false);
  }

  function handleHome() {
    setShowProfile(false);
    setShowAppointments(false);
    setShowAdmin(false);
  }

  function handleProfile() {
    setShowProfile(true);
    setShowAppointments(false);
    setShowAdmin(false);
  }

  function handleAppointments() {
    setShowProfile(false);
    setShowAppointments(true);
    setShowAdmin(false);
  }

  function handleAdmin() {
    setShowProfile(false);
    setShowAppointments(false);
    setShowAdmin(true);
  }

  return (
    <nav>
      <div className="logo">
        🏥 BeHealth Hospital
      </div>

      <ul className="nav-links">
        <li onClick={handleHome}>
          Home
        </li>

        <li onClick={handleHome}>
          About
        </li>

        <li onClick={handleHome}>
          Services
        </li>

        <li onClick={handleHome}>
          Doctors
        </li>

        <li onClick={handleHome}>
          Appointment
        </li>

        <li onClick={handleAppointments}>
          My Appointments
        </li>

        <li onClick={handleHome}>
          Contact
        </li>

        <li onClick={handleProfile}>
          Profile
        </li>

        {isAdmin && (
          <li onClick={handleAdmin}>
            Admin Dashboard
          </li>
        )}

        <li>
          <button onClick={handleLogout}>
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;