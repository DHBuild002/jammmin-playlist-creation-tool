const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

app.get("/search", async (req, res) => {
  // const newToken = getTokenFromUrl();
  const query = req.query.query;
  try {
    const search_url = "https://api.spotify.com/v1/search";
    const response = await axios.get(search_url, {
      headers: {
        // Authorization: `Bearer ${newToken}`,
      },
      params: {
        q: query,
        type: "track",
        limit: 3,
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error("Error in /search endpoint:", error);
    res.status(500).send("Error performing search");
  }
});
// GET request for user details
app.get("/spotify-api/user", async (req, res) => {
  const { token } = req.query; // Extract the token from query parameters

  try {
    const response = await axios.get("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Return the user data
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({
      error: "Failed to fetch user details",
      details: error.message,
    });
  }
});

// POST request to create a new playlist
app.post("/spotify-api/playlists", async (req, res) => {
  const { url, token } = req.query; // Extract the URL and token
  const body = req.body; // Get the request body containing the playlist data

  try {
    const spotifyResponse = await axios.post(url, body, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    // Return the created playlist data
    res.json(spotifyResponse.data);
  } catch (error) {
    console.error("Error creating playlist:", error);
    res.status(500).json({
      error: "Failed to create playlist",
      details: error.message,
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
