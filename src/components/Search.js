import React, { useState, useEffect } from "react";
import Track from "./Track";

const Search = ({ onAdd }) => {
  const [query, setQuery] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [results, setResults] = useState([]);
  // Fetch the access token from URL or local storage
  useEffect(() => {
    const token =
      localStorage.getItem("spotify_access_token") || getTokenFromUrl();
    if (token) {
      setAccessToken(token);
      localStorage.setItem("spotify_access_token", token);
      window.location.hash = ""; // Clear the token from the URL
    }
  }, []);
  // const handleSearch = () => {
  //   onSearch(query).then((results) => {
  //     setSearchResults(results);
  //   });
  const getTokenFromUrl = () => {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    return params.get("access_token");
  };
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return;
    console.log("Access Token:", accessToken);

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
      setResults(data);
    } else {
      console.error("Error fetching data from Spotify API");
      // Optionally handle token expiration or errors here
    }
    const handleAdd = (track) => {
      console.log("Track added:", track);
      onAdd(track);
    };
  };

  return (
    <div>
      <h1>Spotify Search</h1>
      <input
        type="text"
        placeholder="Search for tracks, artists, albums..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button type="submit" onClick={handleSearch}>
        Search
      </button>

      <div>
        {results.tracks && (
          <div>
            <h2>Tracks</h2>
            <ul>
              {results.tracks.items.map((track) => (
                <li key={track.id}>
                  {track.name} by{" "}
                  {track.artists.map((artist) => artist.name).join(", ")}
                </li>
              ))}
            </ul>
          </div>
        )}

        {results.artists && (
          <div>
            <h2>Artists</h2>
            <ul>
              {results.artists.items.map((artist) => (
                <li key={artist.id}>{artist.name}</li>
              ))}
            </ul>
          </div>
        )}

        {results.albums && (
          <div>
            <h2>Albums</h2>
            <ul>
              {results.albums.items.map((album) => (
                <li key={album.id}>
                  {album.name} by{" "}
                  {album.artists.map((artist) => artist.name).join(", ")}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
