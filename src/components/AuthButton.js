import React from "react";
import "./styles/AuthButton.css";
// require("dotenv").config({ path: "../server/variables.env" });

const AuthButton = () => {
  const handleLogin = () => {
    // Make a request to the server to initiate Spotify login
    window.location.href = "http://localhost:3001/login"; // This hits your server's /login endpoint
  };
  return (
    <div>
      <button className="loginBtn" onClick={handleLogin}>
        Login to begin creating playlists
      </button>
    </div>
  );
};

export default AuthButton;
