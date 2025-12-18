import { useState } from "react";
import type { Comment, Participant } from "../types/chat";
import { cn, formatTime, formatFileSize } from "../lib/utils";
import { Download, FileText, Image as ImageIcon, Video } from "lucide-react";
import { MediaViewer } from "./MediaViewer";

interface MessageBubbleProps {
  comment: Comment;
  participant: Participant;
  isCurrentUser: boolean;
}

export const MessageBubble = ({
  comment,
  participant,
  isCurrentUser,
}: MessageBubbleProps) => {
  const [selectedMedia, setSelectedMedia] = useState<{
    url: string;
    type: "image" | "video" | "pdf";
    filename: string;
  } | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [videoThumbnailLoaded, setVideoThumbnailLoaded] = useState(false);

  const renderMediaContent = () => {
    if (!comment.media) return null;

    switch (comment.type) {
      case "image":
        return (
          <div className="mt-2 rounded-lg overflow-hidden">
            <div
              className="relative w-full"
              style={{ minHeight: !imageLoaded ? "256px" : "auto" }}
            >
              {!imageLoaded && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">
                  <ImageIcon className="w-12 h-12 text-gray-400" />
                </div>
              )}
              <img
                src={comment.media.url}
                alt={comment.message}
                loading="lazy"
                className={cn(
                  "max-w-full h-auto max-h-64 object-cover cursor-pointer hover:opacity-90 transition",
                  !imageLoaded && "opacity-0"
                )}
                onLoad={() => setImageLoaded(true)}
                onClick={() =>
                  setSelectedMedia({
                    url: comment.media!.url,
                    type: "image",
                    filename: comment.media!.filename,
                  })
                }
              />
            </div>
            <div className="text-xs opacity-70 mt-1">
              <ImageIcon className="inline w-3 h-3 mr-1" />
              {comment.media.filename}
            </div>
          </div>
        );

      case "video":
        return (
          <div className="mt-2 rounded-lg overflow-hidden">
            <div
              className="relative cursor-pointer group"
              onClick={() =>
                setSelectedMedia({
                  url: comment.media!.url,
                  type: "video",
                  filename: comment.media!.filename,
                })
              }
            >
              <div
                className="relative w-full"
                style={{ minHeight: !videoThumbnailLoaded ? "256px" : "auto" }}
              >
                {!videoThumbnailLoaded && (
                  <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">
                    <Video className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                <img
                  src={comment.media.thumbnail}
                  alt="Video thumbnail"
                  loading="lazy"
                  className={cn(
                    "max-w-full h-auto max-h-64 object-cover",
                    !videoThumbnailLoaded && "opacity-0"
                  )}
                  onLoad={() => setVideoThumbnailLoaded(true)}
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition">
                  <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                    <div className="w-0 h-0 border-l-[12px] border-l-gray-800 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent ml-1"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-xs opacity-70 mt-1 flex items-center justify-between">
              <span>
                <Video className="inline w-3 h-3 mr-1" />
                {comment.media.filename}
              </span>
              <span>{formatFileSize(comment.media.size)}</span>
            </div>
          </div>
        );

      case "pdf":
        return (
          <div
            className="mt-2 p-3 border rounded-lg bg-white/5 hover:bg-white/10 transition cursor-pointer"
            onClick={() =>
              setSelectedMedia({
                url: comment.media!.url,
                type: "pdf",
                filename: comment.media!.filename,
              })
            }
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500/20">
                <FileText className="w-6 h-6 text-red-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">
                  {comment.media.filename}
                </div>
                <div className="text-xs opacity-70">
                  {formatFileSize(comment.media.size)} • {comment.media.pages}{" "}
                  pages
                </div>
              </div>
              <Download className="w-5 h-5 opacity-70" />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className={cn(
        "flex gap-2 mb-4 animate-in slide-in-from-bottom-2",
        isCurrentUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 shadow-sm",
          isCurrentUser ? "bg-blue-600 text-white" : "bg-gray-400 text-white"
        )}
      >
        {participant.name.charAt(0).toUpperCase()}
      </div>

      {/* Message Content */}
      <div
        className={cn(
          "flex flex-col max-w-[70%] md:max-w-[60%]",
          isCurrentUser && "items-end"
        )}
      >
        <div className="text-xs opacity-70 mb-1 px-1">{participant.name}</div>
        <div
          className={cn(
            "rounded-[20px] px-4 py-3 break-words shadow-sm relative group",
            isCurrentUser
              ? "bg-blue-500 text-white rounded-tr-none"
              : "bg-white text-gray-900 rounded-tl-none border border-gray-100"
          )}
        >
          {comment.type === "text" && (
            <p className="text-sm leading-relaxed">{comment.message}</p>
          )}
          {renderMediaContent()}

          {/* Reaction/More Button Placeholder on Hover */}
          <button className="absolute -right-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition p-1 bg-white shadow-sm rounded-full border border-gray-100">
            <div className="w-1 h-1 bg-gray-400 rounded-full mx-0.5" />
            <div className="w-1 h-1 bg-gray-400 rounded-full mx-0.5" />
            <div className="w-1 h-1 bg-gray-400 rounded-full mx-0.5" />
          </button>
        </div>
        <div className="text-[10px] text-gray-400 mt-1 px-1 flex items-center gap-1">
          {formatTime(comment.timestamp)}
          {isCurrentUser && <span>• Read</span>}
        </div>
      </div>

      {/* Media Viewer */}
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
