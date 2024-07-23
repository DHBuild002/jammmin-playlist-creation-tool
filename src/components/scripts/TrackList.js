import React from "react";
import "../styles/TrackList.css";

import Track from "./Track";

const TrackList = (props) => {
  const tracks = Array.isArray(props.tracks) ? props.tracks : [];

  return (
    <div className="TrackList">
      {tracks.map((track) => {
        return (
          <Track
            track={track}
            key={track.id}
            onAdd={props.onAdd}
            isRemoval={props.isRemoval}
            onRemove={props.onRemove}
          />
        );
      })}
    </div>
  );
};

export default TrackList;
