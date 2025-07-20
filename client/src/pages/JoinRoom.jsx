import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function JoinRoom() {
  const { token } = useAuth();
  const [inviteCode, setInviteCode] = useState("");
  const [message, setMessage] = useState("");

  const handleJoin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/rooms/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ inviteCode }),
      });
      const data = await res.json();
      if (!res.ok) return setMessage(data.message || "Error joining room");
      setMessage(`✅ Joined room: ${data.room.name}`);
      setInviteCode("");
    } catch (err) {
      setMessage("Server error");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Join a Room</h1>
      <form onSubmit={handleJoin}>
        <input
          type="text"
          value={inviteCode}
          onChange={(e) => setInviteCode(e.target.value)}
          placeholder="Invite Code"
          required
        />
        <button type="submit">Join Room</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
