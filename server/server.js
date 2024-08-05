require('dotenv').config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const qs = require("qs");

const env_clientID = 

const app = express();
app.use(cors());

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

const getAccessToken = async() => {
    const token_url = 'https://accounts.spotify.com/api/token';
    const response = await axios.post(token_url, qs.stringify({
        grant_type: 'client_credentials'
    }), {
        headers: {
            'Authorization': `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
    return response.data.access_token;
};

app.get('/search', async(req, res) => {
    const query = req.query.query;
    const token = await getAccessToken();

    const search_url = 'https://api.spotify.com/v1/search';
    const response = await axios.get(search_url, {
        headers: {
            'Authorization': `Bearer ${token}`
        },
        params: {
            q: query,
            type: 'track',
            limit: 10
        }
    });
    res.json(response.data);
});
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})