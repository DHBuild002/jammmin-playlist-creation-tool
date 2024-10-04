import React, { useState } from "react";
import TrackList from "./TrackList";
import "./styles/Playlist.css";
import { createPlaylistInUserAccount, getUserId } from "../Spotify";
// Icon List
import EditIcon from "@mui/icons-material/Edit";

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
  token,
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
  const handleEditClick = () => {
    setIsInputVisible(true);
  };

  const savePlaylist = async () => {
    if (!token) {
      console.error("No access token found. Please log in.");
      return;
    }

    try {
      const userId = await getUserId(token); // Retrieve Spotify user ID
      const trackUris = customTrackList.map(
        (track) => `spotify:track:${track.id}`
      );

      // Create playlist and add tracks
      await createPlaylistInUserAccount(
        userId,
        savedPlaylistName,
        token,
        trackUris
      );
      console.log("Playlist saved successfully.");
    } catch (error) {
      console.error("Error saving playlist:", error);
    }
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
          <EditIcon onClick={handleEditClick} className="edit-icon" />
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
