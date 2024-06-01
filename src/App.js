import React, { useState } from "react";
import "./App.css";
import Playlist from "./components/Playlist";
import TrackList from "./components/TrackList";

function App() {
  // Set the initial state of tracks
  const [tracks] = useState([
    {
      id: 1,
      name: "Add this Song",
      artist: "Artist 1",
      album: "Album 1",
    },
    {
      id: 2,
      name: "Add this Song 2",
      artist: "Artist 2",
      album: "Album 2",
    },
    {
      id: 3,
      name: "Add this Song 3",
      artist: "Artist 3",
      album: "Album 3",
    },
  ]);
  const [playlistName, setPlaylistName] = useState("Enter a Playlist Name");
  const [playlistTracks, setPlaylistTracks] = useState([
    {
      id: 0,
      name: "Default Playlist Entry",
      artist: "Artist X",
      album: "Album Y",
    },
  ]);
  const [savedPlaylistName, setSavedPlaylistName] = useState("");

  const addTrack = (track) => {
    setPlaylistTracks((prevTracks) => {
      if (!prevTracks.some((t) => t.id === track.id)) {
        return [...prevTracks, track];
      }
      return prevTracks;
    });
  };
  const updatePlaylistName = (name) => {
    setPlaylistName(name);
  };

  const savePlaylistName = (name) => {
    setSavedPlaylistName(name);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Jammmin - Share your playlist with friends</h1>
      </header>
      <div className="row">
        <div className="column">
          <h2>Add Tracks to your Playlist</h2>
          <TrackList tracks={tracks} onAdd={addTrack} />
        </div>

        <div className="column">
          <Playlist
            savedPlaylistName={savedPlaylistName}
            playlistName={playlistName}
            playlistTracks={playlistTracks}
            onNameChange={updatePlaylistName}
            saveEvent={savePlaylistName}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
