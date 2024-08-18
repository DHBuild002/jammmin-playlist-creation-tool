import React from "react";

const AuthButton = () => {
  // Your Spotify application credentials
  const CLIENT_ID = "YOUR_SPOTIFY_CLIENT_ID";
  const REDIRECT_URI = "http://localhost:3000/callback"; // Ensure this matches the Redirect URI in your Spotify dashboard
  const SCOPES = "user-library-modify user-read-private"; // Define the scopes you need

  const handleLogin = () => {
    const authUrl =
      `https://accounts.spotify.com/authorize?` +
      `response_type=code&` +
      `client_id=${CLIENT_ID}&` +
      `scope=${encodeURIComponent(SCOPES)}&` +
      `redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;

    window.location.href = authUrl;
  };
  return (
    <div>
      <button onClick={handleLogin}>Login to begin creating playlists</button>
    </div>
  );
};

export default AuthButton;
