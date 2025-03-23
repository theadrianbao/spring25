'use client';

import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export default function HomePage() {
  const [socket, setSocket] = useState<any>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [counter, setCounter] = useState(0);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const socketIo = io('http://localhost:4000', {
      auth: { serverOffset: 0 },
      ackTimeout: 10000,
      retries: 3,
    });

    socketIo.on('chat message', (msg: string) => {
      setMessages((prev) => [...prev, msg]);
    });

    setSocket(socketIo);

    return () => {
      socketIo.disconnect();
    };
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    if (darkMode) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }, [darkMode]);

  const sendMessage = () => {
    if (input && socket) {
      const clientOffset = `${socket.id}-${counter}`;
      socket.emit('chat message', input, clientOffset);
      setInput('');
      setCounter(counter + 1);
    }
  };

  return (
    <div className="page-container">
      {}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="toggle-btn"
      >
        Toggle Dark Mode
      </button>

      {}
      <ul className="messages-list">
        {messages.map((msg, i) => (
          <li key={i}>{msg}</li>
        ))}
      </ul>

      {}
      <div className="input-area">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="input-box"
        />
        <button
          onClick={sendMessage}
          className="send-btn"
        >
          Send
        </button>
      </div>
    </div>
  );
}
