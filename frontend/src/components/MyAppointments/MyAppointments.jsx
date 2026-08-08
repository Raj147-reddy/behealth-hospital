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
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/my-appointments",
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
        alert(data.message || "Failed to load appointments");
      }
    } catch (error) {
      console.error("Appointments error:", error);
      alert("Cannot connect to backend");
    } finally {
      setLoading(false);
    }
  }

  async function cancelAppointment(id) {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this appointment?"
    );

    if (!confirmCancel) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/appointments/${id}/cancel`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      console.log("Cancel response:", data);

      if (response.ok) {
        alert("Appointment cancelled successfully");

        setAppointments((oldAppointments) =>
          oldAppointments.map((appointment) =>
            appointment.id === id
              ? {
                  ...appointment,
                  status: "Cancelled",
                }
              : appointment
          )
        );
      } else {
        alert(
          data.message || "Unable to cancel appointment"
        );
      }
    } catch (error) {
      console.error("Cancel error:", error);
      alert("Cannot connect to backend");
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
    <div
      style={{
        padding: "40px",
        maxWidth: "900px",
        margin: "0 auto",
      }}
    >
      <h1>My Appointments</h1>

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
            <h2>{appointment.department}</h2>

            <p>
              <strong>Name:</strong>{" "}
              {appointment.name}
            </p>

            <p>
              <strong>Email:</strong>{" "}
              {appointment.email}
            </p>

            <p>
              <strong>Phone:</strong>{" "}
              {appointment.phone}
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
              {new Date(
                appointment.created_at
              ).toLocaleString()}
            </p>

            {appointment.status !== "Cancelled" ? (
              <button
                onClick={() =>
                  cancelAppointment(appointment.id)
                }
                style={{
                  padding: "10px 20px",
                  cursor: "pointer",
                }}
              >
                Cancel Appointment
              </button>
            ) : (
              <p>
                <strong>Appointment Cancelled</strong>
              </p>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default MyAppointments;