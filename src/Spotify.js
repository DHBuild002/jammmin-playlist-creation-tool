const authUrl = `https://accounts.spotify.com/authorize?client_id=${process.env.REACT_APP_SPOTIFY_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_SPOTIFY_REDIRECT_URI}&response_type=token&scope=playlist-modify-public%20playlist-modify-private%20user-read-private`;

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

// // Logic for Creating, Adding playlists to the Spotify API
// export const createPlaylistInUserAccount = async (
//   user_id,
//   playlistName,
//   accessToken
// ) => {
//   console.log(user_id);
//   const response = await fetch(
//     `https://api.spotify.com/v1/users/${user_id}/playlists`,
//     {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         name: playlistName,
//         description: "Created from Jammmin app",
//         public: false,
//       }),
//     }
//   );
//   if (!response.ok) {
//     const errorData = await response.json();
//     console.error("Error creating playlist:", errorData);
//     throw new Error(`Failed to create playlist: ${response.statusText}`);
//   }
//   const data = await response.json();
//   return data.id;
// };
// const savePlaylist = async () => {
//   const trackUris = customTrackList.map((track) => `spotify:track:${track.id}`); // Map to Spotify URIs

//   // Make your API call to create the playlist using trackUris
//   await createPlaylistInUserAccount(
//     userId,
//     savedPlaylistName,
//     accessToken,
//     trackUris
//   );
// };

// In your createPlaylistInUserAccount function, you'd adjust to handle the URIs
export const createPlaylistInUserAccount = async (
  userId,
  playlistName,
  accessToken,
  trackUris
) => {
  const response = await fetch(
    `https://api.spotify.com/v1/users/${userId}/playlists`,
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

  const playlistData = await response.json();

  // Now add tracks to the newly created playlist
  if (playlistData.id) {
    await addTracksToPlaylist(playlistData.id, trackUris, accessToken);
  }
};

const addTracksToPlaylist = async (playlistId, trackUris, accessToken) => {
  await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      uris: trackUris,
    }),
  });
};
