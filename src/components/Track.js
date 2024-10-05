import React from "react";

// import "./styles/Track.css";

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
        <button
          className="flex items-center justify-center w-16 h-full bg-purple-500 text-white text-3xl rounded-sm shadow-lg hover:bg-purple-600 transition-all duration-300"
          onClick={handleRemove}
        >
          -
        </button>
      );
    }
    return (
      <button
        className="flex items-center justify-center w-16 h-full bg-purple-500 text-white text-3xl rounded-sm shadow-lg hover:bg-purple-600 transition-all duration-300"
        onClick={handleAdd}
      >
        +
      </button>
    );
  };
  return (
    <>
      <div className="container mx-auto bg-pink-400 m-2 rounded">
        <div className="border-radius-20 flex flex-row">
          <div className="container text-left w-full m-3">
            <h2 className="font-bold text-left">{track.name}</h2>
            <p className="flex flex-column text-xs">
              {track.artist} {track.album}
            </p>
          </div>
          <div className="flex items-center justify-center max-h-fit">
            {renderAction()}
          </div>
        </div>
      </div>
    </>
  );
};

export default Track;
