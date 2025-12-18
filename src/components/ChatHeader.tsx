import type { Room } from "../types/chat";
import { Menu, Phone, Video, Info } from "lucide-react";

interface ChatHeaderProps {
  room: Room;
  onMoreClick: () => void;
  onMenuClick: () => void;
}

export const ChatHeader = ({
  room,
  onMoreClick,
  onMenuClick,
}: ChatHeaderProps) => {
  return (
    <div className="bg-white border-b border-gray-100 px-4 py-3 md:px-6 md:py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Mobile menu button */}
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 -ml-2 hover:bg-gray-100 rounded-lg transition"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>

          <div className="flex items-center gap-3">
            {/* Room Icon/Avatar */}
            <img
              src={
                room.image_url ||
                `https://ui-avatars.com/api/?name=${room.name}&background=random`
              }
              alt={room.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex flex-col">
              <span className="font-bold text-lg text-gray-900">
                {room.name}
              </span>
              {room.type === "group" && (
                <span className="text-xs text-gray-500">
                  {room.participant.length} members
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-gray-100 rounded-full transition text-gray-400">
            <Video className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition text-gray-400">
            <Phone className="w-5 h-5" />
          </button>
          <button
            onClick={onMoreClick}
            className="p-2 hover:bg-gray-100 rounded-full transition text-gray-400"
          >
            <Info className="w-5 h-5" />
          </button>

          {/* Mini Avatars - Only for Group Chats */}
          {room.type === "group" && (
            <div className="hidden md:flex items-center -space-x-2 border-l border-gray-200 pl-4 ml-2">
              {room.participant.slice(0, 2).map((p, i) => (
                <img
                  key={i}
                  src={`https://ui-avatars.com/api/?name=${p.name}&background=random`}
                  alt={p.name}
                  className="w-8 h-8 rounded-full border-2 border-white"
                />
              ))}
              <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs font-semibold text-gray-500">
                +{room.participant.length - 2}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
