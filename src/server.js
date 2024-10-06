const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(cors());

app.get("/spotify-api", async (req, res) => {
  const { url, token } = req.query;
  try {
    const spotifyResponse = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const data = await spotifyResponse.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data from Spotify" });
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
