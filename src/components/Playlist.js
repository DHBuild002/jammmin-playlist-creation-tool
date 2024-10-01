import React, { useState } from "react";
import TrackList from "./TrackList";
import "./styles/Playlist.css";

// Icon List
import EditIcon from "@mui/icons-material/Edit";
import {
  createPlaylistInUserAccount,
  addTracksToExternalCustomPlaylist,
  getUserId,
} from "../Spotify";

const Playlist = ({
  onNameChange,
  playlistName,
  customTrackList,
  saveEvent,
  savedPlaylistName,
  setSavedPlaylist,
  onRemove,
  isInitialLoad,
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
  const handlePlaylistSave = () => {
    const accessToken = localStorage.getItem("spotify_access_token");
    getUserId(accessToken)
      .then((userId) => {
        return createPlaylistInUserAccount(userId, playlistName, accessToken);
      })
      .then((playlistId) => {
        const trackURIs = customTrackList.map((track) => track.uri);
        return addTracksToExternalCustomPlaylist(
          playlistId,
          trackURIs,
          accessToken
        );
      })
      .then(() => {
        console.log("Playlist Saved Successfully");
      })
      .catch((error) => {
        console.error("Error saving playlist: ", error);
      });
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
        <TrackList tracks={customTrackList} onRemove={onRemove} />
        <button onClick={handlePlaylistSave}>Save your Playlist</button>
      </div>
    </>
  );
};

export default Playlist;
