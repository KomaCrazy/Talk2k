"use client"
import { useEffect, useState } from "react";

export default function Home() {
  const [message, setMessage] = useState<string>('');
  
  let socket: WebSocket;

  useEffect(() => {
    socket = new WebSocket('ws://localhost:3001/ws?username=Fontend&room=xxxx');
    
    socket.onopen = () => {
      console.log('WebSocket connected');
    };
    
    socket.onmessage = (event: MessageEvent) => {
      console.log('Message from server:', event.data);
      setMessage(event.data);
    };
    
    socket.onerror = (error: Event) => {
      console.error('WebSocket Error:', error);
    };

    return () => {
      socket.close();
      console.log('WebSocket connection closed');
    };
  }, []);
  const sendMessage = () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send("Hello from client!");
    }
  };

  return (
    <div>
      <h1>WebSocket Test</h1>
      <button onClick={sendMessage}>Send Message</button>
      <p>Message from server: {message}</p>
    </div>
  );
}
