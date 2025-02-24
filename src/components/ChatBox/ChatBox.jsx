"use client";

import { useState, useEffect } from "react";
import styles from "./ChatBox.module.css";
import jwt from "jsonwebtoken";

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchUserName = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const decodedToken = jwt.decode(token);
        const response = await fetch(`/api/auth/user?email=${decodedToken.email}`);
        const data = await response.json();
        setUserName(data.name);
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    };

    fetchUserName();
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      const aiMessage = { sender: "ai", text: `You said: ${data.message || "No message received"}` };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      setMessages((prev) => [...prev, { sender: "ai", text: "Error posting data." }]);
    }
  };

  return (
    <div className={styles.chatContainer}>
      <h2>Welcome, {userName || "Guest"}!</h2>
      <div className={styles.messagesContainer}>
        {messages.map((msg, index) => (
          <div key={index} className={`${styles.message} ${msg.sender === "user" ? styles.userMessage : styles.aiMessage}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className={styles.inputContainer}>
        <input
          className={styles.inputField}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question..."
          onKeyUp={(e) => e.key === "Enter" && sendMessage()}
        />
        <button className={styles.sendButton} onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatBox;
