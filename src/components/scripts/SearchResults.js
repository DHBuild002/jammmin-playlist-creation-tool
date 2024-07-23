import React, { useState } from "react";
import "../styles/Search.css";
import TrackList from "./TrackList.js";

const SearchResults = (props) => {
  return (
    <div className="SearchResults">
      <h2>Results</h2>
      <TrackList track={props.searchResults} onAdd={props.onAdd} />
    </div>
  );
};

export default SearchResults;
