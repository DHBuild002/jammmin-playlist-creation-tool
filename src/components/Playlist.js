import React from "react";
import TrackList from "./TrackList";
import "./styles/Playlist.css";

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
        <h2 className="custom-title">{savedPlaylistName}</h2>
        <div className="playlistTitle">
          <input
            value={playlistName}
            onChange={handleNameChange}
            onFocus={handleFocus}
            placeholder="Give your playlist a name"
          />
          <button onClick={handleSave}>Save</button>
        </div>
      </div>
      <h2>TrackList</h2>
      <TrackList tracks={playlistTracks} onRemove={onRemove} />
    </>
  );
};

export default Playlist;
