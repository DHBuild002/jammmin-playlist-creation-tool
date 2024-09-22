import React from "react";
import "./styles/profile.css";

const UserProfile = ({ profile, onLogout }) => {
  return (
    <div>
      <h2 className="profile-welcome">Welcome, {profile.name}</h2>
      <button onClick={onLogout}>Logout</button>
    </div>
  );
};

export default UserProfile;
