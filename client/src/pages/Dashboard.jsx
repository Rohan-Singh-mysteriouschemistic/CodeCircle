import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleJoinRoom = () => {
    if (!user?.leetCodeId) {
      alert("❌ Please link your LeetCode ID first in your Profile");
      navigate("/profile");
      return;
    }
    navigate("/join-room");
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={() => navigate("/create-room")}>Create Room</button>
      <button onClick={handleJoinRoom}>Join Room</button>
      <button onClick={() => navigate("/rooms")} className="bg-green-600 px-4 py-2 rounded">My Rooms</button>
    </div>
  );
}
const buttonStyle = {
  padding: "1rem 2rem",
  fontSize: "1.2rem",
  background: "linear-gradient(45deg, #9D4EDD, #3BE8B0)",
  border: "none",
  borderRadius: "8px",
  color: "white",
  cursor: "pointer",
  boxShadow: "0 0 10px rgba(0,0,0,0.5)",
};
