import React, { useState } from "react";
import "./App.css";
import TrackList from "./components/TrackList";
import Playlist from "./components/Playlist";
import Search from "./components/Search";

function App() {
  // Set the initial state of tracks
  const [tracks] = useState([
    {
      id: 1,
      name: "Song One",
      artist: "Artist 1",
      album: "Album 1",
    },
    {
      id: 2,
      name: "Song Two",
      artist: "Artist 2",
      album: "Album 2",
    },
    {
      id: 3,
      name: "Song Three",
      artist: "Artist 3",
      album: "Album 3",
    },
  ]);
  const [playlistName, setPlaylistName] = useState("");
  const [playlistTracks, setPlaylistTracks] = useState([
    {
      id: 0,
      name: "Default Playlist Entry",
      artist: "Artist X",
      album: "Album Y",
    },
  ]);
  const [savedPlaylistName, setSavedPlaylistName] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const onSearch = (query) => {
    const lowercaseQuery = query.toLowerCase();

    const searchResults = tracks.filter((track) => {
      const lowercaseName = track.name.toLowerCase();
      const lowercaseArtist = track.artist.toLowerCase();
      const lowercaseAlbum = track.album.toLowerCase();

      return (
        lowercaseName.includes(lowercaseQuery) ||
        lowercaseArtist.includes(lowercaseQuery) ||
        lowercaseAlbum.includes(lowercaseQuery)
      );
    });
    return Promise.resolve(searchResults);
  };
  const addTrack = (track) => {
    setPlaylistTracks((prevTracks) => {
      if (!prevTracks.some((t) => t.id === track.id)) {
        return [...prevTracks, track];
      }
      return prevTracks;
    });
  };
  const removeTrack = (track) => {
    setPlaylistTracks((prevTracks) =>
      prevTracks.filter((t) => t.id !== track.id)
    );
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
        <h2>Jammmin - Share your playlist with friends</h2>
      </header>
      <div className="row">
        <div className="column">
          <h2>Add Tracks to your Playlist</h2>
          <Search onSearch={onSearch} />

          <TrackList tracks={searchResults} onAdd={addTrack} />
        </div>

        <div className="column">
          <Playlist
            savedPlaylistName={savedPlaylistName}
            playlistName={playlistName}
            playlistTracks={playlistTracks}
            onNameChange={updatePlaylistName}
            saveEvent={savePlaylistName}
            onRemove={removeTrack}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
