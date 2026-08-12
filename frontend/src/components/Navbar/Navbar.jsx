import "./Navbar.css";

function Navbar({ setCurrentPage, handleLogout }) {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        🏥 BeHealth Hospital
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

        <button
          onClick={() => setCurrentPage("appointment")}
        >
          Appointment
        </button>

        <button
          onClick={() => setCurrentPage("my-appointments")}
        >
          My Appointments
        </button>

        <button onClick={() => setCurrentPage("contact")}>
          Contact
        </button>

        <button onClick={() => setCurrentPage("profile")}>
          Profile
        </button>

        <button
          type="button"
          onClick={handleLogout}
          className="logout-button"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;