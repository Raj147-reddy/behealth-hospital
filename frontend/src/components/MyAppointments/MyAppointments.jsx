import { useEffect, useState } from "react";

function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  async function fetchAppointments() {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login again");
        setLoading(false);
        return;
      }

      const response = await fetch(
        "https://behealth-hospital.onrender.com/api/appointments",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      console.log("My appointments:", data);

      if (response.ok) {
        setAppointments(data.appointments || []);
      } else {
        alert(data.message || "Unable to load appointments");
      }
    } catch (error) {
      console.error("My appointments error:", error);
      alert("Cannot connect to backend");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div>
        <h2>Loading appointments...</h2>
      </div>
    );
  }

  return (
    <div>
      <h2>My Appointments</h2>

      {appointments.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        appointments.map((appointment) => (
          <div
            key={appointment.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: "20px",
              marginTop: "20px",
            }}
          >
            <h3>Appointment #{appointment.id}</h3>

            <p>
              <strong>Name:</strong> {appointment.name}
            </p>

            <p>
              <strong>Email:</strong> {appointment.email}
            </p>

            <p>
              <strong>Phone:</strong> {appointment.phone}
            </p>

            <p>
              <strong>Department:</strong> {appointment.department}
            </p>

            <p>
              <strong>Problem:</strong>{" "}
              {appointment.problem || "Not provided"}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {appointment.status || "Pending"}
            </p>

            <p>
              <strong>Booked:</strong>{" "}
              {appointment.created_at
                ? new Date(
                    appointment.created_at
                  ).toLocaleString()
                : "Not available"}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default MyAppointments;

