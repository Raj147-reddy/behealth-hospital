import "./Services.css";

function Services() {
  return (
    <section className="services">

      <h2>Our Services</h2>

      <div className="service-container">

        <div className="card">
          ❤️
          <h3>Cardiology</h3>
          <p>Advanced heart care with experienced cardiologists.</p>
        </div>

        <div className="card">
          🧠
          <h3>Neurology</h3>
          <p>Specialized treatment for brain and nervous system.</p>
        </div>

        <div className="card">
          🦴
          <h3>Orthopedics</h3>
          <p>Bone and joint treatment using modern equipment.</p>
        </div>

        <div className="card">
          👶
          <h3>Pediatrics</h3>
          <p>Complete healthcare services for children.</p>
        </div>

      </div>

    </section>
  );
}

export default Services;