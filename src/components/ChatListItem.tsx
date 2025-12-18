import type { Room } from "../types/chat";
import { cn } from "../lib/utils";
import { formatChatTime } from "../lib/timeUtils";

interface ChatListItemProps {
  room: Room;
  isActive: boolean;
  onClick: () => void;
}

export const ChatListItem = ({
  room,
  isActive,
  onClick,
}: ChatListItemProps) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all duration-200 group",
        isActive ? "bg-blue-500/10" : "hover:bg-gray-50"
      )}
    >
      <div className="relative flex-shrink-0">
        <img
          src={room.image_url}
          alt={room.name}
          className="w-12 h-12 rounded-full object-cover shadow-sm group-hover:scale-105 transition-transform"
        />
        {/* Online Indicator simulation */}
        {isActive && (
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between mb-0.5">
          <h3 className="font-bold text-sm text-gray-900 truncate">
            {room.name}
          </h3>
          {room.unreadCount > 0 ? (
            <span className="flex-shrink-0 ml-2 min-w-[20px] h-5 px-1.5 bg-blue-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm shadow-orange-200">
              {room.unreadCount}
            </span>
          ) : (
            <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap">
              {formatChatTime(room.lastMessageTime)}
            </span>
          )}
        </div>
        <p
          className={cn(
            "text-xs truncate flex items-center gap-1",
            room.unreadCount > 0 ? "text-gray-900 font-medium" : "text-gray-500"
          )}
        >
          {room.lastMessage}
        </p>
      </div>

      {/* Active Indicator Dot on the right */}
      {isActive && (
        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0 mr-1"></div>
      )}
    </div>
  );
};

ChatListItem.displayName = "ChatListItem";
