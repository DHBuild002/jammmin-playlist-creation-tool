import React from "react";

import "./styles/Track.css";

const Track = ({ track, onAdd, onRemove, isRemoval }) => {
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
          <img
            src={track.album.images[0]?.url} // Album cover image
            alt={track.name}
            className="track-image"
          />
          <div className="track-info">
            <h2>{track.name}</h2>
            <p>
              {track.artist} | {track.album}
            </p>
          </div>
          <div className="track-info">
            <h5>{track.name}</h5> {/* Track name */}
            {<p>{track.artists.map((artist) => artist.name).join(", ")}</p>}
            {renderAction()}
          </div>
        </div>
      </div>
    </>
  );
};

export default Track;
