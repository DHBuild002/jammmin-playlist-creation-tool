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

export const getUserProfile = async (accessToken) => {
  try {
    const response = await fetch(
      `http://localhost:3001/spotify-api/user?token=${accessToken}`
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
  accessToken
) => {
  const url = `https://api.spotify.com/v1/users/${userId.id}/playlists`;
  const body = {
    name: playlistName,
    description: "Created from Jammmin app",
    public: false,
  };

  const response = await fetch(
    `http://localhost:3001/spotify-api/playlists?url=${url}&token=${accessToken}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    // Attempt to parse error details if available
    const errorMessage = `Failed to create playlist: ${
      response.statusText || "Unknown error"
    }`;
    let errorData;
    try {
      errorData = await response.json(); // Check for detailed error response
      console.error("Detailed error response from Spotify:", errorData);
      throw new Error(errorData.error?.message || errorMessage);
    } catch (error) {
      // Handle case where response is not in JSON format
      throw new Error(errorMessage);
    }
  }

  const playlistData = await response.json();

  return playlistData; // Return the created playlist data
};

const addTracksToPlaylist = async (playlistId, trackUris, accessToken) => {
  await fetch(
    `http://localhost:3001/spotify-api?url=https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uris: trackUris,
      }),
    }
  );
};
