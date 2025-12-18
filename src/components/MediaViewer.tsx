import { X, Download, ZoomIn, ZoomOut } from "lucide-react";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

interface MediaViewerProps {
  mediaUrl: string;
  mediaType: "image" | "video" | "pdf";
  filename?: string;
  onClose: () => void;
}

export const MediaViewer = ({
  mediaUrl,
  mediaType,
  filename,
  onClose,
}: MediaViewerProps) => {
  const [zoom, setZoom] = useState(1);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.25, 0.5));
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = mediaUrl;
    link.download = filename || "download";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 bg-gradient-to-b from-black/50 to-transparent">
        <div className="text-white">
          {filename && <p className="text-sm font-medium">{filename}</p>}
        </div>
        <div className="flex items-center gap-2">
          {mediaType === "image" && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleZoomOut();
                }}
                className="p-2 hover:bg-white/10 rounded-lg transition text-white"
              >
                <ZoomOut className="w-5 h-5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleZoomIn();
                }}
                className="p-2 hover:bg-white/10 rounded-lg transition text-white"
              >
                <ZoomIn className="w-5 h-5" />
              </button>
            </>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDownload();
            }}
            className="p-2 hover:bg-white/10 rounded-lg transition text-white"
          >
            <Download className="w-5 h-5" />
          </button>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Media Content */}
      <div
        className="max-w-7xl max-h-[90vh] p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {mediaType === "image" && (
          <img
            src={mediaUrl}
            alt="Preview"
            style={{ transform: `scale(${zoom})` }}
            className="max-w-full max-h-full object-contain transition-transform duration-200"
          />
        )}
        {mediaType === "video" && (
          <video
            src={mediaUrl}
            controls
            autoPlay
            className="max-w-full max-h-full rounded-lg"
          />
        )}
        {mediaType === "pdf" && (
          <iframe
            src={mediaUrl}
            className="w-full h-[80vh] bg-white rounded-lg"
            title="PDF Preview"
          />
        )}
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
        Click outside to close
      </div>
    </div>,
    document.body
  );
};
