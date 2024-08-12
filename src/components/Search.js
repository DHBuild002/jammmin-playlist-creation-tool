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
      const returnedTracks = Array.isArray(response.data.tracks.items)
        ? response.data.tracks.items
        : [];
      if (Array.isArray(returnedTracks)) {
        setSearchResults(returnedTracks); // Only set state if it's an array
        returnedTracks.forEach((track) => {
          if (track.artists && Array.isArray(track.artists)) {
            console.log("Artist name:", track.artists[0].name);
          } else {
            console.error("No artists found for track:", track.name);
          }
        });
      } else {
        console.error("Expected an array, but got:", typeof returnedTracks);
      }
      console.log("Search results:", returnedTracks); // Log for debugging
      console.log(
        "Type of returned data:",
        Array.isArray(response.data.tracks.items)
      ); // Should log 'true'

      // setSearchResults(returnedTracks);
    } catch (error) {
      if (error.response) {
        // The request was made, and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Error data:", error.response.data);
        console.error("Error status:", error.response.status);
        console.error("Error headers:", error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.error("No response received:", error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error setting up request:", error.message);
      }
      console.error("Error config:", error.config);
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
        {searchResults.length > 0 ? (
          searchResults.map((result) => (
            <Track
              key={result.id}
              track={result.name}
              artist={
                result.artists && result.artists[0]
                  ? result.artists[0].name
                  : "Unknown Artist"
              }
              album={result.album.name}
              onAdd={handleAdd}
            />
          ))
        ) : (
          <p>No results found</p>
        )}
      </div>
    </>
  );
};

export default Search;
