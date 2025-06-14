interface ChatMessageProps {
  message: string;
  isUser: boolean;
  timestamp: Date;
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }).format(date);
}

export function ChatMessage({ message, isUser, timestamp }: ChatMessageProps) {
  return (
    <div
      className={`flex w-full items-start gap-2.5 p-4 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`flex flex-col gap-1 rounded-lg px-4 py-2 max-w-[80%] ${
          isUser
            ? "bg-gray-600 text-white"
            : "bg-gray-300"
        }`}
      >
        <p className="text-sm">{message}</p>
        <span className="text-xs opacity-70">
          {formatDate(timestamp)}
        </span>
      </div>
    </div>
  );
} 