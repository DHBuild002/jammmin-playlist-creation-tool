const authUrl = `https://accounts.spotify.com/authorize?client_id=${process.env.REACT_APP_SPOTIFY_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_SPOTIFY_REDIRECT_URI}&response_type=token&scope=user-read-private`;

export const loginToSpotify = () => {
  window.location.href = authUrl;
};

export const getTokenFromUrl = () => {
  return window.location.hash
    .substring(1)
    .split("&")
    .reduce((acc, item) => {
      let parts = item.split("=");
      acc[parts[0]] = decodeURIComponent(parts[1]);
      return acc;
    }, {}).access_token;
};
const token = getTokenFromUrl();
console.log("Extracted Token:", token);
