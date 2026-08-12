import { useEffect, useState } from "react";
import "./MyAppointments.css";

const API_URL = "https://behealth-hospital-1.onrender.com";

function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  async function fetchAppointments() {
    const token = localStorage.getItem("token");

    console.log("================================");
    console.log("FETCHING MY APPOINTMENTS");
    console.log("TOKEN EXISTS:", !!token);
    console.log(
      "TOKEN LENGTH:",
      token ? token.length : 0
    );
    console.log("================================");

    if (!token) {
      console.log("No token found");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/my-appointments`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      console.log("My appointments response:", data);
      console.log("HTTP STATUS:", response.status);

      if (response.status === 401) {
        console.error("TOKEN REJECTED BY BACKEND");

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setAppointments([]);
        setLoading(false);

        alert("Session expired. Please login again.");
        return;
      }

      if (!response.ok) {
        console.error(
          "Appointments request failed:",
          data
        );

        setAppointments([]);
        setLoading(false);
        return;
      }

      setAppointments(data.appointments || []);
    } catch (error) {
      console.error(
        "Fetch appointments error:",
        error
      );

      setAppointments([]);
    } finally {
      setLoading(false);
    }
  }

  async function cancelAppointment(id) {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/appointments/${id}/cancel`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      console.log("Cancel response:", data);

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        alert("Session expired. Please login again.");
        return;
      }

      if (!response.ok) {
        alert(
          data.message ||
            "Unable to cancel appointment"
        );
        return;
      }

      alert("Appointment cancelled successfully");

      fetchAppointments();
    } catch (error) {
      console.error(
        "Cancel appointment error:",
        error
      );

      alert("Cannot connect to backend");
    }
  }

  if (loading) {
    return (
      <div className="my-appointments">
        <h2>My Appointments</h2>
        <p>Loading appointments...</p>
      </div>
    );
  }

  return (
    <div className="my-appointments">
      <h2>My Appointments</h2>

      {appointments.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        <div className="appointments-list">
          {appointments.map((appointment) => (
            <div
              className="appointment-card"
              key={appointment.id}
            >
              <h3>
                {appointment.department}
              </h3>

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
                {appointment.problem}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                {appointment.status}
              </p>

              <p>
                <strong>Date:</strong>{" "}
                {appointment.created_at
                  ? new Date(
                      appointment.created_at
                    ).toLocaleString()
                  : "N/A"}
              </p>

              {appointment.status ===
                "Pending" && (
                <button
                  onClick={() =>
                    cancelAppointment(
                      appointment.id
                    )
                  }
                >
                  Cancel Appointment
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyAppointments;


