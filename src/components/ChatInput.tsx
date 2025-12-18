import { useState, useRef, useEffect } from "react";
import { Send, Paperclip, Smile } from "lucide-react";
import type { Comment } from "../types/chat";

interface ChatInputProps {
  onSendMessage: (
    message: string,
    fileData?: Omit<Comment, "id" | "sender" | "timestamp">
  ) => void;
}

const EMOJIS = [
  "😊",
  "😂",
  "❤️",
  "👍",
  "🎉",
  "🔥",
  "✨",
  "💯",
  "😍",
  "🤔",
  "😎",
  "🙏",
  "👏",
  "💪",
  "🎊",
  "🌟",
  "😢",
  "😅",
  "🤣",
  "😭",
  "🥰",
  "😘",
  "🤗",
  "🤩",
  "👋",
  "✌️",
  "🤝",
  "💼",
  "📱",
  "💻",
  "📧",
  "📞",
];

export const ChatInput = ({ onSendMessage }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [objectUrls, setObjectUrls] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  // Close emoji picker on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showEmojiPicker]);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [objectUrls]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() || selectedFile) {
      if (selectedFile) {
        // Determine file type
        const fileType = selectedFile.type;
        let commentType: "image" | "video" | "pdf" = "pdf";

        if (fileType.startsWith("image/")) {
          commentType = "image";
        } else if (fileType.startsWith("video/")) {
          commentType = "video";
        }

        // Create object URL for preview
        const fileUrl = URL.createObjectURL(selectedFile);
        setObjectUrls((prev) => [...prev, fileUrl]);

        const fileData: Omit<Comment, "id" | "sender" | "timestamp"> = {
          type: commentType,
          message: message.trim() || selectedFile.name,
          media: {
            url: fileUrl,
            thumbnail: fileUrl,
            filename: selectedFile.name,
            size: selectedFile.size,
          },
        };

        onSendMessage(message.trim() || selectedFile.name, fileData);
      } else {
        onSendMessage(message);
      }

      setMessage("");
      setSelectedFile(null);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setMessage((prev) => prev + emoji);
    setShowEmojiPicker(false);
    inputRef.current?.focus();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setMessage((prev) => prev || `Sending ${file.name}`);
    }
  };

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 pb-6 px-6 z-10 w-full pointer-events-none">
      {/* Floating Input Bar */}
      <div className="max-w-4xl mx-auto bg-white/90 backdrop-blur-xl rounded-3xl px-4 py-3 flex items-center gap-2 shadow-lg border border-gray-200/50 pointer-events-auto relative">
        <form
          onSubmit={handleSubmit}
          className="flex-1 flex items-center gap-2"
        >
          {/* Emoji Picker */}
          {showEmojiPicker && (
            <div
              ref={emojiPickerRef}
              className="absolute bottom-full left-4 mb-2 bg-white rounded-2xl shadow-xl border border-gray-200 p-3 w-80 max-h-64 overflow-y-auto animate-in fade-in slide-in-from-bottom-2 duration-200"
            >
              <div className="grid grid-cols-8 gap-2">
                {EMOJIS.map((emoji, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleEmojiSelect(emoji)}
                    className="text-2xl hover:bg-gray-100 rounded-lg p-2 transition"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}
          {/* Emoji Button */}
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-2 hover:bg-gray-100 rounded-full transition text-gray-400 hover:text-gray-600 flex-shrink-0"
            aria-label="Open emoji picker"
            aria-expanded={showEmojiPicker}
          >
            <Smile className="w-5 h-5" />
          </button>

          <input
            ref={inputRef}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Your Message"
            className="flex-1 px-3 py-2 bg-transparent border-none focus:outline-none text-sm text-gray-900 placeholder-gray-400"
            aria-label="Message input"
          />

          <div className="flex items-center gap-1">
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              className="hidden"
              accept="image/*,video/*,.pdf,.doc,.docx"
            />

            {/* Paperclip button */}
            <button
              type="button"
              onClick={handleAttachClick}
              className="p-2 hover:bg-gray-100 rounded-full transition text-gray-400 hover:text-gray-600"
              title="Attach file"
            >
              <Paperclip className="w-5 h-5" />
            </button>

            <button
              type="submit"
              disabled={!message.trim() && !selectedFile}
              className="p-2.5 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-200 rounded-full transition text-white disabled:text-gray-400 shadow-md disabled:shadow-none"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* File preview */}
        {selectedFile && (
          <div className="absolute -top-12 left-4 bg-white rounded-lg shadow-md px-3 py-2 text-xs text-gray-600 flex items-center gap-2 border border-gray-200">
            <Paperclip className="w-3 h-3" />
            <span className="max-w-[200px] truncate">{selectedFile.name}</span>
            <button
              type="button"
              onClick={() => setSelectedFile(null)}
              className="text-gray-400 hover:text-red-500 ml-1"
            >
              ×
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
