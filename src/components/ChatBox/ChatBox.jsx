"use client";

import { useState } from "react";

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const response = await fetch(
        `http://api.weatherstack.com/current?access_key=f9db26cc47e45370233f7b74a417d284&query=${encodeURIComponent(input)}`
      );
      const data = await response.json();
      const aiMessage = {
        sender: "ai",
        text: `The weather in ${input} is ${data.current.temperature}°C with ${data.current.weather_descriptions[0]}.`,
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      setMessages((prev) => [...prev, { sender: "ai", text: "Error fetching data." }]);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white p-4">
      <div className="flex-1 overflow-y-auto border border-gray-700 p-4 rounded">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 my-1 max-w-xs rounded-lg ${msg.sender === "user" ? "bg-blue-500 self-end" : "bg-gray-700 self-start"}`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div className="mt-4 flex">
        <input
          className="flex-1 p-2 border border-gray-700 bg-gray-800 rounded"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question..."
        />
        <button className="ml-2 bg-blue-600 p-2 rounded" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
