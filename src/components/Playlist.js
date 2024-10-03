import React, { useState } from "react";
import TrackList from "./TrackList";
import "./styles/Playlist.css";

// Icon List
import EditIcon from "@mui/icons-material/Edit";
import { createPlaylistInUserAccount } from "../Spotify.js";

const Playlist = ({
  onNameChange,
  playlistName,
  customTrackList,
  saveEvent,
  savedPlaylistName,
  setSavedPlaylist,
  onRemove,
  isInitialLoad,
  userId,
  accessToken,
}) => {
  // Handle initial state class for save playlist name:
  const savedNameClass = isInitialLoad ? "initial-state-input" : "";
  const handleFocus = (e) => {
    if (e.target.value) {
      e.target.value = "";
    }
  };
  const handleNameChange = (e) => {
    onNameChange(e.target.value);
  };
  const handleNameSave = () => {
    saveEvent(playlistName);
    setIsInputVisible(false);
  };
  const handledEditClick = () => {
    setIsInputVisible(true);
  };
  // const handlePlaylistSave = () => {
  //   const accessToken = localStorage.getItem("spotify_access_token");
  //   getUserId(accessToken)
  //     .then((userId) => {
  //       return createPlaylistInUserAccount(userId, playlistName, accessToken);
  //     })
  //     .then((playlistId) => {
  //       const trackURIs = customTrackList.map((track) => track.uri);
  //       return addTracksToExternalCustomPlaylist(
  //         playlistId,
  //         trackURIs,
  //         accessToken
  //       );
  //     })
  //     .then(() => {
  //       console.log("Playlist Saved Successfully");
  //     })
  //     .catch((error) => {
  //       console.error("Error saving playlist: ", error);
  //     });
  // };
  // // In your createPlaylistInUserAccount function, you'd adjust to handle the URIs
  // const createPlaylistInUserAccount = async (
  //   userId,
  //   playlistName,
  //   accessToken,
  //   trackUris
  // ) => {
  //   const response = await fetch(
  //     `https://api.spotify.com/v1/users/${userId}/playlists`,
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

  //   const playlistData = await response.json();

  //   // Now add tracks to the newly created playlist
  //   if (playlistData.id) {
  //     await addTracksToPlaylist(playlistData.id, trackUris, accessToken);
  //   }
  // };

  // const addTracksToPlaylist = async (playlistId, trackUris, accessToken) => {
  //   await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
  //     method: "POST",
  //     headers: {
  //       Authorization: `Bearer ${accessToken}`,
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       uris: trackUris,
  //     }),
  //   });
  // };

  // export const addTracksToExternalCustomPlaylist = async (
  //   user_id,
  //   playlist_id,
  //   trackURIs,
  //   accessToken
  // ) => {
  //   await fetch(
  //     `https://api.spotify.com/v1/users/${user_id}/playlists/${playlist_id}/tracks`,
  //     {
  //       method: "POST",
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         uris: trackURIs,
  //       }),
  //     }
  //   );
  // };

  const savePlaylist = async () => {
    const trackUris = customTrackList.map(
      (track) => `spotify:track:${track.id}`
    ); // Map to Spotify URIs

    // Make your API call to create the playlist using trackUris
    await createPlaylistInUserAccount(
      userId,
      savedPlaylistName,
      accessToken,
      trackUris
    );
  };

  const [isInputVisible, setIsInputVisible] = useState(false);
  return (
    <>
      <div className="playlist">
        <div className="custom-title-container">
          <h2
            className={`custom-title ${savedNameClass}`}
            placeholder="New Playlist"
          >
            {savedPlaylistName}
          </h2>
          <EditIcon onClick={handledEditClick} className="edit-icon" />
        </div>
        {isInputVisible && (
          <div>
            <div className="row input-area">
              <input
                className="input-custom-title"
                value={playlistName}
                onChange={handleNameChange}
                onFocus={handleFocus}
              />
            </div>
            <div className="playlistTitle">
              <button onClick={handleNameSave}>Save</button>
            </div>
          </div>
        )}
      </div>
      <div className="customPlaylistArea">
        {/* <h2>TrackList</h2> */}
        <TrackList
          tracks={customTrackList}
          onRemove={onRemove}
          isRemoval={true}
        />
        <button onClick={savePlaylist}>Save your Playlist</button>
      </div>
    </>
  );
};

export default Playlist;
