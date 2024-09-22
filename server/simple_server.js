require("dotenv").config({ path: "./variables.env" });

const express = require("express");
const axios = require("axios");
const cors = require("cors");
const querystring = require("querystring");

const app = express();
app.use(cors());
const port = 3001;

const client_id = process.env.CLIENT_ID; // Replace with your client ID
const client_secret = process.env.CLIENT_SECRET; // Replace with your client secret
const redirect_uri = "http://localhost:3001/callback";

app.get("/login", (req, res) => {
  const scope = "user-read-private user-read-email";
  const queryParams = querystring.stringify({
    client_id,
    response_type: "code",
    redirect_uri,
    scope,
  });

  res.redirect(`https://accounts.spotify.com/authorize?${queryParams}`);
});

app.get("/callback", async (req, res) => {
  console.log("hi");
  const code = req.query.code || null;
  const data = querystring.stringify({
    grant_type: "authorization_code",
    code,
    redirect_uri,
    client_id,
    client_secret,
  });

  try {
    const tokenResponse = await axios.post(
      "https://accounts.spotify.com/api/token",
      data,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const { access_token, refresh_token } = tokenResponse.data;
    res.redirect(`http://localhost:3000/`);
    console.log("Access Token Returned! " + access_token);
    console.log("Refresh Token Returned! " + refresh_token);
  } catch (error) {
    res.send(error);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log("Client ID:", process.env.CLIENT_ID);
});
