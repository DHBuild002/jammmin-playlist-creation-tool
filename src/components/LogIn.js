import React, { useState } from "react";
import { loginToSpotify } from "../Spotify";

const LogIn = () => {
  const handleLogin = () => {
    // setIsLoggedIn(true);
    loginToSpotify(); // Trigger the Spotify login process
  };
  return (
    <div className="spotify-container">
      <h2 className="login-txt mt-6">Create a custom playlist</h2>
      <button
        className="bg-purple-700 border-white-300 text-white p-3 mt-3 rounded-xl shadow-md hover:bg-purple-600 transition-all duration-300 ease-in-out"
        onClick={handleLogin}
      >
        Login to Spotify
      </button>
    </div>
  );
};

export default LogIn;
