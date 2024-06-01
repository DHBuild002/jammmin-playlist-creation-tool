import React from "react";
import TrackList from "./TrackList";

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
    <div className="playlist">
      <input
        value={playlistName}
        onChange={handleNameChange}
        onFocus={handleFocus}
        placeholder="Give your playlist a name"
      />
      <button onClick={handleSave}>Save</button>
      <h2>{savedPlaylistName}</h2>

      <TrackList tracks={playlistTracks} />
    </div>
  );
};

export default Playlist;
