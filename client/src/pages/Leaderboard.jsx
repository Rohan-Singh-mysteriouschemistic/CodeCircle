import { useEffect, useState } from "react";
import API_BASE from "../config.js";
import { useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

export default function Leaderboard() {
  const { roomId } = useParams();
  const [members, setMembers] = useState([]);
  const [roomName, setRoomName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch(
          `${API_BASE}/api/leetcode/room-leaderboard/${roomId}`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
        const data = await res.json();
        if (!res.ok) {
          setError(data.message || "Failed to load leaderboard");
          return;
        }
        // Sort by totalSolved descending
        const sorted = (data.members || []).sort(
          (a, b) => b.totalSolved - a.totalSolved
        );
        setMembers(sorted);
        setRoomName(data.roomName || "");
      } catch (err) {
        console.error(err);
        setError("Network error while fetching leaderboard");
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, [roomId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-gray-100">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Room <span className="gradient-text">Leaderboard</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Track the performance of all members in{" "}
            <span className="text-purple-400 font-semibold">{roomName}</span>.
          </p>
        </div>
      </section>

      {/* Leaderboard Table */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Card className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-2xl overflow-hidden">
            <CardContent className="overflow-x-auto p-0">
              {loading ? (
                <div className="p-6 text-center text-gray-400">Loading leaderboard…</div>
              ) : error ? (
                <div className="p-6 text-center text-red-400">{error}</div>
              ) : (
                <table className="min-w-full text-left text-gray-200">
                  <thead>
                    <tr className="border-b border-gray-700 bg-gray-800">
                      <th className="py-3 px-4">#</th>
                      <th className="py-3 px-4">Username</th>
                      <th className="py-3 px-4">Solved</th>
                      <th className="py-3 px-4">Contest Rating</th>
                      <th className="py-3 px-4">Rank</th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.length === 0 ? (
                      <tr>
                        <td
                          colSpan="5"
                          className="py-6 text-center text-gray-400"
                        >
                          No members found.
                        </td>
                      </tr>
                    ) : (
                      members.map((m, i) => (
                        <tr
                          key={i}
                          className={`border-b border-gray-700 hover:bg-gray-700/30 transition-colors ${
                            i === 0
                              ? "bg-yellow-500/10"
                              : i === 1
                              ? "bg-gray-500/10"
                              : i === 2
                              ? "bg-orange-500/10"
                              : ""
                          }`}
                        >
                          <td className="py-3 px-4 font-semibold">{i + 1}</td>
                          <td className="py-3 px-4 font-medium">{m.username}</td>
                          <td className="py-3 px-4">{m.totalSolved}</td>
                          <td className="py-3 px-4">{m.contestRating}</td>
                          <td className="py-3 px-4">{m.globalRank ?? "-"}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
