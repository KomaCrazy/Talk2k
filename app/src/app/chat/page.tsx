"use client"
import React, { useState, useRef, useEffect } from 'react';
import CardPreple from '@/components/CardPreple';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'other';
  timestamp: Date;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  let socket: WebSocket;


  useEffect(() => {
    socket = new WebSocket('ws://komacrazy.thddns.net:6991/ws?username=Ham&room=xxx');
    
    socket.onopen = () => {
      console.log('WebSocket connected');
    };
    
    socket.onmessage = (event: MessageEvent) => {
      let raw = JSON.parse(event.data);
      handleSendMessageX(raw.text)
      // const message: Message = {
      //   id: Date.now().toString(),
      //   text: raw.text,
      //   sender: 'other',
      //   timestamp: new Date(),
      // };
      // setMessages([...messages, message]);
      // setNewMessage('');
    };
    
    socket.onerror = (error: Event) => {
      console.error('WebSocket Error:', error);
    };

    return () => {
      socket.close();
      console.log('WebSocket connection closed');
    };
  }, []);


  const handleSendMessageX = (e: string) => {
      const message: Message = {
        id: Date.now().toString(),
        text: e,
        sender: 'other',
        timestamp: new Date(),
      };
      // setMessages([...messages, message]);
      setMessages((prevMessages) => [...prevMessages, message]);
      setNewMessage('');
  };


  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        text: newMessage,
        sender: 'user',
        timestamp: new Date(),
      };
      setMessages([...messages, message]);
      setNewMessage('');
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('th-TH', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="flex h-screen">
      {/* Left Sidebar - Chat List */}
      <div className="w-[360px] bg-white border-r flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">แชท</h1>
            <div className="flex space-x-2">
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>
          <div className="mt-4">
            <div className="relative">
              <input
                type="text"
                placeholder="ค้นหาใน Messenger"
                className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full focus:outline-none"
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-2.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          <CardPreple></CardPreple>
          
          
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Chat Header */}
        <div className="flex items-center justify-between p-3 border-b">
          <div className="flex items-center">
            <div className="relative">
              <img src="https://i.pravatar.cc/40?img=1" alt="Profile" className="w-10 h-10 rounded-full" />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div className="ml-3">
              <h2 className="font-semibold">ผู้ติดต่อ</h2>
              <p className="text-xs text-green-500">กำลังใช้งาน</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.sender !== 'user' && (
                <img src="https://i.pravatar.cc/40?img=2" alt="Profile" className="w-8 h-8 rounded-full mr-2" />
              )}
              <div
                className={`max-w-[60%] ${
                  message.sender === 'user'
                    ? 'bg-blue-500 text-white rounded-l-2xl rounded-tr-2xl'
                    : 'bg-gray-100 text-gray-900 rounded-r-2xl rounded-tl-2xl'
                } px-4 py-2`}
              >
                <p className="break-words">{message.text}</p>
                <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t">
          <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
            <button type="button" className="p-2 hover:bg-gray-100 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Aa"
              className="flex-1 px-4 py-2 bg-gray-100 rounded-full focus:outline-none"
            />
            <button type="button" className="p-2 hover:bg-gray-100 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="p-2 text-blue-500 disabled:text-gray-400"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </form>
        </div>
      </div>

      {/* Right Sidebar - Chat Info */}
      <div className="w-[360px] border-l bg-white p-4">
        <div className="text-center">
          <img src="https://i.pravatar.cc/80?img=1" alt="Profile" className="w-20 h-20 rounded-full mx-auto" />
          <h2 className="font-semibold mt-2">ผู้ติดต่อ</h2>
          <p className="text-sm text-gray-500">กำลังใช้งาน</p>
        </div>

        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="ml-2">ดูข้อความที่เก็บไว้</span>
            </div>
          </div>

          <div className="flex items-center justify-between p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="ml-2">รูปภาพที่แชร์</span>
            </div>
          </div>

          <div className="flex items-center justify-between p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              <span className="ml-2">ปรับแต่งการแชท</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
