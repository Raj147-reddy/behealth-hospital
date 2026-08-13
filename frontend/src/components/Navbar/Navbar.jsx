import "./Navbar.css";

function Navbar({
  setCurrentPage,
  handleLogout,
  isAdmin,
}) {
  if (isAdmin) {
    return (
      <nav className="navbar">
        <div className="navbar-logo">
          🏥 MediCare
        </div>

        <div className="navbar-links">
          <button onClick={() => setCurrentPage("admin-home")}>
            Home
          </button>

          <button onClick={() => setCurrentPage("admin-dashboard")}>
            Dashboard
          </button>

          <button onClick={() => setCurrentPage("admin-appointments")}>
            Appointments
          </button>

          <button onClick={() => setCurrentPage("admin-doctors")}>
            Doctors
          </button>

          <button onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>
    );
  }

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        🏥 MediCare
      </div>

      <div className="navbar-links">
        <button onClick={() => setCurrentPage("home")}>
          Home
        </button>

        <button onClick={() => setCurrentPage("about")}>
          About
        </button>

        <button onClick={() => setCurrentPage("services")}>
          Services
        </button>

        <button onClick={() => setCurrentPage("doctors")}>
          Doctors
        </button>

        <button onClick={() => setCurrentPage("appointment")}>
          Appointment
        </button>

        <button onClick={() => setCurrentPage("my-appointments")}>
          My Appointments
        </button>

        <button onClick={() => setCurrentPage("profile")}>
          Profile
        </button>

        <button onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;