import React from "react";

const Track = ({ track, onAdd, onRemove, isRemoval }) => {
  const handleAdd = () => {
    console.log("Add button clicked!");
    onAdd(track);
  };

  const handleRemove = () => {
    console.log("Remove button clicked!");
    onRemove(track);
  };

  return (
    <>
      <div className="trackContainer">
        <div className="track">
          <div className="track-info">
            <h2>{track.name}</h2>
            <p>
              {track.artist} | {track.album}
            </p>
          </div>
          <div className="buttonArea">
            {/* {isRemoval ? (
              <button className="Track-action" onClick={handleRemove}>
                -
              </button>
            ) : ( */}
            <button className="Track-action" onClick={handleAdd}>
              +
            </button>
            {/* // )} */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Track;
