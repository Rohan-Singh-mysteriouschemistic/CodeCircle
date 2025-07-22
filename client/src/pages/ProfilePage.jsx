import { useState } from "react";
import API_BASE from "../config.js";
import { useAuth } from "../context/AuthContext";
import { User } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
      second: user?.badges?.second || 0,
    },
  });

  const handleSync = async () => {
    if (!leetCodeId.trim()) {
      setMessage("❌ Please enter a LeetCode username");
      return;
    }
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${API_BASE}/api/leetcode/update`, {
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

        // refresh profile
        const meRes = await fetch(`${API_BASE}/api/auth/me`, {
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
            second: freshUser.badges?.second || 0,
          },
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
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-gray-100">
      <div className="h-16" />

      {/* Hero */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8 overflow-hidden text-center">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="relative max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Your Profile</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Manage your account and sync your LeetCode stats
          </p>
        </div>
      </section>

      {/* Profile Card */}
      <Card className="max-w-2xl mx-auto bg-gray-800/50 backdrop-blur border border-gray-700 shadow-xl -mt-10 relative z-10">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Account Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            <strong>Username:</strong> {user?.username || "N/A"}
          </p>
          <p>
            <strong>User-Id:</strong> {user?.email || "N/A"}
          </p>

          <div className="space-y-2">
            <label className="text-sm text-gray-400 font-medium">
              LeetCode Username
            </label>
            <Input
              type="text"
              value={leetCodeId}
              onChange={(e) => setLeetCodeId(e.target.value)}
              placeholder="Enter your LeetCode ID"
              className="bg-gray-900 border-gray-700 focus:border-purple-400 focus:ring-purple-400"
            />
          </div>

          <Button
            onClick={handleSync}
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold"
          >
            {loading ? "Syncing..." : "Sync LeetCode"}
          </Button>

          {message && (
            <p
              className={`text-sm font-medium mt-2 ${
                message.startsWith("✅")
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {message}
            </p>
          )}

          {leetCodeId && (
            <div className="mt-6 bg-gray-700/50 rounded-xl p-4 border border-gray-600">
              <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <User className="w-5 h-5 text-purple-400" /> Your LeetCode Stats
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
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
                  <strong>Contests Attended:</strong> {stats.contestsAttended}
                </p>
                <p>
                  <strong>🏆 1st Place Badges:</strong>{" "}
                  {stats.badges?.winner ?? 0}
                </p>
                <p>
                  <strong>🥈 2nd Place Badges:</strong>{" "}
                  {stats.badges?.second ?? 0}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Footer Tip */}
      <div className="text-center text-yellow-400 mt-8 mb-12">
        ✨ Keep your LeetCode ID updated to enjoy accurate leaderboards and stats across your rooms!
      </div>
    </div>
  );
}
