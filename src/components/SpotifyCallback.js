import React, { useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-dom-router";

const SpotifyCallback = ({ onAccessToken }) => {
  const location = useLocation();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const code = query.get("code"); // Get the Authentication Code from the returned spotify URL, after successful login
    const error = query.get("error");

    if (error) {
      console.error("Authorization Error:", error);
      return;
    }
    if (code) {
      axios
        .post(
          "https://accounts.spotify.com/api/token",
          new URLSearchParams({
            grant_type: "authorization_code",
            code: code,
            redirect_uri: "http://localhost:3000/callback",
            client_id: process.env.client_id,
            client_secret: process.env.client_secret,
          }).toString(),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        )
        .then((response) => {
          const { access_token, refresh_token, expires_in } = response.data;
          onAccessToken(access_token, refresh_token, expires_in);
        })
        .catch((error) => {
          console.error("Error Exchanging code for token: ", error);
        });
    }
  }, [location, onAccessToken]);
  return <div>Redirecting...</div>;
};

export default SpotifyCallback;
