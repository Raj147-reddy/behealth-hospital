import { useEffect, useState } from "react";

function AdminDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
    fetchUsers();
  }, []);

  // ======================================================
  // FETCH APPOINTMENTS
  // ======================================================

  async function fetchAppointments() {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login again");
        return;
      }

      const response = await fetch(
        "https://behealth-hospital-1.onrender.com/api/admin/appointments",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      console.log("Admin appointments:", data);

      if (response.ok) {
        setAppointments(data.appointments || []);
      } else {
        alert(data.message || "Unable to load appointments");
      }
    } catch (error) {
      console.error("Admin dashboard error:", error);
      alert("Cannot connect to backend");
    } finally {
      setLoading(false);
    }
  }

  // ======================================================
  // FETCH REGISTERED USERS
  // ======================================================

  async function fetchUsers() {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return;
      }

      const response = await fetch(
        "https://behealth-hospital-1.onrender.com/api/admin/users",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      console.log("Registered users:", data);

      if (response.ok) {
        setUsers(data.users || []);
      } else {
        alert(data.message || "Unable to load registered users");
      }
    } catch (error) {
      console.error("Users fetch error:", error);
      alert("Cannot connect to backend");
    } finally {
      setUsersLoading(false);
    }
  }

  // ======================================================
  // UPDATE APPOINTMENT STATUS
  // ======================================================

  async function updateStatus(id, status) {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login again");
        return;
      }

      const response = await fetch(
        `https://behealth-hospital-1.onrender.com/api/admin/appointments/${id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: status,
          }),
        }
      );

      const data = await response.json();

      console.log("Status update:", data);

      if (response.ok) {
        alert("Appointment status updated");

        setAppointments((oldAppointments) =>
          oldAppointments.map((appointment) =>
            appointment.id === id
              ? {
                  ...appointment,
                  status: status,
                }
              : appointment
          )
        );
      } else {
        alert(data.message || "Unable to update status");
      }
    } catch (error) {
      console.error("Status update error:", error);
      alert("Cannot connect to backend");
    }
  }

  // ======================================================
  // MAIN LOADING
  // ======================================================

  if (loading) {
    return (
      <div style={{ padding: "40px" }}>
        <h2>Loading admin dashboard...</h2>
      </div>
    );
  }

  // ======================================================
  // DASHBOARD
  // ======================================================

  return (
    <div
      style={{
        padding: "40px",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <h1>Admin Dashboard</h1>

      {/* ==================================================
          REGISTERED USERS
      ================================================== */}

      <section style={{ marginTop: "30px" }}>
        <h2>Registered Users</h2>

        <p>
          Total Registered Users:{" "}
          <strong>{users.length}</strong>
        </p>

        {usersLoading ? (
          <p>Loading registered users...</p>
        ) : users.length === 0 ? (
          <p>No registered users found.</p>
        ) : (
          <div
            style={{
              overflowX: "auto",
              marginTop: "15px",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                background: "#fff",
              }}
            >
              <thead>
                <tr>
                  <th style={cellStyle}>ID</th>
                  <th style={cellStyle}>Name</th>
                  <th style={cellStyle}>Email</th>
                  <th style={cellStyle}>Admin</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td style={cellStyle}>{user.id}</td>
                    <td style={cellStyle}>{user.name}</td>
                    <td style={cellStyle}>{user.email}</td>
                    <td style={cellStyle}>
                      {user.is_admin ? "Yes" : "No"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ==================================================
          APPOINTMENTS
      ================================================== */}

      <section style={{ marginTop: "50px" }}>
        <h2>Appointments</h2>

        <p>
          Total Appointments:{" "}
          <strong>{appointments.length}</strong>
        </p>

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
                background: "#fff",
              }}
            >
              <h2>Appointment #{appointment.id}</h2>

              <p>
                <strong>Patient:</strong>{" "}
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
                <strong>Department:</strong>{" "}
                {appointment.department}
              </p>

              <p>
                <strong>Problem:</strong>{" "}
                {appointment.problem || "Not provided"}
              </p>

              <p>
                <strong>User ID:</strong>{" "}
                {appointment.user_id}
              </p>

              <p>
                <strong>Current Status:</strong>{" "}
                {appointment.status || "Pending"}
              </p>

              <p>
                <strong>Booked:</strong>{" "}
                {new Date(
                  appointment.created_at
                ).toLocaleString()}
              </p>

              <label>
                <strong>Change Status:</strong>
              </label>

              <select
                value={appointment.status || "Pending"}
                onChange={(e) =>
                  updateStatus(
                    appointment.id,
                    e.target.value
                  )
                }
                style={{
                  marginLeft: "10px",
                  padding: "8px",
                }}
              >
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          ))
        )}
      </section>
    </div>
  );
}

const cellStyle = {
  border: "1px solid #ddd",
  padding: "12px",
  textAlign: "left",
};

export default AdminDashboard;