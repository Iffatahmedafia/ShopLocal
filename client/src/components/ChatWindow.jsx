import { useState } from "react";
import axios from "axios";

const getFullImageUrl = (image) => {
  if (!image || image === "images/default.jpg") return "https://placehold.co/200";
  if (image.startsWith("http")) return image;
  if (image.startsWith("/")) return image;
  return `/${image}`;
};

const formatMoney = (value) => {
  if (value === null || value === undefined || value === "") return "Price unavailable";
  const amount = Number(value);
  if (Number.isNaN(amount)) return `CAD ${value}`;
  return amount.toLocaleString("en-CA", {
    style: "currency",
    currency: "CAD",
  });
};

const ChatWindow = ({ closeChat }) => {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

  const [messages, setMessages] = useState([
    { type: "bot", message: "Hi, how can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput || loading) return;

    const userMessage = { type: "user", message: trimmedInput };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(`${API_URL}/chatbot/`, { message: trimmedInput });

      if (res.data.type === "suggestions") {
        setMessages((prev) => [
          ...prev,
          {
            type: "bot",
            message: res.data.message || "Here are some suggestions from our database.",
            products: res.data.products || [],
            brands: res.data.brands || [],
          },
        ]);
      } else {
        setMessages((prev) => [...prev, { type: "bot", message: res.data.message }]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { type: "bot", message: "Sorry, I couldn't process your request." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
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
            className={`rounded-md p-2 ${
              msg.type === "user"
                ? "ml-auto max-w-[85%] bg-blue-100 dark:bg-blue-600"
                : "mr-auto max-w-[95%] bg-gray-200 dark:bg-gray-700"
            }`}
          >
            <p className="whitespace-pre-line text-sm">{msg.message}</p>

            {msg.products?.length > 0 && (
              <div className="mt-3 space-y-2">
                {msg.products.map((product) => (
                  <div
                    key={product.id}
                    className="flex gap-3 rounded-xl border border-red-100 bg-gradient-to-br from-red-50/80 via-white to-white p-2.5 text-gray-900 shadow-sm shadow-red-100/50 transition hover:-translate-y-0.5 hover:border-red-200 hover:shadow-md dark:border-gray-700 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900 dark:text-white dark:shadow-none"
                  >
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-red-50 bg-white p-1 dark:border-gray-700 dark:bg-gray-900">
                      <img
                        src={getFullImageUrl(product.image)}
                        alt={product.name}
                        className="h-full w-full rounded-md object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-sm font-bold leading-snug text-gray-950 dark:text-white">{product.name}</p>
                      <p className="mt-0.5 truncate text-xs font-medium text-gray-500 dark:text-gray-400">
                        {product.brand_name || product.category_name || "Local product"}
                      </p>
                      <p className="mt-2 inline-flex rounded-full bg-red-50 px-2.5 py-1 text-xs font-bold text-red-700 ring-1 ring-red-100 dark:bg-red-950/40 dark:text-red-200 dark:ring-red-900">
                        {formatMoney(product.price)}
                      </p>
                      {product.online_store && (
                        <a
                          href={product.online_store}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-flex rounded-full border border-red-200 bg-white px-3 py-1 text-xs font-bold text-red-700 transition hover:border-red-700 hover:bg-red-700 hover:text-white dark:border-red-800 dark:bg-gray-900 dark:text-red-200 dark:hover:bg-red-700 dark:hover:text-white"
                        >
                          Visit Store
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {msg.brands?.length > 0 && (
              <div className="mt-3 space-y-2">
                {msg.brands.map((brand) => (
                  <div
                    key={brand.id}
                    className="rounded-xl border border-red-100 bg-gradient-to-br from-red-50/80 via-white to-white p-3 text-gray-900 shadow-sm shadow-red-100/50 transition hover:-translate-y-0.5 hover:border-red-200 hover:shadow-md dark:border-gray-700 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900 dark:text-white dark:shadow-none"
                  >
                    <p className="text-sm font-bold leading-snug text-gray-950 dark:text-white">{brand.name}</p>
                    {brand.website_link && (
                      <a
                        href={brand.website_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex rounded-full border border-red-200 bg-white px-3 py-1 text-xs font-bold text-red-700 transition hover:border-red-700 hover:bg-red-700 hover:text-white dark:border-red-800 dark:bg-gray-900 dark:text-red-200 dark:hover:bg-red-700 dark:hover:text-white"
                      >
                        Visit Website
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        {loading && <div className="italic text-gray-500 dark:text-gray-400">Typing...</div>}
      </div>

      <div className="flex items-center p-2 bg-gray-200 dark:bg-gray-700">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 rounded-lg p-2 text-gray-900"
          placeholder="Type a message..."
          disabled={loading}
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="ml-2 rounded-lg bg-red-700 p-2 text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
