// src/components/ContestPanel.jsx
import { useEffect, useState } from "react";

export default function ContestPanel({ roomId, token, user }) {
  const [activeContest, setActiveContest] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [problemInputs, setProblemInputs] = useState([
    { title: "", url: "", difficulty: "" },
    { title: "", url: "", difficulty: "" },
    { title: "", url: "", difficulty: "" },
  ]);

  // ✅ fetch active contest
  useEffect(() => {
    async function fetchContest() {
      const res = await fetch(`http://localhost:5000/api/contests/${roomId}/active`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setActiveContest(data);
    }
    fetchContest();

    // optional: check if user is admin for this room
    async function checkAdmin() {
      const res = await fetch(`http://localhost:5000/api/rooms/${roomId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        if (data.admins?.some((a) => a === user.id)) {
          setIsAdmin(true);
        }
      }
    }
    checkAdmin();
  }, [roomId, token, user]);

  // Helper function to extract slug
  function extractSlugFromUrl(url) {
    const match = url.match(/leetcode\.com\/problems\/([\w-]+)/);
    return match ? match[1] : "";
  }

  // Inside ContestPanel component
  const handleProblemChange = (index, field, value) => {
    const updated = [...problemInputs];
    updated[index][field] = value;
    if (field === "url") {
      updated[index]["slug"] = extractSlugFromUrl(value);
    }
    setProblemInputs(updated);
  };


  // ✅ create contest (admin only)
  async function createContest(e) {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:5000/api/contests/${roomId}/create`, {
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
    } catch (err) {
      console.error(err);
      alert("Error creating contest");
    }
  }

  // ✅ submit solved problem
  async function submitSolved(contestId, problemIndex) {
    await fetch(`http://localhost:5000/api/contests/${contestId}/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ problemIndex }),
    });
    alert("✅ Marked as solved!");
  }

  return (
    <div className="bg-gray-50 border rounded p-4 shadow mt-4">
      <h2 className="text-xl font-bold mb-3">🔥 Contest Panel</h2>

      {/* CREATE CONTEST - only for admin */}
      {isAdmin && !activeContest && (
        <form onSubmit={createContest} className="mb-4">
          <h3 className="font-bold mb-2">Create Contest (3 Problems, 2 hours)</h3>
          {problemInputs.map((p, idx) => (
            <div key={idx} className="mb-2 grid grid-cols-3 gap-2">
              <input
                type="text"
                className="border p-2 rounded"
                placeholder="Title"
                value={p.title}
                onChange={(e) => handleProblemChange(idx, "title", e.target.value)}
              />
              <input
                type="text"
                className="border p-2 rounded"
                placeholder="LeetCode URL"
                value={p.url}
                onChange={(e) => handleProblemChange(idx, "url", e.target.value)}
              />
              <input
                type="text"
                className="border p-2 rounded"
                placeholder="Difficulty"
                value={p.difficulty}
                onChange={(e) => handleProblemChange(idx, "difficulty", e.target.value)}
              />
            </div>
          ))}
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            ✅ Create Contest
          </button>
        </form>
      )}

      {/* ACTIVE CONTEST */}
      {activeContest && (
        <div className="mb-4">
          <h3 className="font-bold mb-2">⏳ Active Contest</h3>
          <p className="text-sm mb-2">
            Ends at: {new Date(activeContest.endTime).toLocaleTimeString()}
          </p>
          <ul className="list-disc pl-4">
            {activeContest.problems.map((p, i) => (
              <li key={i} className="mb-1">
                <a
                  href={p.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 underline"
                >
                  {p.title} ({p.difficulty})
                </a>
                <button
                  className="ml-2 bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                  onClick={() => submitSolved(activeContest._id, i)}
                >
                  ✅ Mark Solved
                </button>
              </li>
            ))}
          </ul>

          {/* LEADERBOARD */}
          {activeContest.participants?.length > 0 && (
            <div className="mt-4">
              <h4 className="font-bold">🏆 Leaderboard</h4>
              <ol className="list-decimal pl-4">
                {activeContest.participants
                  .sort((a, b) => b.solved - a.solved)
                  .map((p, idx) => (
                    <li key={p.user}>
                      {p.user?.username || p.user} - {p.solved} solved{" "}
                      {idx === 0 && "🏅 Winner"}
                      {idx === 1 && "🥈 Second"}
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
