import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function RoomResults() {
  const { roomId } = useParams();
  const { token } = useAuth();

  const [results, setResults] = useState(null);
  const [noContest, setNoContest] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchLatest() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(
          `http://localhost:5000/api/contests/${roomId}/latest`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.status === 404) {
          setNoContest(true);
          setLoading(false);
          return;
        }

        const data = await res.json();
        if (!res.ok) {
          setError(data.message || "Failed to fetch contest results");
        } else {
          setResults(data);
        }
      } catch (err) {
        console.error("Error fetching results:", err);
        setError("Network error while fetching results");
      } finally {
        setLoading(false);
      }
    }

    if (token) fetchLatest();
  }, [roomId, token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white">
        Loading results…
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
        <div className="text-center text-red-400 text-lg font-semibold">
          ❌ {error}
        </div>
      </div>
    );
  }

  if (noContest) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
        <div className="text-center text-red-400 text-lg font-semibold">
          ⚠️ No contest happened yet in this room.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-gray-100">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            🏅 Contest Results
          </h1>
          {results?.startTime && (
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              See how everyone performed in the contest on{" "}
              <span className="text-purple-400 font-semibold">
                {new Date(results.startTime).toLocaleString()}
              </span>.
            </p>
          )}
        </div>
      </section>

      {/* Results Table */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Card className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-2xl overflow-hidden">
            <CardHeader>
              {results?.startTime && (
                <CardTitle className="text-2xl font-semibold">
                  Results for contest on{" "}
                  {new Date(results.startTime).toLocaleString()}
                </CardTitle>
              )}
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="min-w-full text-left text-gray-200">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="py-3 px-4">Rank</th>
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Solved</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(results?.participants) &&
                  results.participants.length > 0 ? (
                    [...results.participants]
                      .sort((a, b) => b.solved - a.solved)
                      .map((p, idx) => (
                        <tr
                          key={p.user?._id || idx}
                          className={`border-b border-gray-700 hover:bg-gray-700/30 transition-colors ${
                            idx === 0
                              ? "bg-yellow-500/10"
                              : idx === 1
                              ? "bg-gray-500/10"
                              : idx === 2
                              ? "bg-orange-500/10"
                              : ""
                          }`}
                        >
                          <td className="py-3 px-4 font-medium">{idx + 1}</td>
                          <td className="py-3 px-4">{p.user?.username || "—"}</td>
                          <td className="py-3 px-4">{p.solved}</td>
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td
                        colSpan="3"
                        className="py-6 text-center text-gray-400"
                      >
                        No participants in this contest.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
