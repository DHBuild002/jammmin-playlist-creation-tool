const dotenv = require("dotenv");
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const qs = require("qs");
const querystring = require("querystring");
const app = express();



// Persist Token Data
const cookieParser = require("cookie-parser");
app.use(cookieParser());

dotenv.config({ path: "./server/variables.env" });
// app.use(cors());
// More Specific CORS Proxy config
const corsOptions = {
  origin: "http://localhost:3000", // Adjust to match your React app's origin
  methods: "GET,POST",
};

app.use(cors(corsOptions));
app.use(express.json()); // Needed to parse JSON body data from POST requests

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = "http://localhost:3001/callback";

// axios.defaults.baseURL = "http://localhost:3001";
// const SCOPES = "user-library-modify user-read-private"; // Define the scopes you need
// Verify the environment variables are loaded
console.log("Client ID:", CLIENT_ID); // Should print your Spotify client ID
console.log("Client Secret:", CLIENT_SECRET); // Should print your Spotify client secret

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
  console.log(response.data.access_token);
  return response.data.access_token;
};
app.get("/", (req, res) => {
  const access_token = req.cookies.access_token;
  if (!access_token) {
    return res.send("No Access Token found. Please login again.");
  }
  console.log("Redirecting to Homepage... /");
  res.send("Welcome: " + access_token);
});

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
// Login Path
app.get("/login", (req, res) => {
  const authUrl =
    `https://accounts.spotify.com/authorize?` +
    `response_type=code&` +
    `client_id=${CLIENT_ID}&` +
    `scope=playlist-modify-public&` +
    `redirect_uri=${REDIRECT_URI}`;

  res.redirect(authUrl); // Redirect the user to Spotify's authorization page
});

// user authentication
app.get("/callback", async (req, res) => {
  const code = req.query.code || null;
  const error = req.query.error || null;

  console.log("Callback endpoint hit with code:", req.query.code);
  if (error) {
    console.error("Issue with /callback: ", error);
    return res.send(`Callback Error: ${error}`);
  }
  if (!code) {
    return res.send("No code returned from Spotify");
  }
  try {
    const tokenResponse = await axios.post(
      "https://accounts.spotify.com/api/token",
      querystring.stringify({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: REDIRECT_URI,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    const { access_token, refresh_token, expires_in } = tokenResponse.data;

    res.cookie("access_token", access_token, { httpOnly: true, secure: true });
    res.cookie("refresh_token", refresh_token, { httpOnly: true });
    const expirationTime = Date.now() + expires_in * 1000; // Calculate expiration
    res.cookie("expires_in", expirationTime, { httpOnly: true });

    // res.json({ access_token, refresh_token, expires_in });
    res.redirect("http://localhost:3001/callback?code=" + code);
    console.log(
      "Response from accounts.spotify.com: " +
        " " +
        "Access Token: " +
        access_token +
        " " +
        " Refresh Token: " +
        refresh_token
    );
  } catch (error) {
    console.error(
      "Error getting tokens:",
      error.response ? error.response.data : error
    );
    res.send("Error getting tokens");
  }
});
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
