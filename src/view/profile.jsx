import { useState } from "react";
import "./Profile.css"; // External CSS file for better styling

export default function Profile() {
  // Simulating the logged-in user data from session storage
  const sessionData = JSON.parse(sessionStorage.getItem("user")) || {
    business_Name: "Unknown Business",
    email: "unknown@example.com",
    id: null,
    owner_name: "Unknown Owner",
    phone: "Unknown Phone",
    username: "Unknown User",
  };

  const [user, setUser] = useState(sessionData); // Setting the logged-in user data
  const [isEditing, setIsEditing] = useState(false); // Editing state
  const [formData, setFormData] = useState(user); // Temporary form data for editing

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setUser(formData);
    setIsEditing(false);
    // Optionally update the session storage or an API
    sessionStorage.setItem("user", JSON.stringify(formData));
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData(user); // Reset form data
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="profile">
      <h1>Profile</h1>
      <div className="profile-card">
        <img
          src="https://via.placeholder.com/150"
          alt={`${user.owner_name}'s avatar`}
          className="profile-image"
        />
        {isEditing ? (
          <form className="profile-form">
            <div className="form-group">
              <label>Business Name:</label>
              <input
                type="text"
                name="business_Name"
                value={formData.business_Name}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Owner Name:</label>
              <input
                type="text"
                name="owner_name"
                value={formData.owner_name}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Phone:</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <div className="profile-actions">
              <button type="button" onClick={handleSave}>
                Save
              </button>
              <button type="button" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="profile-details">
            <p>
              <strong>Business Name:</strong> {user.business_Name}
            </p>
            <p>
              <strong>Owner Name:</strong> {user.owner_name}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Phone:</strong> {user.phone}
            </p>
            <p>
              <strong>Username:</strong> {user.username}
            </p>
            <div className="profile-actions">
              <button onClick={handleEdit}>Edit</button>
              <button
                onClick={() => {
                  if (window.confirm("Are you sure you want to delete this account?")) {
                    alert("Account deleted.");
                    sessionStorage.removeItem("user");
                    setUser(null);
                  }
                }}
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
