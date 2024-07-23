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
      <div className="search">
        <h4>Search tracks on Spotify</h4>
        <input
          className="input searchBox"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tracks using Spotify API"
        />
        <button onClick={handleSearch}>Find Tracks</button>
      </div>

      <div>
        {searchResults.map((result) => (
          <div key={result.id}>
            <Track track={result} />
          </div>
        ))}
      </div>
    </>
  );
};

export default Search;
