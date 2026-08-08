import { useState } from "react";
import "./Appointment.css";

function Appointment() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState("");
  const [problem, setProblem] = useState("");

  async function handleAppointment(event) {
    event.preventDefault();

    console.log("Appointment button clicked");

    if (!name || !email || !phone || !department) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login again");
        return;
      }

      const response = await fetch(
        "https://behealth-hospital.onrender.com/api/appointments",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name,
            email,
            phone,
            department,
            problem,
          }),
        }
      );

      const data = await response.json();

      console.log("Appointment response:", data);

      if (response.ok) {
        alert("Appointment booked successfully");

        setName("");
        setEmail("");
        setPhone("");
        setDepartment("");
        setProblem("");
      } else if (response.status === 401) {
        alert("Your login session expired. Please login again.");
      } else {
        alert(data.message || "Appointment booking failed");
      }
    } catch (error) {
      console.error("Appointment error:", error);
      alert("Cannot connect to backend");
    }
  }

  return (
    <section>
      <h2>Book an Appointment</h2>

      <form
        className="appointment-form"
        onSubmit={handleAppointment}
      >
        <input
          type="text"
          placeholder="Enter Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="tel"
          placeholder="Enter Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        >
          <option value="">Select Department</option>
          <option value="Cardiology">Cardiology</option>
          <option value="Neurology">Neurology</option>
          <option value="Orthopedics">Orthopedics</option>
          <option value="Pediatrics">Pediatrics</option>
        </select>

        <textarea
          placeholder="Describe your problem"
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
        />

        <button type="submit">
          Book Appointment
        </button>
      </form>
    </section>
  );
}

export default Appointment;

