"use client"
import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "../components/Chatmessage";
import { ChatInput } from "../components/Chatinput";

interface Message {
  content: string;
  isUser: boolean;
  timestamp: Date;
  messageId?: string;
}

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const lastSentMessageRef = useRef<string>("");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:3000');
    socketRef.current = socket;

    socket.onopen = () => {
      console.log('WebSocket connection established');
    };
    socket.onerror = (e) => {
      console.error('WebSocket error:', e);
    };
    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };
    socket.onmessage = (e) => {
      if (typeof e.data === 'string') {
        if (e.data === lastSentMessageRef.current) {
          lastSentMessageRef.current = "";
          return;
        }
        const newMessage: Message = {
          content: e.data,
          isUser: false,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, newMessage]);
      } else if (e.data instanceof Blob) {
        e.data.text().then(text => {
          if (text === lastSentMessageRef.current) {
            lastSentMessageRef.current = "";
            return;
          }
          const newMessage: Message = {
            content: text,
            isUser: false,
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, newMessage]);
        });
      }
    };
    return () => {
      socket.close();
    };
  }, []);
  const handleSendMessage = (content: string) => {
    if (!content.trim() || !socketRef.current) return;
    lastSentMessageRef.current = content;
    const userMessage: Message = {
      content,
      isUser: true,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    socketRef.current.send(content);
  };
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] w-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4 w-full">
        {messages.map((message, index) => (
          <ChatMessage
            key={index}
            message={message.content}
            isUser={message.isUser}
            timestamp={message.timestamp}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <ChatInput onSendMessage={handleSendMessage} isLoading={false} />
    </div>
  );
} 