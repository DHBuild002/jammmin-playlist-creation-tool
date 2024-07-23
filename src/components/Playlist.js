import React from "react";
import TrackList from "./TrackList";
import "./styles/Playlist.css";

const Playlist = ({
  playlistName,
  playlistTracks,
  onNameChange,
  saveEvent,
  savedPlaylistName,
}) => {
  const handleFocus = (e) => {
    if (e.target.value) {
      e.target.value = " ";
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
        <div className="playlistTitle">
          <input
            value={playlistName}
            onChange={handleNameChange}
            onFocus={handleFocus}
            placeholder="Give your playlist a name"
          />
          <button onClick={handleSave}>Save</button>
        </div>
        <h2>{savedPlaylistName}</h2>
      </div>
      <TrackList tracks={playlistTracks} />
    </>
  );
};

export default Playlist;
