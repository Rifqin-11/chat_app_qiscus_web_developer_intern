import { useState, useEffect, useCallback } from "react";
import type { ChatData, ChatResponse, Comment } from "../types/chat";
import { ChatHeader } from "./ChatHeader";
import { ChatMessages } from "./ChatMessages";
import { ChatInput } from "./ChatInput";
import { Sidebar } from "./Sidebar";
import { RightSidebar } from "./RightSidebar";
import { X } from "lucide-react";

export const ChatContainer = () => {
  const [allChatData, setAllChatData] = useState<ChatData[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
  const currentUserId = "customer@mail.com"; // Simulate current user

  const [currentUserName, setCurrentUserName] = useState("Thomas");

  useEffect(() => {
    // Fetch chat data
    const fetchChatData = async () => {
      try {
        const response = await fetch("/chat_data.json");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: ChatResponse = await response.json();

        if (data.results && data.results.length > 0) {
          setAllChatData(data.results);
          setSelectedRoomId(data.results[0].room.id);

          // Find current user name
          const firstRoom = data.results[0];
          const me = firstRoom.room.participant.find(
            (p) => p.id === currentUserId
          );
          if (me) {
            setCurrentUserName(me.name);
          }
        }
      } catch (error) {
        console.error("Error fetching chat data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChatData();
  }, []);

  const handleSendMessage = (
    message: string,
    fileData?: Omit<Comment, "id" | "sender" | "timestamp">
  ) => {
    if (selectedRoomId === null || (!message.trim() && !fileData)) return;

    const chatIndex = allChatData.findIndex(
      (chat) => chat.room.id === selectedRoomId
    );
    if (chatIndex === -1) {
      console.error("Chat room not found:", selectedRoomId);
      return;
    }

    const newComment: Comment = fileData
      ? {
          ...fileData,
          id: Date.now(),
          sender: currentUserId,
          timestamp: new Date().toISOString(),
        }
      : {
          id: Date.now(),
          type: "text",
          message,
          sender: currentUserId,
          timestamp: new Date().toISOString(),
        };

    const updatedChatData = [...allChatData];
    updatedChatData[chatIndex] = {
      ...updatedChatData[chatIndex],
      comments: [...updatedChatData[chatIndex].comments, newComment],
      room: {
        ...updatedChatData[chatIndex].room,
        lastMessage: message,
        lastMessageTime: new Date().toISOString(),
      },
    };

    setAllChatData(updatedChatData);
  };

  const handleSelectRoom = useCallback((roomId: number) => {
    setSelectedRoomId(roomId);
    setIsSidebarOpen(false);
  }, []);

  const selectedChat = allChatData.find(
    (chat) => chat.room.id === selectedRoomId
  );

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (allChatData.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <p className="text-gray-500">No chat data available</p>
      </div>
    );
  }

  return (
    <div className="h-[100dvh] flex bg-[#F0F2F5] overflow-hidden font-sans">
      {/* Sidebar - Desktop */}
      <div className="hidden md:flex w-80 lg:w-[340px] flex-shrink-0 flex-col bg-white overflow-hidden">
        <Sidebar
          chatRooms={allChatData}
          selectedRoomId={selectedRoomId || 0}
          onSelectRoom={handleSelectRoom}
          currentUserName={currentUserName}
        />
      </div>

      {/* Sidebar - Mobile (Overlay) */}
      {isSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-all"
          onClick={() => setIsSidebarOpen(false)}
        >
          <div
            className="w-[85vw] max-w-[320px] h-full bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Chats</h2>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <Sidebar
              chatRooms={allChatData}
              selectedRoomId={selectedRoomId || 0}
              onSelectRoom={handleSelectRoom}
              currentUserName="Thomas"
            />
          </div>
        </div>
      )}

      {/* Chat Area */}
      <div
        className="flex-1 flex flex-col min-w-0 relative bg-[#FAFCFE] overflow-hidden"
        style={{
          backgroundImage: `
          radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.03) 0%, transparent 50%),
          radial-gradient(circle at 80% 70%, rgba(147, 51, 234, 0.02) 0%, transparent 50%),
          radial-gradient(circle at 40% 80%, rgba(14, 165, 233, 0.02) 0%, transparent 50%)
        `,
        }}
      >
        {selectedChat ? (
          <>
            <ChatHeader
              room={selectedChat.room}
              onMoreClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
              onMenuClick={() => setIsSidebarOpen(true)}
            />
            <ChatMessages
              comments={selectedChat.comments}
              participants={selectedChat.room.participant}
              currentUserId={currentUserId}
            />
            <ChatInput onSendMessage={handleSendMessage} />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <p className="text-gray-500 mb-4">
                Select a conversation to start messaging
              </p>
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="md:hidden px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                View Conversations
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Right Sidebar - Desktop */}
      {isRightSidebarOpen && selectedChat && (
        <div className="hidden xl:block w-80 flex-shrink-0 bg-white overflow-hidden animate-in slide-in-from-right duration-300 fade-in">
          <RightSidebar
            room={selectedChat.room}
            comments={selectedChat.comments}
            onClose={() => setIsRightSidebarOpen(false)}
            currentUserId={currentUserId}
          />
        </div>
      )}

      {/* Right Sidebar Mobile */}
      {isRightSidebarOpen && selectedChat && (
        <div
          className="xl:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsRightSidebarOpen(false)}
        >
          <div
            className="ml-auto w-80 h-full bg-white shadow-2xl animate-in slide-in-from-right duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <RightSidebar
              room={selectedChat.room}
              comments={selectedChat.comments}
              onClose={() => setIsRightSidebarOpen(false)}
              currentUserId={currentUserId}
            />
          </div>
        </div>
      )}
    </div>
  );
};
