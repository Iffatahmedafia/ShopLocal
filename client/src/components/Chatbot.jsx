import React, { useState } from "react";
import { FaCommentDots } from "react-icons/fa"; // Using the comment icon for the chat button
import { FaRobot } from "react-icons/fa";
import ChatWindow from "./ChatWindow"; // Your existing chat window component

const Chatbot = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => setIsChatOpen(!isChatOpen);

  return (
    <div>
      <div
        className="fixed bottom-8 right-8 z-50 p-4 bg-red-700 text-white rounded-full shadow-lg cursor-pointer"
        onClick={toggleChat}
      >
        <FaRobot size={28} />
      </div>

      {isChatOpen && (
        <div className="fixed bottom-20 right-8 z-50 w-80 h-96 bg-white shadow-xl rounded-lg border border-gray-300">
          <ChatWindow closeChat={() => setIsChatOpen(false)} />
        </div>
      )}
    </div>
  );
};

export default Chatbot;