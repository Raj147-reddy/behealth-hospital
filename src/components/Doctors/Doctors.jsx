import "./Doctors.css";

function Doctors() {
  return (
    <section className="doctors">
      <h2>Our Doctors</h2>

      <div className="doctor-container">

        <div className="doctor-card">
          <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Doctor" />
          <h3>Dr. Rajasekhar</h3>
          <p>Cardiologist</p>
        </div>

        <div className="doctor-card">
          <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Doctor" />
          <h3>Dr. Swathi</h3>
          <p>Neurologist</p>
        </div>

        <div className="doctor-card">
          <img src="https://randomuser.me/api/portraits/men/55.jpg" alt="Doctor" />
          <h3>Dr. Ramu</h3>
          <p>Orthopedic</p>
        </div>

      </div>
    </section>
  );
}

export default Doctors;