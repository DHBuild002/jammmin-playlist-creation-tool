import React from "react";

import "./styles/Track.css";

const Track = ({ track, artist, album, onAdd, onRemove, isRemoval }) => {
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
          -
        </button>
      );
    }
    return (
      <button className="track-action" onClick={handleAdd}>
        +
      </button>
    );
  };
  return (
    <>
      <div className="trackContainer">
        <div className="track">
            <h2 className="track-name">{track.name}</h2>
            <div className="container">
              <p className="track-artist">{track.artist}</p>
              <p className="track-album">{track.album}</p>
            </div>
            {renderAction()}
          </div>
        </div>
    </>
  );
};

export default Track;
