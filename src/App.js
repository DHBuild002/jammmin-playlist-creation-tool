import React, { useState } from "react";
import "./App.css";
import TrackList from "./components/TrackList";

import SearchBar from "./components/SearchBar.js";

function App() {
  // Set the initial state of tracks
  const [tracks] = useState([
    {
      id: 1,
      name: "Song 1",
      artist: "Artist 1",
      album: "Album 1",
    },
    {
      id: 2,
      name: "Song 2",
      artist: "Artist 2",
      album: "Album 2",
    },
    {
      id: 3,
      name: "Song 3",
      artist: "Artist 3",
      album: "Album 3",
    },
  ]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Jammmin - Share your playlist with friends</h1>
      </header>
      <SearchBar />

      {/* Tracks Data goes below here */}
      <TrackList tracks={tracks} />
    </div>
  );
}

export default App;
