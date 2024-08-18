require("dotenv").config({ path: "./server/variables.env" });
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const qs = require("qs");
const querystring = require("querystring");

const app = express();
app.use(cors());

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = "http://localhost:3000/callback";

const getAccessToken = async () => {
  const token_url = "https://accounts.spotify.com/api/token";
  const response = await axios.post(
    token_url,
    qs.stringify({
      grant_type: "client_credentials",
    }),
    {
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${CLIENT_ID}:${CLIENT_SECRET}`
        ).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
  return response.data.access_token;
};

app.get("/search", async (req, res) => {
  const query = req.query.query;
  try {
    const token = await getAccessToken();

    const search_url = "https://api.spotify.com/v1/search";
    const response = await axios.get(search_url, {
      headers: {
        Authorization: `Bearer ${token}`,
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
// user authentication
app.get("/callback", async (req, res) => {
  const code = req.query.code || null;
  const error = req.query.error || null;
  if (error) {
    return res.send(`Callback Error: ${error}`);
  }
  if (!code) {
    return res.send("No code returned from Spotify");
  }
  try {
    const tokenResponse = await axios.post(
      "https://accounts.spotify.com",
      querystring.stringify({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: REDIRECT_URI,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-url-encoded",
        },
      }
    );
    const { access_token, refresh_token, expires_in } = tokenResponse.data;

    res.redirect(
      `/?access_token=${access_token}&refresh_token=${refresh_token}&expires_in=${expires_in}`
    );
  } catch (error) {
    console.error("Error getting tokens:", error);
    res.send("Error getting tokens");
  }
});
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
