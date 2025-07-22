import { useEffect, useState } from "react";
import API_BASE from "../config.js";
export default function ContestPanel({ roomId, token, user }) {
  const [activeContest, setActiveContest] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [problemInputs, setProblemInputs] = useState([
    { title: "", url: "", difficulty: "" },
    { title: "", url: "", difficulty: "" },
    { title: "", url: "", difficulty: "" },
  ]);

  // fetch active contest & admin
  useEffect(() => {
    async function fetchContest() {
      const res = await fetch(`${API_BASE}/api/contests/${roomId}/active`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setActiveContest(data);
      else setActiveContest(null);
    }

    async function checkAdmin() {
      const res = await fetch(`${API_BASE}/api/rooms/${roomId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.admins?.some((a) => a === user.id)) {
        setIsAdmin(true);
      }
    }

    fetchContest();
    checkAdmin();
  }, [roomId, token, user]);

  // helper to extract slug
  function extractSlugFromUrl(url) {
    const match = url.match(/leetcode\.com\/problems\/([\w-]+)/);
    return match ? match[1] : "";
  }

  const handleProblemChange = (index, field, value) => {
    const updated = [...problemInputs];
    updated[index][field] = value;
    if (field === "url") updated[index]["slug"] = extractSlugFromUrl(value);
    setProblemInputs(updated);
  };

  async function createContest(e) {
    e.preventDefault();
    const res = await fetch(`${API_BASE}/api/contests/${roomId}/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ problems: problemInputs }),
    });
    const data = await res.json();
    if (res.ok) {
      alert("✅ Contest created!");
      setActiveContest(data);
    } else {
      alert(data.message || "Failed to create contest");
    }
  }

  async function submitSolved(contestId, problemIndex) {
    const res = await fetch(`${API_BASE}/api/contests/${contestId}/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ problemIndex }),
    });
    if (res.ok) {
      alert("✅ Marked as solved!");
    }
  }

  return (
    <div className="bg-gray-50 border rounded-xl p-4 shadow mt-4">
      <h2 className="text-xl font-bold mb-4">🔥 Contest Panel</h2>

      {/* CREATE CONTEST (Admin Only) */}
      {isAdmin && !activeContest && (
        <form onSubmit={createContest} className="mb-6">
          <h3 className="font-semibold mb-3 text-lg">
            Create Contest <span className="text-sm text-gray-500">(3 Problems, 2h)</span>
          </h3>
          <div className="space-y-4">
            {problemInputs.map((p, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:grid sm:grid-cols-3 gap-2"
              >
                <input
                  type="text"
                  className="border p-2 rounded w-full"
                  placeholder="Title"
                  value={p.title}
                  onChange={(e) => handleProblemChange(idx, "title", e.target.value)}
                />
                <input
                  type="text"
                  className="border p-2 rounded w-full"
                  placeholder="LeetCode URL"
                  value={p.url}
                  onChange={(e) => handleProblemChange(idx, "url", e.target.value)}
                />
                <input
                  type="text"
                  className="border p-2 rounded w-full"
                  placeholder="Difficulty"
                  value={p.difficulty}
                  onChange={(e) => handleProblemChange(idx, "difficulty", e.target.value)}
                />
              </div>
            ))}
          </div>
          <button
            type="submit"
            className="mt-4 w-full sm:w-auto bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            ✅ Create Contest
          </button>
        </form>
      )}

      {/* ACTIVE CONTEST */}
      {activeContest && (
        <div>
          <h3 className="font-semibold mb-2 text-lg">⏳ Active Contest</h3>
          <p className="text-sm mb-4 text-gray-600">
            Ends at:{" "}
            <span className="font-medium">
              {new Date(activeContest.endTime).toLocaleTimeString()}
            </span>
          </p>
          <ul className="space-y-3">
            {activeContest.problems.map((p, i) => (
              <li
                key={i}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-2 bg-gray-100 rounded"
              >
                <a
                  href={p.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 underline break-all"
                >
                  {p.title} ({p.difficulty})
                </a>
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  onClick={() => submitSolved(activeContest._id, i)}
                >
                  ✅ Mark Solved
                </button>
              </li>
            ))}
          </ul>

          {/* Leaderboard */}
          {activeContest.participants?.length > 0 && (
            <div className="mt-6">
              <h4 className="font-semibold text-lg mb-2">🏆 Leaderboard</h4>
              <ol className="list-decimal pl-5 space-y-1">
                {activeContest.participants
                  .sort((a, b) => b.solved - a.solved)
                  .map((p, idx) => (
                    <li key={p.user} className="flex flex-col sm:flex-row sm:justify-between">
                      <span>
                        {p.user?.username || p.user} – {p.solved} solved
                      </span>
                      <span>
                        {idx === 0 && "🏅 Winner"}
                        {idx === 1 && "🥈 Second"}
                        {idx === 2 && "🥉 Third"}
                      </span>
                    </li>
                  ))}
              </ol>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
