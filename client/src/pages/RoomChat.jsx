// src/pages/RoomChat.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import io from "socket.io-client";

// ✅ create socket only once
const socket = io("http://localhost:5000");

export default function RoomChat() {
  const { roomId } = useParams();
  const { token, user } = useAuth();

  const [channels, setChannels] = useState([]);
  const [newChannelName, setNewChannelName] = useState("");
  const [selectedChannel, setSelectedChannel] = useState(null);

  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");

  // 👉 Fetch channels for this room
  useEffect(() => {
    async function fetchChannels() {
      const res = await fetch(`http://localhost:5000/api/channels/${roomId}/channels`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setChannels(data.channels);
    }
    if (token) fetchChannels();
  }, [roomId, token]);

  // 👉 Fetch messages when channel changes
  useEffect(() => {
    if (!selectedChannel) return;
    async function fetchMessages() {
      try {
        const res = await fetch(`http://localhost:5000/api/messages/${selectedChannel._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setMessages(Array.isArray(data) ? data : []);
        } else {
          setMessages([]);
        }
      } catch (err) {
        console.error(err);
        setMessages([]);
      }
    }
    fetchMessages();

    socket.emit("joinChannel", { roomId, channelId: selectedChannel._id });
  }, [selectedChannel, roomId, token]);

  // 👉 Listen for incoming socket messages
  useEffect(() => {
    const handler = (msg) => {
      if (msg.channelId === selectedChannel?._id) {
        setMessages((prev) => [...prev, msg]);
      }
    };
    socket.on("receiveMessage", handler);
    return () => {
      socket.off("receiveMessage", handler);
    };
  }, [selectedChannel]);

  // 👉 Create new channel
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

  // 👉 Send message
  function sendMessage() {
    if (!messageText.trim() || !selectedChannel) return;

    const msg = {
        text: messageText,
        sender: { username: user.username }, // for local immediate display
        channelId: selectedChannel._id,
    };

    socket.emit("sendMessage", {
        text: messageText,
        sender: user.id, // ✅ FIXED
        roomId,
        channelId: selectedChannel._id,
    });
    setMessageText("");
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white p-4 overflow-y-auto">
        <h2 className="text-lg font-bold mb-4">Channels</h2>

        <ul className="space-y-2">
          {channels.map((ch) => (
            <li
              key={ch._id}
              onClick={() => setSelectedChannel(ch)}
              className={`p-2 rounded cursor-pointer ${
                selectedChannel?._id === ch._id ? "bg-gray-700" : "hover:bg-gray-800"
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
            className="w-full p-2 rounded text-black"
          />
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-1 rounded"
          >
            ➕ Add Channel
          </button>
        </form>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col h-full bg-gray-100">
        {!selectedChannel ? (
          <div className="p-4 text-gray-700 text-lg font-medium">
            👉 Select a channel from the left to start chatting.
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="p-4 border-b bg-white shadow-sm text-xl font-bold text-gray-800">
              # {selectedChannel.name}
            </div>

            {/* Messages - Scrollable area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {messages.length === 0 ? (
                <div className="text-gray-500 italic">
                  No messages yet. Start the conversation 👇
                </div>
              ) : (
                messages.map((m, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-lg bg-white shadow-sm border border-gray-200"
                  >
                    <p className="text-sm text-gray-800">
                      <strong className="text-purple-700">
                        {m.sender?.username || m.sender}
                      </strong>
                      : {m.text}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Input - Fixed at bottom */}
            <div className="p-3 border-t bg-white sticky bottom-0">
              <div className="flex items-center">
                <input
                  className="flex-1 p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Type a message..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <button
                  onClick={sendMessage}
                  className="ml-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
                >
                  Send
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}