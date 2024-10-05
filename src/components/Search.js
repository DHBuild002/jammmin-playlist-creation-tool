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
    console.log("Access Token:", accessToken);
    console.log("Search Query: " + query);

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
        console.log(limitedResults);
        setResults(limitedResults);
      } else {
        console.error("Error fetching data from Spotify API");
        // Optionally handle token expiration or errors here
      }
    } catch (error) {
      console.error(error);
    }
  };
  // const handleAdd = (track) => {
  //   console.log("Track added:", track);
  //   onAdd(track);
  // };

  return (
    <div className="w-full p-6 flex flex-col flow-start">
      <div className="mb-5">
        <input
          type="text"
          className="w-full p-2 border rounded shadow-md"
          placeholder="Search..."
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div className="w-full mb-5">
        <button
          onClick={handleSearch}
          className="w-full bg-purple-700 border-green-500 text-white p-3 rounded-xl shadow-2xl hover:bg-purple-600 transition-all duration-300 ease-in-out"
        >
          Search
        </button>
      </div>

      {/* <div className="track-list-container">
        {results.length > 0 && (
          <ul className="track-list">
            {results.map((track) => (
              <Track
                track={{
                  id: track.id,
                  name: track.name,
                  artist: track.artists.map((artist) => artist.name).join(", "),
                  album: track.album.name,
                }}
                onAdd={onAdd}
                isRemoval={false} // Pass isRemoval prop if needed
              />
            ))}
          </ul>
        )}
      </div> */}
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
