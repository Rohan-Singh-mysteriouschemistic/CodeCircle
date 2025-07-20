// src/pages/ProfilePage.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function ProfilePage() {
  const { user, token } = useAuth();
  const [leetCodeId, setLeetCodeId] = useState(user?.leetCodeId || "");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalSolved: user?.totalSolved || 0,
    contestRating: user?.contestRating || 0,
    globalRank: user?.globalRank || null,
    contestsAttended: user?.contestsAttended || 0,
  });

  const handleSync = async () => {
    if (!leetCodeId.trim()) {
      setMessage("❌ Please enter a LeetCode username");
      return;
    }
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://localhost:5000/api/leetcode/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ leetCodeId }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage(`❌ ${data.message || "Error updating profile"}`);
      } else {
        setMessage(`✅ LeetCode synced successfully for ${leetCodeId}`);

        // 🔄 Refresh user data
        const meRes = await fetch("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const freshUser = await meRes.json();

        // Update stats in state
        setStats({
          totalSolved: freshUser.totalSolved,
          contestRating: freshUser.contestRating,
          globalRank: freshUser.globalRank,
          contestsAttended: freshUser.contestsAttended,
        });
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">👤 Profile</h1>
      <div className="bg-gray-800 p-6 rounded-lg text-white space-y-4">
        <p><strong>Username:</strong> {user?.username}</p>
        <p><strong>Email:</strong> {user?.email}</p>

        <div>
          <label className="block mb-2">LeetCode Username</label>
          <input
            type="text"
            value={leetCodeId}
            onChange={(e) => setLeetCodeId(e.target.value)}
            className="w-full p-2 rounded text-black"
            placeholder="Enter your LeetCode ID"
          />
        </div>

        <button
          onClick={handleSync}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white"
        >
          {loading ? "Syncing..." : "Sync LeetCode"}
        </button>

        {message && <p className="mt-3">{message}</p>}

        {leetCodeId && (
          <div className="mt-6 bg-gray-700 p-4 rounded">
            <h2 className="text-xl font-semibold mb-3">📊 Your LeetCode Stats</h2>
            <p><strong>Total Solved:</strong> {stats.totalSolved}</p>
            <p><strong>Contest Rating:</strong> {stats.contestRating || "N/A"}</p>
            <p><strong>Global Rank:</strong> {stats.globalRank ?? "N/A"}</p>
            <p><strong>Contests Attended:</strong> {stats.contestsAttended}</p>
          </div>
        )}
      </div>
    </div>
  );
}
