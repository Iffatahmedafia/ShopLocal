import React, { useState } from "react";
import axios from "axios";

const ChatWindow = ({ closeChat }) => {
  const [messages, setMessages] = useState([
    { type: "bot", message: "Hi, how can I help you today?" } // 👈 Initial welcome message
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false); // 👈 Loading state

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { type: "user", message: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true)

    try {
      const res = await axios.post("http://localhost:8000/api/chatbot/", { message: input });
      console.log("Result", res)

      if (res.data.type === "suggestions") {
        const suggestions = [];
        res.data.brands.forEach((brand) => {
          suggestions.push({
            type: "bot",
            message: `Brand: ${brand.name}`,
            link: brand.website_link || "",
          });
        });
        res.data.products.forEach((product) => {
          suggestions.push({
            type: "bot",
            message: `${product.name}\n💰 Price: CAD ${product.price}`,
            link: product.online_store || "",
          });
        });
        setMessages((prev) => [...prev, ...suggestions]);
      } else {
        setMessages((prev) => [...prev, { type: "bot", message: res.data.message }]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { type: "bot", message: "Sorry, I couldn't process your request." },
      ]);
    }

    setLoading(false); // 👈 Stop loading
  };

  return (
    <div className="h-full flex flex-col p-4">
      <div className="flex justify-between mb-2">
        <h3 className="text-lg font-semibold">Chatbot</h3>
        <button className="text-red-500 cursor-pointer" onClick={closeChat}>Close</button>
      </div>

      <div className="flex-1 overflow-y-auto bg-gray-100 dark:bg-gray-900 dark:text-white p-2 space-y-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 rounded-md ${msg.type === "user" ? "bg-blue-100 dark:bg-blue-600 self-end" : "bg-gray-200 dark:bg-gray-700 self-start"}`}
          >
            <p>{msg.message}</p>
            {msg.link && (
              <a href={msg.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 text-sm">
                Visit Website
              </a>
            )}
          </div>
        ))}
        {loading && <div className="italic text-gray-500">Typing...</div>} {/* 👈 Loader */}
      </div>

      <div className="flex items-center p-2 bg-gray-200 dark:bg-gray-700">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 rounded-lg"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="ml-2 p-2 bg-red-700 text-white rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
