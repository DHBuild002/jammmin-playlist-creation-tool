import React, { useState } from "react";
import axios from "axios";
import "./styles/Search.css";
import Track from "./Track";

const Search = ({ onSearch, onAdd }) => {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleAdd = (track) => {
    console.log("Track added:", track);
    onAdd(track);
  };

  const handleSearch = async () => {
    // Fixed Dataset manually entered as an array of tracks in the app.js file for offline testing:
    // onSearch(query).then((results) => {
    //   setSearchResults(results);
    // });
    try {
      const response = await axios.get("http://localhost:3001/search", {
        params: {
          query: query,
        },
      });
      setSearchResults(response.data.tracks.items);
    } catch (error) {
      console.error("There was an error fetching the tracks!", error);
    }
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
          <Track
            key={result.id}
            track={result}
            id={result.id}
            onAdd={handleAdd}
          />
        ))}
      </div>
    </>
  );
};

export default Search;
