import React from "react";

function TrackList({ tracks }) {
  if (!tracks.length) return null;

  return (
    <div className="w-full max-w-xl bg-gray-800 p-6 rounded-lg shadow-lg">
      {tracks.map((track, index) => (
        <div key={track.id} className="flex items-center mb-4">
          <span className="text-lg font-bold w-8 text-center">{index + 1}</span>
          <img
            src={track.album.images[2]?.url}
            alt={track.name}
            className="w-12 h-12 rounded mr-4"
          />
          <div>
            <p className="font-semibold">{track.name}</p>
            <p className="text-sm text-gray-400">
              {track.artists.map(a => a.name).join(", ")}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TrackList;
