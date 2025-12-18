import type { ChatData } from "../types/chat";
import { ChatListItem } from "./ChatListItem";
import { Search, Plus, ChevronDown } from "lucide-react";
import { useState, useEffect, useCallback, useMemo } from "react";

interface SidebarProps {
  chatRooms: ChatData[];
  selectedRoomId: number;
  onSelectRoom: (roomId: number) => void;
  currentUserName: string;
}

export const Sidebar = ({
  chatRooms,
  selectedRoomId,
  onSelectRoom,
  currentUserName,
}: SidebarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);
  const [isMessagesOpen, setIsMessagesOpen] = useState(true);
  const [filterType, setFilterType] = useState<"all" | "group" | "contact">(
    "all"
  );
  const [animationKey, setAnimationKey] = useState(0);

  // Trigger animation when filter changes
  useEffect(() => {
    setAnimationKey((prev) => prev + 1);
  }, [filterType, searchQuery]);

  const handleFilterChange = useCallback(
    (type: "all" | "group" | "contact") => {
      setFilterType(type);
    },
    []
  );

  const filteredRooms = useMemo(() => {
    return chatRooms.filter((chat) => {
      // Filter by search query
      const matchesSearch = chat.room.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      // Filter by type
      let matchesType = true;
      if (filterType === "group") {
        matchesType = chat.room.type === "group";
      } else if (filterType === "contact") {
        matchesType = chat.room.type === "single";
      }

      return matchesSearch && matchesType;
    });
  }, [chatRooms, searchQuery, filterType]);

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Search Bar */}
      <div className="px-6 mt-6 mb-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-gray-50 border-none focus:outline-none focus:ring-2 focus:ring-gray-100 text-sm text-gray-700 placeholder-gray-400 transition-shadow shadow-sm"
          />
        </div>
      </div>

      {/* Messages Header */}
      <div className="px-6 mb-2">
        <div
          onClick={() => setIsMessagesOpen(!isMessagesOpen)}
          className="flex flex-col items-start justify-between cursor-pointer group select-none"
        >
          <div className="flex items-center gap-1">
            <h2 className="font-bold text-xl text-gray-900 group-hover:opacity-80 transition">
              Messages
            </h2>
            <ChevronDown
              className={`w-4 h-4 text-gray-500 mt-1 transition-transform ${
                !isMessagesOpen ? "-rotate-90" : ""
              }`}
            />
          </div>
        </div>
      </div>

      {/* Chat List */}
      {isMessagesOpen && (
        <div className="flex flex-col flex-1 min-h-0">
          {/* Filter Tabs */}
          <div className="px-6 mb-3">
            <div className="flex bg-gray-100 justify-between w-full text-sm font-medium p-1.5 rounded-3xl gap-1">
              <button
                onClick={() => handleFilterChange("all")}
                className={`flex-1 px-4 py-2 rounded-3xl transition-all ${
                  filterType === "all"
                    ? "bg-white text-blue-500 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                aria-pressed={filterType === "all"}
                aria-label="Show all chats"
              >
                All Chat
              </button>
              <button
                onClick={() => handleFilterChange("group")}
                className={`flex-1 px-4 py-2 rounded-3xl transition-all ${
                  filterType === "group"
                    ? "bg-white text-blue-500 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                aria-pressed={filterType === "group"}
                aria-label="Show group chats only"
              >
                Group
              </button>
              <button
                onClick={() => handleFilterChange("contact")}
                className={`flex-1 px-4 py-2 rounded-3xl transition-all ${
                  filterType === "contact"
                    ? "bg-white text-blue-500 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                aria-pressed={filterType === "contact"}
                aria-label="Show contacts only"
              >
                Contact
              </button>
            </div>
          </div>

          {/* Chat List Container */}
          <div
            key={animationKey}
            className="flex-1 overflow-y-auto px-4 pb-4 space-y-1 scrollbar-hide"
          >
            {filteredRooms.length === 0 ? (
              <div className="flex items-center justify-center h-32 text-gray-400 text-sm opacity-0 animate-[fadeIn_0.3s_ease-in-out_forwards]">
                No conversations found
              </div>
            ) : (
              filteredRooms.map((chat, index) => (
                <div
                  key={`${animationKey}-${chat.room.id}`}
                  className="opacity-0 translate-x-[-20px] animate-[slideInFade_0.3s_ease-out_forwards]"
                  style={{ animationDelay: `${index * 40}ms` }}
                >
                  <ChatListItem
                    room={chat.room}
                    isActive={chat.room.id === selectedRoomId}
                    onClick={() => onSelectRoom(chat.room.id)}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Account */}
      <div className="mt-auto px-6 py-4 border-t border-gray-100">
        <div className="relative">
          {/* Trigger */}
          <div
            onClick={() => setIsSwitcherOpen(!isSwitcherOpen)}
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 cursor-pointer transition select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-sm relative shrink-0">
              {currentUserName.charAt(0).toUpperCase()}
              <div className="absolute -bottom-1 -right-1 bg-green-500 border-2 border-white w-3 h-3 rounded-full"></div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-900 text-sm truncate">
                {currentUserName}
              </h3>
              <p className="text-xs text-blue-500 font-medium">
                customer@mail.com
              </p>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-gray-400 transition-transform ${
                isSwitcherOpen ? "rotate-180" : ""
              }`}
            />
          </div>

          {/* Dropdown Content */}
          {isSwitcherOpen && (
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-20 animate-in fade-in slide-in-from-bottom-2 duration-200">
              {/* Create New */}
              <button className="w-full flex items-center justify-center gap-2 p-3 text-xs font-semibold text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition">
                <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                  <Plus className="w-3 h-3" />
                </div>
                Add New Account
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
