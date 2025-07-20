import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function CreateRoom() {
  const { token } = useAuth();
  const [roomName, setRoomName] = useState("");
  const [message, setMessage] = useState("");

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/rooms/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: roomName }),
      });
      const data = await res.json();
      if (!res.ok) return setMessage(data.message || "Error creating room");
      setMessage(`✅ Room created! Invite code: ${data.room.inviteCode}`);
      setRoomName("");
    } catch (err) {
      console.error(err);
      setMessage("Server error");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Create a Room</h1>
      <form onSubmit={handleCreate}>
        <input
          type="text"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          placeholder="Room Name"
          required
        />
        <button type="submit">Create Room</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
