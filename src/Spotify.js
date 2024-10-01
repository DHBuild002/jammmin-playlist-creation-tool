const authUrl = `https://accounts.spotify.com/authorize?client_id=${process.env.REACT_APP_SPOTIFY_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_SPOTIFY_REDIRECT_URI}&response_type=token&scope=user-read-private`;

export const loginToSpotify = () => {
  window.location.href = authUrl;
};

export const getTokenFromUrl = () => {
  // return window.location.hash
  //   .substring(1)
  //   .split("&")
  //   .reduce((acc, item) => {
  //     let parts = item.split("=");
  //     acc[parts[0]] = decodeURIComponent(parts[1]);
  //     return acc;
  //   }, {}).access_token;

  // Writing the above without using a key for the access_token:
  return window.location.hash
    .substring(1)
    .split("&")
    .map((item) => item.split("="))
    .find((parts) => parts[0] === "access_token")[1];
};

export const getUserId = async (accessToken) => {
  const response = await fetch("https://api.spotify.com/v1/me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const data = await response.json();
  return data.id;
};

// Logic for Creating, Adding playlists to the Spotify API
export const createPlaylistInUserAccount = async (
  userId,
  playlistName,
  accessToken
) => {
  console.log(userId);
  const response = await fetch(
    `https://api.spotify.com/v1/users/${userId}/playlist`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: playlistName,
        description: "Created from Jammmin app",
        public: false,
      }),
    }
  );
  const data = await response.json();
  return data.id;
};
export const addTracksToExternalCustomPlaylist = async (
  playlistId,
  trackURIs,
  accessToken
) => {
  await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      uris: trackURIs,
    }),
  });
};
