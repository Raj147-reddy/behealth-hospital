import { useEffect, useState } from "react";
import "./Profile.css";

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getProfile() {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:5000/api/profile",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (response.ok) {
          setUser(data.user);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error("Profile error:", error);
      } finally {
        setLoading(false);
      }
    }

    getProfile();
  }, []);

  if (loading) {
    return (
      <div className="profile-container">
        <div className="profile-box">
          <h2>Loading profile...</h2>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-container">
        <div className="profile-box">
          <h2>Unable to load profile</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-box">
        <h1>👤 My Profile</h1>

        <div className="profile-info">
          <p>
            <strong>Name:</strong> {user.name}
          </p>

          <p>
            <strong>Email:</strong> {user.email}
          </p>

          <p>
            <strong>User ID:</strong> {user.id}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Profile;