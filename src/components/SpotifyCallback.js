import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const SpotifyCallback = ({ onAccessToken }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const expires_in = useState();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const code = query.get("code"); // Get the Authentication Code from the returned spotify URL, after successful login
    const error = query.get("error");

    if (error) {
      console.error("Authorization Error:", error);
      return;
    }
    if (code) {
    const interval = setInterval(() => {
      axios
        .post(`http://localhost:3001/callback`, { code })
        .then((response) => {
          const { access_token, refresh_token, expires_in } = response.data;
          console.log(response.data);

          if (onAccessToken) {
            console.log("Received Access Token in Callback:", access_token);

            onAccessToken(access_token, refresh_token, expires_in);

            navigate("/");
          }

          // Store tokens in localStorage (or state)
          localStorage.setItem("access_token", access_token);
          localStorage.setItem("refresh_token", refresh_token);
          localStorage.setItem("expires_in", expires_in);

          // Redirect to homepage after successful token retrieval
        })
        .catch((error) => {
          console.error("Error exchanging code for token: ", error);
        });
    }, (expires_in - 60) * 1000)
    return () => clearInterval(interval)
  }, [location, navigate, onAccessToken]});
}


export default SpotifyCallback;
