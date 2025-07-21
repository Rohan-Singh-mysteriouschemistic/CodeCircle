// src/pages/ProfilePage.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { User } from "lucide-react"; // ✅ import icon

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
    badges: {
      winner: user?.badges?.winner || 0,
      second: user?.badges?.second || 0
    }
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

        const meRes = await fetch("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const freshUser = await meRes.json();

        setStats({
          totalSolved: freshUser.totalSolved,
          contestRating: freshUser.contestRating,
          globalRank: freshUser.globalRank,
          contestsAttended: freshUser.contestsAttended,
          badges: {
            winner: freshUser.badges?.winner || 0,
            second: freshUser.badges?.second || 0
          }
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
    <div className="min-h-screen bg-gray-900">
      <div className="h-16" />
      {/* ✅ Hero Section */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8 overflow-hidden text-center">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="relative max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4"><span className="gradient-text">Your Profile</span></h1>
          <p className="text-gray-400 text-lg">
            Manage your account and sync your LeetCode stats
          </p>
        </div>
      </section>

      {/* ✅ Floating Card */}
      <div className="max-w-2xl mx-auto bg-gray-800 rounded-xl shadow-xl p-8 -mt-10 relative z-10 text-white">
        <p>
          <strong>Username:</strong> {user?.username}
        </p>
        <p>
          <strong>Email:</strong> {user?.email}
        </p>

        <div className="mt-4">
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
          className="mt-4 w-full bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white font-semibold"
        >
          {loading ? "Syncing..." : "Sync LeetCode"}
        </button>

        {message && <p className="mt-3">{message}</p>}

        {leetCodeId && (
          <div className="mt-6 bg-gray-700 p-4 rounded">
            <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
              <User className="w-5 h-5" /> Your LeetCode Stats
            </h2>
            <p>
              <strong>Total Solved:</strong> {stats.totalSolved}
            </p>
            <p>
              <strong>Contest Rating:</strong>{" "}
              {stats.contestRating || "N/A"}
            </p>
            <p>
              <strong>Global Rank:</strong>{" "}
              {stats.globalRank ?? "N/A"}
            </p>
            <p>
              <strong>Contests Attended:</strong>{" "}
              {stats.contestsAttended}
            </p>
            <p>
              <strong>🏆 1st Place Badges:</strong> {stats.badges?.winner ?? 0}
            </p>
            <p>
              <strong>🥈 2nd Place Badges:</strong> {stats.badges?.second ?? 0}
            </p>
          </div>
        )}
      </div>

      {/* ✅ Footer tip */}
      <div className="text-center text-yellow-400 mt-6">
        ✨ Keep your LeetCode ID updated to enjoy accurate leaderboards and stats across your rooms!
      </div>
    </div>
  );
}
