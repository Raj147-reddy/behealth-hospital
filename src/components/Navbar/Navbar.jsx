import "./Navbar.css";

function Navbar({ setIsLoggedIn }) {
  return (
    <nav className="navbar">
      <h2>🏥 BeHealth Hospital</h2>

      <ul className="nav-links">
        <li>Home</li>
        <li>About</li>
        <li>Services</li>
        <li>Doctors</li>
        <li>Appointment</li>
        <li>Contact</li>

        <li>
          <button onClick={() => setIsLoggedIn(false)}>
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;