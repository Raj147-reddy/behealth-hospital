import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000";

function AdminDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [users, setUsers] = useState([]);

  const [loadingAppointments, setLoadingAppointments] =
    useState(true);

  const [loadingUsers, setLoadingUsers] =
    useState(true);

  useEffect(() => {
    fetchAppointments();
    fetchUsers();
  }, []);

  // =====================================================
  // GET ALL REGISTERED USERS
  // =====================================================

  async function fetchUsers() {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login again");
        return;
      }

      const response = await fetch(
        `${API_URL}/api/admin/users`,
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
        alert(
          data.message ||
            "Unable to load registered users"
        );
      }
    } catch (error) {
      console.error(
        "Registered users error:",
        error
      );

      alert("Cannot connect to backend");
    } finally {
      setLoadingUsers(false);
    }
  }

  // =====================================================
  // GET ALL APPOINTMENTS
  // =====================================================

  async function fetchAppointments() {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login again");
        return;
      }

      const response = await fetch(
        `${API_URL}/api/admin/appointments`,
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
        setAppointments(
          data.appointments || []
        );
      } else {
        alert(
          data.message ||
            "Unable to load appointments"
        );
      }
    } catch (error) {
      console.error(
        "Admin dashboard error:",
        error
      );

      alert("Cannot connect to backend");
    } finally {
      setLoadingAppointments(false);
    }
  }

  // =====================================================
  // UPDATE APPOINTMENT STATUS
  // =====================================================

  async function updateStatus(id, status) {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/api/admin/appointments/${id}/status`,
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
        alert(
          "Appointment status updated"
        );

        setAppointments(
          (oldAppointments) =>
            oldAppointments.map(
              (appointment) =>
                appointment.id === id
                  ? {
                      ...appointment,
                      status: status,
                    }
                  : appointment
            )
        );
      } else {
        alert(
          data.message ||
            "Unable to update status"
        );
      }
    } catch (error) {
      console.error(
        "Status update error:",
        error
      );

      alert("Cannot connect to backend");
    }
  }

  // =====================================================
  // LOADING
  // =====================================================

  if (
    loadingAppointments &&
    loadingUsers
  ) {
    return (
      <div
        style={{
          padding: "40px",
          textAlign: "center",
        }}
      >
        <h2>
          Loading admin dashboard...
        </h2>
      </div>
    );
  }

  // =====================================================
  // DASHBOARD
  // =====================================================

  return (
    <div
      style={{
        padding: "40px",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          marginBottom: "40px",
        }}
      >
        Admin Dashboard
      </h1>

      {/* =================================================
          REGISTERED USERS
      ================================================= */}

      <section
        style={{
          marginBottom: "50px",
        }}
      >
        <h2
          style={{
            marginBottom: "10px",
          }}
        >
          Registered Users
        </h2>

        <p>
          Total Registered Users:{" "}
          <strong>{users.length}</strong>
        </p>

        {loadingUsers ? (
          <p>
            Loading registered users...
          </p>
        ) : users.length === 0 ? (
          <p>
            No registered users found.
          </p>
        ) : (
          <div
            style={{
              overflowX: "auto",
              background: "#fff",
              borderRadius: "10px",
              boxShadow:
                "0 2px 10px rgba(0,0,0,0.1)",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse:
                  "collapse",
              }}
            >
              <thead>
                <tr
                  style={{
                    background:
                      "#087fba",
                    color: "#fff",
                  }}
                >
                  <th
                    style={{
                      padding: "15px",
                      border:
                        "1px solid #ddd",
                    }}
                  >
                    ID
                  </th>

                  <th
                    style={{
                      padding: "15px",
                      border:
                        "1px solid #ddd",
                    }}
                  >
                    Name
                  </th>

                  <th
                    style={{
                      padding: "15px",
                      border:
                        "1px solid #ddd",
                    }}
                  >
                    Email
                  </th>

                  <th
                    style={{
                      padding: "15px",
                      border:
                        "1px solid #ddd",
                    }}
                  >
                    Admin
                  </th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td
                      style={{
                        padding: "15px",
                        border:
                          "1px solid #ddd",
                        textAlign:
                          "center",
                      }}
                    >
                      {user.id}
                    </td>

                    <td
                      style={{
                        padding: "15px",
                        border:
                          "1px solid #ddd",
                      }}
                    >
                      {user.name}
                    </td>

                    <td
                      style={{
                        padding: "15px",
                        border:
                          "1px solid #ddd",
                      }}
                    >
                      {user.email}
                    </td>

                    <td
                      style={{
                        padding: "15px",
                        border:
                          "1px solid #ddd",
                        textAlign:
                          "center",
                      }}
                    >
                      {user.is_admin
                        ? "Yes"
                        : "No"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* =================================================
          APPOINTMENTS
      ================================================= */}

      <section>
        <h2>
          Appointments
        </h2>

        <p>
          Total Appointments:{" "}
          <strong>
            {appointments.length}
          </strong>
        </p>

        {loadingAppointments ? (
          <p>
            Loading appointments...
          </p>
        ) : appointments.length === 0 ? (
          <p>
            No appointments found.
          </p>
        ) : (
          appointments.map(
            (appointment) => (
              <div
                key={appointment.id}
                style={{
                  border:
                    "1px solid #ddd",
                  borderRadius: "10px",
                  padding: "20px",
                  marginTop: "20px",
                  background: "#fff",
                  boxShadow:
                    "0 2px 8px rgba(0,0,0,0.08)",
                }}
              >
                <h3>
                  Appointment #
                  {appointment.id}
                </h3>

                <p>
                  <strong>
                    Patient:
                  </strong>{" "}
                  {appointment.name}
                </p>

                <p>
                  <strong>
                    Email:
                  </strong>{" "}
                  {appointment.email}
                </p>

                <p>
                  <strong>
                    Phone:
                  </strong>{" "}
                  {appointment.phone}
                </p>

                <p>
                  <strong>
                    Department:
                  </strong>{" "}
                  {
                    appointment.department
                  }
                </p>

                <p>
                  <strong>
                    Problem:
                  </strong>{" "}
                  {appointment.problem ||
                    "Not provided"}
                </p>

                <p>
                  <strong>
                    User ID:
                  </strong>{" "}
                  {appointment.user_id}
                </p>

                <p>
                  <strong>
                    Current Status:
                  </strong>{" "}
                  {appointment.status ||
                    "Pending"}
                </p>

                <p>
                  <strong>
                    Booked:
                  </strong>{" "}
                  {appointment.created_at
                    ? new Date(
                        appointment.created_at
                      ).toLocaleString()
                    : "Not available"}
                </p>

                <label>
                  <strong>
                    Change Status:
                  </strong>
                </label>

                <select
                  value={
                    appointment.status ||
                    "Pending"
                  }
                  onChange={(e) =>
                    updateStatus(
                      appointment.id,
                      e.target.value
                    )
                  }
                  style={{
                    marginLeft: "10px",
                    padding: "8px",
                    borderRadius:
                      "5px",
                  }}
                >
                  <option value="Pending">
                    Pending
                  </option>

                  <option value="Confirmed">
                    Confirmed
                  </option>

                  <option value="Completed">
                    Completed
                  </option>

                  <option value="Cancelled">
                    Cancelled
                  </option>
                </select>
              </div>
            )
          )
        )}
      </section>
    </div>
  );
}

export default AdminDashboard;