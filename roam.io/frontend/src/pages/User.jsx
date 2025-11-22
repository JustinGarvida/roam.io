import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/auth";

function Profile() {
  let [user, setUser] = useState(null);
  let [loading, setLoading] = useState(true);
  let [newName, setNewName] = useState("");
  let [newEmail, setNewEmail] = useState("");
  let [currentPassword, setCurrentPassword] = useState("");
  let [newPassword, setNewPassword] = useState("");
  let [confirmNewPassword, setConfirmNewPassword] = useState("");
  let [notifications, setNotifications] = useState(false);
  let [message, setMessage] = useState("");
  let [selectedTab, setSelectedTab] = useState("profile");

  let navigate = useNavigate();

  useEffect(() => {
    async function fetchUser() {
      let { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        navigate("/login");
      } else {
        let u = session.user;
        setUser(u);
        setNewName(u.user_metadata?.full_name || "");
        setNewEmail(u.email);
        setNotifications(u.user_metadata?.notifications || false);
      }
      setLoading(false);
    }
    fetchUser();
  }, [navigate]);

  let handleUpdateProfile = async (e) => {
    e.preventDefault();
    setMessage("");

    // -----------------------------
    // VALIDATION FOR PASSWORD TAB
    // -----------------------------
    if (selectedTab === "account") {

      // Must enter current password
      if (!currentPassword) {
        setMessage("Please enter your current password.");
        return;
      }

      // New passwords must match (if changing)
      if (newPassword && newPassword !== confirmNewPassword) {
        setMessage("New passwords do not match.");
        return;
      }

      // Re-authenticate user with old password
      let { error: loginError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });

      if (loginError) {
        setMessage("Current password is incorrect.");
        return;
      }
    }

    try {
      setLoading(true);

      let updates = {
        email: newEmail,
        password: newPassword || undefined,
        data: { full_name: newName, notifications },
      };

      let { error } = await supabase.auth.updateUser(updates);

      if (error) {
        setMessage(error.message);
      } else {
        setMessage("Profile updated successfully!");

        let { data: { user } } = await supabase.auth.getUser();
        setUser(user);

        // Reset password inputs
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      }
    } catch (err) {
      console.error(err);
      setMessage("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  let handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="d-flex vh-100">

      {/* Sidebar */}
      <div className="bg-light border-end p-4" style={{ width: "250px" }}>
        <h4 className="fw-bold mb-4">My Account</h4>

        <ul className="nav flex-column">

          <li className="nav-item">
            <button
              className={`nav-link text-start ${selectedTab === "profile" ? "fw-bold text-primary" : ""}`}
              onClick={() => setSelectedTab("profile")}
            >
              Profile Info
            </button>
          </li>

          <li className="nav-item">
            <button
              className={`nav-link text-start ${selectedTab === "account" ? "fw-bold text-primary" : ""}`}
              onClick={() => setSelectedTab("account")}
            >
              Account Settings
            </button>
          </li>

          <li className="nav-item">
            <button
              className={`nav-link text-start ${selectedTab === "notifications" ? "fw-bold text-primary" : ""}`}
              onClick={() => setSelectedTab("notifications")}
            >
              Notifications
            </button>
          </li>

        </ul>

        <button
          className="btn btn-outline-danger w-100 mt-4"
          onClick={handleLogout}
        >
          Log Out
        </button>
      </div>

      {/* Main content */}
      <div className="flex-grow-1 d-flex align-items-center justify-content-center">
        <div className="card shadow-lg p-4" style={{ width: "450px" }}>

          <h2 className="fw-bold text-primary text-center mb-3">
            {selectedTab === "profile" && "Profile Info"}
            {selectedTab === "account" && "Account Settings"}
            {selectedTab === "notifications" && "Notifications"}
          </h2>

          {user && (
            <form onSubmit={handleUpdateProfile}>

              {/* PROFILE TAB */}
              {selectedTab === "profile" && (
                <>
                  <div className="text-center mb-3">
                    <img
                      src="https://via.placeholder.com/100"
                      alt="Avatar"
                      className="rounded-circle"
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                      }}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                    />
                  </div>
                </>
              )}

              {/* ACCOUNT SETTINGS TAB */}
              {selectedTab === "account" && (
                <>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Current Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">New Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Confirm New Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      placeholder="Re-enter new password"
                    />
                  </div>
                </>
              )}

              {/* NOTIFICATIONS TAB */}
              {selectedTab === "notifications" && (
                <div className="mb-3 form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="notif"
                    checked={notifications}
                    onChange={(e) => setNotifications(e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="notif">
                    Receive email notifications
                  </label>
                </div>
              )}

              {/* Save Button */}
              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loading}
              >
                {loading ? "Updating..." : "Save Changes"}
              </button>

              {message && (
                <div className="alert alert-info text-center mt-3">{message}</div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
