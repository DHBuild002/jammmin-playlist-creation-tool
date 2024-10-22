import React, { useState, useEffect } from "react";
import TrackList from "./TrackList";

const Search = ({ onAdd }) => {
  const [query, setQuery] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [results, setResults] = useState([]);
  // Fetch the access token from URL or local storage
  useEffect(() => {
    const token = localStorage.getItem("spotify_access_token");
    if (token) {
      setAccessToken(token);
      localStorage.setItem("spotify_access_token", token);
      window.location.hash = ""; // Clear the token from the URL
    }
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return;

    try {
      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(
          query
        )}&type=track,artist,album`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        // Limit results to 3
        const limitedResults = data.tracks.items.slice(0, 3);
        setResults(limitedResults);
      } else {
        console.error("Error fetching data from Spotify API");
        // Optionally handle token expiration or errors here
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="w-full p-6 flex flex-col flow-start">
      <div className="mb-5">
        <input
          type="text"
          className="w-full p-3 text-xs placeholder-size-sm border border-purple-400 rounded-full shadow-sm focus:border-purple-700 focus:border-2 focus:outline-none cursor-pointer"
          placeholder="Search..."
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div className="w-full mb-5">
        <button
          onClick={handleSearch}
          className="w-full uppercase bg-purple-700 border border-white text-white p-2 rounded-lg hover:bg-purple-600 focus:outline-none"
        >
          Search
        </button>
      </div>
      <div className="track-list-container">
        {results.length > 0 && (
          <TrackList
            tracks={results.map((track) => ({
              id: track.id,
              name: track.name,
              artist: track.artists.map((artist) => artist.name).join(", "),
              album: track.album.name,
              localId: `${track.id}-${Date.now()}`, // Adding a unique localId
            }))}
            isRemoval={false}
            onAdd={onAdd}
            // onRemove={onRemove}
          />
        )}
      </div>
    </div>
  );
};

export default Search;
