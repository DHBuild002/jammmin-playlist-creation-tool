import React from "react";
import TrackList from "./TrackList";
import "./styles/Playlist.css";

// Icon List
import EditIcon from "@mui/icons-material/Edit";

const Playlist = ({
  playlistName,
  playlistTracks,
  onNameChange,
  saveEvent,
  savedPlaylistName,
  onRemove,
}) => {
  const handleFocus = (e) => {
    if (e.target.value) {
      e.target.value = "";
    }
  };
  const handleNameChange = (e) => {
    onNameChange(e.target.value);
  };
  const handleSave = () => {
    saveEvent(playlistName);
  };
  return (
    <>
      <div className="playlist">
        <h2 className="custom-title">{savedPlaylistName}</h2>
        <div className="row input-area">
          <input
            className="input-custom-title"
            value={playlistName}
            onChange={handleNameChange}
            onFocus={handleFocus}
            placeholder="Give your playlist a name"
          />
          <EditIcon onClick={handleNameChange} />
        </div>
        <div className="playlistTitle">
          <button onClick={handleSave}>Save</button>
        </div>
      </div>
      <h2>TrackList</h2>
      <TrackList tracks={playlistTracks} onRemove={onRemove} />
    </>
  );
};

export default Playlist;
