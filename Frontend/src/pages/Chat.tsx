"use client"
import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "../components/Chatmessage";
import { ChatInput } from "../components/Chatinput";
import { socket, connectSocket, disconnectSocket } from "../lib/socket";

interface Message {
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Socket connection setup
  useEffect(() => {
    connectSocket();

    // Listen for incoming messages
    socket.on('message', (data: { message: string }) => {
      console.log(data.message);
      const newMessage: Message = {
        content: data.message,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, newMessage]);
    });

    return () => {
      disconnectSocket();
    };
  }, []);

  const handleSendMessage = (content: string) => {
    if (!content.trim()) return;

    // Add user message to the chat
    const userMessage: Message = {
      content,
      isUser: true,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);

    // Emit the message through socket
    // socket.emit('send"hello nigga"ent, (ack: { status: string }) =
    //   console.log('Server acknowledged:', ack.status);
    //;
  };

  return (
    <div className="flex flex-col h-[c(100vh-4rem)] w-full">
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