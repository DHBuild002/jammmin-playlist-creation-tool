const express = require("express");
const axios = require("axios");
const cors = require("cors");
const qs = require("qs");

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
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
