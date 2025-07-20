import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:5000/api/rooms/my-rooms", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setRooms(data.rooms || []))
      .catch((err) => console.error(err));
  }, [token]);

  return (
    <div className="p-8 text-white">
      <h1 className="text-3xl font-bold mb-6">🛏️ My Rooms</h1>
      {rooms.length === 0 ? (
        <p>You haven't joined any rooms yet.</p>
      ) : (
        <div className="grid gap-4">
          {rooms.map((room) => (
            <div
              key={room._id}
              className="p-4 rounded-lg bg-gray-800 border border-gray-700 shadow-lg"
            >
              <h2 className="text-xl font-semibold">{room.name}</h2>
              <p className="text-sm text-gray-400">
                Invite Code: {room.inviteCode}
              </p>

              <div className="mt-3 flex gap-3">
                {/* ✅ Go to leaderboard */}
                <button
                  onClick={() => navigate(`/leaderboard/${room._id}`)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded"
                >
                  View Leaderboard
                </button>

                {/* ✅ Go to chat */}
                <button
                  onClick={() => navigate(`/rooms/${room._id}/chat`)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                >
                  Open Chat
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
