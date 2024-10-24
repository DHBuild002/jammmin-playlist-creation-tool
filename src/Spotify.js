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
  // const hash = window.location.hash.substring(1);
  // const params = new URLSearchParams(hash);

  // params.get("access_token");
};

export const getUserProfile = async (accessToken) => {
  try {
    const response = await fetch(
      `https://api.spotify.com/v1/me`, // Fixing the URL structure
      {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Use Authorization header
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch user profile");
    }

    const data = await response.json();
    return {
      id: data.id,
      username: data.display_name || "User",
    };
  } catch (error) {
    throw new Error(`Error fetching user profile: ${error.message}`);
  }
};

export const createPlaylistInUserAccount = async (
  userId,
  playlistName,
  accessToken,
  trackUris
) => {
  // console.log(playlistName);
  // Check if playlistName is undefined or missing
  if (!playlistName || playlistName.trim() === "") {
    console.error("Playlist name is required.");

    return;
  }
  console.log(trackUris.length);
  if (trackUris.length === 0) {
    console.error("No tracks provided");
  }

  try {
    const url = `https://api.spotify.com/v1/users/${userId.id}/playlists?url=`;
    const body = {
      name: playlistName,
      description: "Created from Jammmin app",
      public: false,
    };

    const response = await fetch(`${url}&token=${accessToken}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(body),
    });

    const playlistData = await response.json();
    const playlistId = playlistData.id;
    await addTracksToPlaylist(playlistId, trackUris, accessToken);
    console.log(`Tracks added to playlist with ID: ${playlistData.id}`);
  } catch (error) {
    console.error("Error: ", error);
  }
};

const addTracksToPlaylist = async (playlistId, trackUris, accessToken) => {
  const url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;

  try {
    await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uris: trackUris,
      }),
    });
  } catch (error) {
    console.error("Error adding tracks", error);
  }
};
