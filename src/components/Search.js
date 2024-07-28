import React, { useState } from "react";
import "./styles/Search.css";
import Track from "./Track";

const Search = ({ onSearch }) => {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const handleSearch = () => {
    onSearch(query).then((results) => {
      setSearchResults(results);
    });
  };

  return (
    <>
      <h4>Search tracks on Spotify</h4>
      <div className="search">
        <input
          className="input searchBox"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tracks using Spotify API"
        />
        <button onClick={handleSearch}>Find Tracks</button>
      </div>
      
      <div className="track-list">
        {searchResults.map((result) => (
          <Track track={result} id={result.id} />
        ))}
      </div>
    </>
  );
};

export default Search;
