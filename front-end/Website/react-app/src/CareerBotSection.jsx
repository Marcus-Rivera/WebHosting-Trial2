import React, { useState, useRef, useEffect } from "react";
import SendIcon from "@mui/icons-material/Send";

const CareerBotSection = () => {
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "Hi!👋 Welcome to TaraTrabaho. Let's get you started on your job-hunting journey. ✅",
    },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const handleSend = () => {
    if (input.trim() === "") return;
    setMessages((prev) => [...prev, { from: "user", text: input }]);
    setInput("");

    // Example bot reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "Got it! Thanks for your response 🙌" },
      ]);
    }, 800);
  };

  // Auto-scroll to bottom whenever messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen overflow-hidden pt-5 bg-white">
      {/* Chat Messages (scrolls only when full) */}
      <div className="flex-1 overflow-y-auto p-6">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex mb-4 ${
              msg.from === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.from === "bot" && (
              <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                🤖
              </div>
            )}
            <div
              className={`px-4 py-2 rounded-2xl max-w-xs text-sm ${
                msg.from === "user"
                  ? "bg-[#FFE660] text-[#272343] font-semibold"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Section (fixed at bottom) */}
      <div className="border-t border-gray-300 p-4 bg-white">
        <div className="flex items-center border border-black rounded-lg px-3 py-2">
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-1 outline-none text-sm placeholder-gray-500"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            onClick={handleSend}
            className="ml-2 w-9 h-9 rounded-full bg-yellow-400 flex items-center justify-center"
          >
            <SendIcon className="text-black" fontSize="small" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CareerBotSection;
