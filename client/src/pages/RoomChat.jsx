import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

export default function RoomChat() {
  const { roomId } = useParams();
  const { token, user } = useAuth();
  const messagesEndRef = useRef(null);

  const [channels, setChannels] = useState([]);
  const [newChannelName, setNewChannelName] = useState("");
  const [selectedChannel, setSelectedChannel] = useState(null);

  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");

  const [showContestModal, setShowContestModal] = useState(false);
  const [problems, setProblems] = useState([
    { title: "", url: "", difficulty: "" },
    { title: "", url: "", difficulty: "" },
    { title: "", url: "", difficulty: "" },
  ]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeContest, setActiveContest] = useState(null);

  // fetch channels & admin
  useEffect(() => {
    if (!token || !user?.id) return;
    async function fetchChannels() {
      try {
        const res = await fetch(
          `http://localhost:5000/api/channels/${roomId}/channels`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        if (res.ok && data.channels) setChannels(data.channels);
      } catch (err) {
        console.error("Error fetching channels:", err);
      }
    }

    async function checkAdmin() {
      try {
        const res = await fetch(`http://localhost:5000/api/rooms/${roomId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok && Array.isArray(data.admins) && data.admins.includes(user.id)) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (err) {
        console.error("Error checking admin:", err);
        setIsAdmin(false);
      }
    }

    fetchChannels();
    checkAdmin();
  }, [roomId, token, user]);

  // fetch active contest
  useEffect(() => {
    async function fetchContest() {
      try {
        const res = await fetch(`http://localhost:5000/api/contests/${roomId}/active`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setActiveContest(data);
        else setActiveContest(null);
      } catch (err) {
        console.error("Error fetching contest:", err);
        setActiveContest(null);
      }
    }
    fetchContest();
  }, [roomId, token]);

  // scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // fetch messages
  useEffect(() => {
    if (!selectedChannel) return;
    async function fetchMessages() {
      try {
        const res = await fetch(
          `http://localhost:5000/api/messages/${selectedChannel._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        if (res.ok) setMessages(Array.isArray(data) ? data : []);
        else setMessages([]);
      } catch (err) {
        console.error(err);
        setMessages([]);
      }
    }
    fetchMessages();
    socket.emit("joinChannel", { roomId, channelId: selectedChannel._id });
  }, [selectedChannel, roomId, token]);

  useEffect(() => {
    const handler = (msg) => {
      if (msg.channelId === selectedChannel?._id) {
        setMessages((prev) => [...prev, msg]);
      }
    };
    socket.on("receiveMessage", handler);
    return () => socket.off("receiveMessage", handler);
  }, [selectedChannel]);

  async function createChannel(e) {
    e.preventDefault();
    if (!newChannelName.trim()) return;
    const res = await fetch(`http://localhost:5000/api/channels/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: newChannelName, roomId }),
    });
    const data = await res.json();
    if (res.ok) {
      setChannels((prev) => [...prev, data]);
      setNewChannelName("");
    } else {
      alert(data.message || "Failed to create channel");
    }
  }

  function sendMessage() {
    if (!messageText.trim() || !selectedChannel) return;
    socket.emit("sendMessage", {
      text: messageText,
      sender: user.id,
      roomId,
      channelId: selectedChannel._id,
    });
    setMessageText("");
  }

  async function createContest(e) {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:5000/api/contests/${roomId}/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ problems }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("✅ Contest created!");
        setShowContestModal(false);
        setActiveContest(data);
      } else {
        alert(data.message || "Failed to create contest");
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function submitSolved(contestId, problemIndex) {
    try {
      const res = await fetch(`http://localhost:5000/api/contests/${contestId}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ problemIndex }),
      });
      const data = await res.json();
      if (res.ok) alert("✅ Marked as solved!");
      else alert(data.message || "❌ Failed to mark solved");
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800/60 backdrop-blur border-r border-gray-700 p-4 flex flex-col">
        <h2 className="text-xl font-bold mb-4">📂 Channels</h2>
        <ul className="space-y-2 flex-1 overflow-y-auto">
          {channels.map((ch) => (
            <li
              key={ch._id}
              onClick={() => setSelectedChannel(ch)}
              className={`p-2 rounded-lg cursor-pointer transition ${
                selectedChannel?._id === ch._id
                  ? "bg-purple-600 text-white"
                  : "hover:bg-gray-700"
              }`}
            >
              # {ch.name}
            </li>
          ))}
        </ul>

        <form onSubmit={createChannel} className="mt-4 space-y-2">
          <input
            type="text"
            placeholder="New channel name"
            value={newChannelName}
            onChange={(e) => setNewChannelName(e.target.value)}
            className="w-full p-2 rounded bg-gray-100 text-black focus:outline-none"
          />
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg shadow"
          >
            ➕ Add Channel
          </button>
        </form>

        {isAdmin && (
          <button
            onClick={() => setShowContestModal(true)}
            className="mt-4 w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg shadow"
          >
            🏁 Create Contest
          </button>
        )}
      </div>

      {/* Main area */}
      <div className="flex-1 flex flex-col">
        {!selectedChannel ? (
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Welcome to the Room!</h1>
            {activeContest ? (
              <div className="bg-gray-800/60 backdrop-blur border border-gray-700 rounded-2xl p-6 shadow-lg">
                <h2 className="text-xl font-semibold mb-2">🔥 Active Contest</h2>
                <p className="text-sm mb-4 text-gray-300">
                  Ends at:{" "}
                  {new Date(activeContest.endTime).toLocaleTimeString()}
                </p>
                <ul className="list-disc pl-4 space-y-2">
                  {activeContest.problems.map((p, idx) => (
                    <li key={idx}>
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-400 hover:underline"
                      >
                        {p.title} ({p.difficulty})
                      </a>
                      {!isAdmin && (
                        <button
                          onClick={() => submitSolved(activeContest._id, idx)}
                          className="ml-3 bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded"
                        >
                          ✅ Mark Solved
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-gray-400 italic">
                No active contest currently.
              </p>
            )}
          </div>
        ) : (
          <>
            <div className="p-4 border-b border-gray-700 bg-gray-900 text-xl font-bold">
              # {selectedChannel.name}
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-800/30">
              {messages.length === 0 ? (
                <div className="text-gray-400 italic">
                  No messages yet. Start chatting 👇
                </div>
              ) : (
                <>
                  {messages.map((m, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-gray-800 border border-gray-700 shadow-sm"
                    >
                      <p className="text-sm text-gray-200">
                        <strong className="text-purple-400">
                          {m.sender?.username || m.sender}
                        </strong>
                        : {m.text}
                      </p>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>
            <div className="p-3 border-t border-gray-700 bg-gray-900 flex items-center">
              <input
                className="flex-1 p-2 rounded-lg bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Type a message..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <button
                onClick={sendMessage}
                className="ml-3 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow"
              >
                Send
              </button>
            </div>
          </>
        )}
      </div>

      {/* Contest Modal */}
      {showContestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 text-white p-6 rounded-2xl w-96 shadow-lg border border-gray-700">
            <h2 className="text-xl font-bold mb-4">Create Contest</h2>
            <form onSubmit={createContest} className="space-y-3">
              {problems.map((p, i) => (
                <div key={i} className="space-y-1">
                  <input
                    type="text"
                    className="w-full p-2 rounded bg-gray-100 text-black"
                    placeholder={`Problem ${i + 1} Title`}
                    value={p.title}
                    onChange={(e) => {
                      const updated = [...problems];
                      updated[i].title = e.target.value;
                      setProblems(updated);
                    }}
                  />
                  <input
                    type="text"
                    className="w-full p-2 rounded bg-gray-100 text-black"
                    placeholder="LeetCode URL"
                    value={p.url}
                    onChange={(e) => {
                      const updated = [...problems];
                      updated[i].url = e.target.value;
                      setProblems(updated);
                    }}
                  />
                  <input
                    type="text"
                    className="w-full p-2 rounded bg-gray-100 text-black"
                    placeholder="Difficulty"
                    value={p.difficulty}
                    onChange={(e) => {
                      const updated = [...problems];
                      updated[i].difficulty = e.target.value;
                      setProblems(updated);
                    }}
                  />
                </div>
              ))}
              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  onClick={() => setShowContestModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                >
                  Start Contest
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
