import { useState } from "react";
import type { Comment, Room } from "../types/chat";
import {
  X,
  ChevronDown,
  Smile,
  Phone,
  Video,
  MoreHorizontal,
} from "lucide-react";
import { MediaViewer } from "./MediaViewer";

interface RightSidebarProps {
  room: Room;
  comments: Comment[];
  onClose: () => void;
  currentUserId: string;
}

export const RightSidebar = ({
  room,
  comments,
  onClose,
  currentUserId,
}: RightSidebarProps) => {
  const [selectedMedia, setSelectedMedia] = useState<{
    url: string;
    type: "image" | "video" | "pdf";
    filename: string;
  } | null>(null);
  const [isMembersExpanded, setIsMembersExpanded] = useState(true);
  const [isMediaExpanded, setIsMediaExpanded] = useState(true);
  const [isTasksExpanded, setIsTasksExpanded] = useState(true);

  // Filter media comments
  const images = comments.filter((c) => c.type === "image" && c.media);
  const videos = comments.filter((c) => c.type === "video" && c.media);
  const allMedia = [...images, ...videos];
  const files = comments.filter((c) => c.type === "pdf" && c.media);

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Smile className="w-5 h-5 text-gray-500" />
          <h3 className="font-bold text-lg text-gray-900">Chat Details</h3>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full transition"
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 space-y-6 scrollbar-hide pb-6">
        {/* Members Section - Only for Group */}
        {room.type === "group" && (
          <div>
            <button
              onClick={() => setIsMembersExpanded(!isMembersExpanded)}
              className="w-full flex items-center justify-between py-2 group"
            >
              <h4 className="font-medium text-sm text-gray-500 group-hover:text-gray-700 transition">
                Members {room.participant.length}
              </h4>
              <ChevronDown
                className={`w-4 h-4 text-gray-400 transition-transform ${
                  isMembersExpanded ? "rotate-180" : ""
                }`}
              />
            </button>

            {isMembersExpanded && (
              <div className="space-y-3 mt-2">
                {room.participant.map((participant) => (
                  <div
                    key={participant.id}
                    className="flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={`https://ui-avatars.com/api/?name=${participant.name}&background=random`}
                        alt={participant.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <p className="font-bold text-sm text-gray-700">
                        {participant.name}
                        {participant.id === currentUserId && (
                          <span className="ml-2 px-1.5 py-0.5 bg-yellow-100 text-yellow-700 text-[10px] rounded uppercase font-bold">
                            Owner
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                      <button className="p-1.5 hover:bg-gray-100 rounded-full text-gray-400">
                        <Phone className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1.5 hover:bg-gray-100 rounded-full text-gray-400">
                        <Video className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1.5 hover:bg-gray-100 rounded-full text-gray-400">
                        <MoreHorizontal className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Media Section */}
        <div>
          <button
            onClick={() => setIsMediaExpanded(!isMediaExpanded)}
            className="w-full flex items-center justify-between py-2 group"
          >
            <h4 className="font-medium text-sm text-gray-500 group-hover:text-gray-700 transition">
              Media {allMedia.length}
            </h4>
            <ChevronDown
              className={`w-4 h-4 text-gray-400 transition-transform ${
                isMediaExpanded ? "rotate-180" : ""
              }`}
            />
          </button>

          {isMediaExpanded && (
            <div className="mt-2">
              {allMedia.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {allMedia.slice(0, 9).map((comment) => (
                    <div
                      key={comment.id}
                      className="aspect-square rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition relative shadow-sm border border-gray-100"
                      onClick={() =>
                        setSelectedMedia({
                          url: comment.media!.url,
                          type: comment.type as "image" | "video",
                          filename: comment.media!.filename,
                        })
                      }
                    >
                      <img
                        src={comment.media!.thumbnail}
                        alt="Media"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-gray-400">
                  <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-2">
                    <div className="w-6 h-6 border-2 border-dashed border-gray-300 rounded-md" />
                  </div>
                  <p className="text-xs">No media shared</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Files Section */}
        <div>
          <button
            onClick={() => setIsTasksExpanded(!isTasksExpanded)}
            className="w-full flex items-center justify-between py-2 group"
          >
            <h4 className="font-medium text-sm text-gray-500 group-hover:text-gray-700 transition">
              Files {files.length}
            </h4>
            <ChevronDown
              className={`w-4 h-4 text-gray-400 transition-transform ${
                isTasksExpanded ? "rotate-180" : ""
              }`}
            />
          </button>

          {isTasksExpanded && (
            <div className="mt-2 space-y-2">
              {files.length > 0 ? (
                files.slice(0, 5).map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 cursor-pointer transition"
                  >
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold text-xs flex-shrink-0">
                      PDF
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-700 truncate">
                        {file.media!.filename}
                      </p>
                      <p className="text-xs text-gray-500">
                        {file.media!.size
                          ? `${(file.media!.size / 1024).toFixed(1)} KB`
                          : "Unknown size"}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-center text-gray-400 py-4">
                  No files shared
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Media Viewer Modal */}
      {selectedMedia && (
        <MediaViewer
          mediaUrl={selectedMedia.url}
          mediaType={selectedMedia.type}
          filename={selectedMedia.filename}
          onClose={() => setSelectedMedia(null)}
        />
      )}
    </div>
  );
};
