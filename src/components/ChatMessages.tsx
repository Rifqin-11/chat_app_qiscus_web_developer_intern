import { useEffect, useRef } from "react";
import type { Comment, Participant } from "../types/chat";
import { MessageBubble } from "./MessageBubble";
import { formatDate, isSameDay } from "../lib/utils";

interface ChatMessagesProps {
  comments: Comment[];
  participants: Participant[];
  currentUserId: string;
}

export const ChatMessages = ({
  comments,
  participants,
  currentUserId,
}: ChatMessagesProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [comments]);

  const getParticipant = (senderId: string): Participant => {
    return (
      participants.find((p) => p.id === senderId) || {
        id: senderId,
        name: "Unknown",
        role: 0,
      }
    );
  };

  const shouldShowDateSeparator = (currentIndex: number): boolean => {
    if (currentIndex === 0) return true;
    const currentComment = comments[currentIndex];
    const previousComment = comments[currentIndex - 1];
    return !isSameDay(currentComment.timestamp, previousComment.timestamp);
  };

  return (
    <div className="flex-1 overflow-y-auto px-6 pb-32 relative">

      <div className="max-w-4xl mx-auto relative z-0 pt-6 -mt-16">
        {comments.map((comment, index) => (
          <div key={comment.id}>
            {/* Date Separator */}
            {shouldShowDateSeparator(index) && (
              <div className="flex justify-center my-4">
                <div className="px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm">
                  <span className="text-xs font-medium text-gray-600">
                    {formatDate(comment.timestamp)}
                  </span>
                </div>
              </div>
            )}

            <MessageBubble
              comment={comment}
              participant={getParticipant(comment.sender)}
              isCurrentUser={comment.sender === currentUserId}
            />
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};
