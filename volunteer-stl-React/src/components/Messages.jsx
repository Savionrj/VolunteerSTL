import { useLocation, Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

export default function Messages({ user }) {
  const { state } = useLocation();
  const { receiver } = state || {};

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messageEndRef = useRef(null);

  useEffect(() => {
    if (!receiver) return;
    const fetchMessages = async () => {
      try {
        const response = await fetch(`http://localhost:8080/messages/history?senderId=${user.id}&receiverId=${receiver.id}`);
        if (!response.ok) throw new Error("Failed to fetch messages");
        const data = await response.json();
        setMessages(data);
      } catch (err) {
        console.error(err.message);
      }
    };
    fetchMessages();
  }, [receiver, user]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      const response = await fetch("http://localhost:8080/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId: user.id,
          receiverId: receiver.id,
          content: newMessage
        }),
      });

      if (!response.ok) throw new Error("Failed to send message");
      const sentMessage = await response.json();
      setMessages(prev => [...prev, sentMessage]);
      setNewMessage("");

      setTimeout(() => messageEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch (err) {
      console.error(err.message);
    }
  };

  if (!receiver) {
    return <div className="p-6 text-xl text-gray-600">No recipient selected.</div>;
  }

  return (
    <div className="mx-2 bg-white rounded-xl shadow-md flex flex-col h-[85vh] overflow-hidden">

      <div className="bg-gray-100 px-6 py-4 border-b flex items-center">
        <Link to={`/account/${receiver.id}`} className="text-xl font-semibold text-gray-800">Message {receiver.firstName} {receiver.lastName}</Link>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-gray-50">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.senderId === user.id ? "justify-end" : "justify-start"}`}
          >
            <div className={`px-4 py-2 rounded-lg max-w-xs text-white ${msg.senderId === user.id ? "bg-[#2d55bb]" : "bg-red-700"}`}>
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={messageEndRef} />
      </div>

      <div className="border-t px-6 py-4 flex items-center bg-gray-50">
        <input
          type="text"
          className="flex-1 border rounded-full px-4 py-2 mr-4"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-700 text-white px-6 py-2 rounded-full hover:bg-blue-800 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}
