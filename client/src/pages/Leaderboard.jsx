import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Leaderboard() {
  const { roomId } = useParams();
  const [members, setMembers] = useState([]);
  const [roomName, setRoomName] = useState("");

  useEffect(() => {
    fetch(`http://localhost:5000/api/leetcode/room-leaderboard/${roomId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setRoomName(data.roomName || "");
        setMembers(data.members || []);
      })
      .catch((err) => console.error(err));
  }, [roomId]);

  return (
    <div style={{ padding: "2rem", color: "white" }}>
      <h1 className="text-3xl mb-6 font-bold">🏠 Room Leaderboard: {roomName}</h1>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-600">
            <th className="text-left py-2">Username</th>
            <th className="text-left py-2">Solved</th>
            <th className="text-left py-2">Contest Rating</th>
            <th className="text-left py-2">Rank</th>
          </tr>
        </thead>
        <tbody>
          {members.map((m, i) => (
            <tr key={i} className="border-b border-gray-700">
              <td className="py-2">{m.username}</td>
              <td>{m.totalSolved}</td>
              <td>{m.contestRating}</td>
              <td>{m.globalRank ?? "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
