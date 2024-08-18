import React from "react";

import "./styles/Track.css";

const Track = ({ track, onAdd, onRemove, isRemoval }) => {
  // Spotify API Specific Variables
  const { album, artists, name } = track;

  // Spotify API specific variables
  const albumName = album?.name || "Album not found";
  const artistName = artists?.[0]?.name || "Artist not found";

  // Test Data
  // const testAlbum = album?.name;
  // const testArtist = artist?.name;

  if (!track) {
    return null; // or render a fallback UI
  }

  const handleAdd = () => {
    onAdd(track);
  };
  const handleRemove = () => {
    console.log("Remove Clicked");
    onRemove(track);
  };

  const renderAction = () => {
    if (isRemoval) {
      return (
        <button className="track-action" onClick={handleRemove}>
          Remove
        </button>
      );
    }
    return (
      <button className="track-action" onClick={handleAdd}>
        Add
      </button>
    );
  };
  return (
    <>
      <div className="trackContainer">
        <div className="track">
          <div className="track-info">
            <h2>{name}</h2>
            <p>
              {artistName} | {albumName}
              {/* {testArtist} | {testAlbum} */}
            </p>
            {renderAction()}
          </div>
        </div>
      </div>
    </>
  );
};

export default Track;
