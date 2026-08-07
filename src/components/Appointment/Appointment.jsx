import "./Appointment.css";

function Appointment() {
  return (
    <section className="appointment">
      <h2>Book an Appointment</h2>

      <form className="appointment-form">

        <input type="text" placeholder="Enter Name" />

        <input type="email" placeholder="Enter Email" />

        <input type="tel" placeholder="Enter Phone Number" />

        <select>
          <option>Select Department</option>
          <option>Cardiology</option>
          <option>Neurology</option>
          <option>Orthopedics</option>
          <option>Pediatrics</option>
        </select>

        <textarea placeholder="Describe your problem"></textarea>

        <button>Book Appointment</button>

      </form>
    </section>
  );
}

export default Appointment;