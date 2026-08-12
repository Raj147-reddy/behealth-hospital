import { useState } from "react";
import "./Appointment.css";

const API_URL = "https://behealth-hospital-1.onrender.com";

function Appointment() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState("");
  const [problem, setProblem] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    const token = localStorage.getItem("token");

    console.log("================================");
    console.log("BOOK APPOINTMENT");
    console.log("TOKEN EXISTS:", !!token);
    console.log(
      "TOKEN LENGTH:",
      token ? token.length : 0
    );
    console.log("================================");

    if (!token) {
      alert("Please login first");
      return;
    }

    if (
      !name ||
      !email ||
      !phone ||
      !department ||
      !problem
    ) {
      alert("Please fill all appointment fields");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/appointments`,
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

      console.log(
        "Appointment response:",
        data
      );

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        alert(
          "Session expired. Please login again."
        );

        return;
      }

      if (!response.ok) {
        alert(
          data.message ||
            "Appointment booking failed"
        );

        return;
      }

      alert(
        "Appointment booked successfully!"
      );

      setName("");
      setEmail("");
      setPhone("");
      setDepartment("");
      setProblem("");

    } catch (error) {
      console.error(
        "Appointment booking error:",
        error
      );

      alert("Cannot connect to backend");
    }
  }

  return (
    <div className="appointment-container">

      <h2>Book Appointment</h2>

      <form
        onSubmit={handleSubmit}
        className="appointment-form"
      >

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <input
          type="text"
          placeholder="Phone"
          value={phone}
          onChange={(e) =>
            setPhone(e.target.value)
          }
        />

        <select
          value={department}
          onChange={(e) =>
            setDepartment(e.target.value)
          }
        >
          <option value="">
            Select Department
          </option>

          <option value="Cardiology">
            Cardiology
          </option>

          <option value="Neurology">
            Neurology
          </option>

          <option value="Orthopedics">
            Orthopedics
          </option>

          <option value="Dermatology">
            Dermatology
          </option>

          <option value="General Medicine">
            General Medicine
          </option>
        </select>

        <textarea
          placeholder="Describe your problem"
          value={problem}
          onChange={(e) =>
            setProblem(e.target.value)
          }
        />

        <button type="submit">
          Book Appointment
        </button>

      </form>

    </div>
  );
}

export default Appointment;


