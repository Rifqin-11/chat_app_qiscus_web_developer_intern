import type { Room } from "../types/chat";
import { X, Phone, Video, Users } from "lucide-react";

interface RoomInfoModalProps {
  room: Room;
  onClose: () => void;
}

export const RoomInfoModal = ({ room, onClose }: RoomInfoModalProps) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="font-semibold text-lg text-gray-900">
            {room.type === "group" ? "Group Info" : "Contact Info"}
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(80vh-80px)]">
          {/* Profile Section */}
          <div className="flex flex-col items-center py-6 border-b border-gray-200">
            <img
              src={room.image_url}
              alt={room.name}
              className="w-24 h-24 rounded-full object-cover mb-4"
            />
            <h4 className="font-semibold text-xl text-gray-900 mb-1">
              {room.name}
            </h4>
            <p className="text-sm text-gray-500">
              {room.type === "group"
                ? `${room.participant.length} members`
                : "Online"}
            </p>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-6">
              <button className="flex flex-col items-center gap-2 p-3 hover:bg-gray-50 rounded-lg transition">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Phone className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-xs text-gray-600">Audio</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-3 hover:bg-gray-50 rounded-lg transition">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Video className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-xs text-gray-600">Video</span>
              </button>
            </div>
          </div>

          {/* Members Section (for groups) */}
          {room.type === "group" && (
            <div className="px-6 py-4">
              <div className="flex items-center justify-between mb-4">
                <h5 className="font-semibold text-sm text-gray-900 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  {room.participant.length} Members
                </h5>
              </div>

              <div className="space-y-1">
                {room.participant.map((participant) => (
                  <div
                    key={participant.id}
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition"
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-sm">
                      {participant.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm text-gray-900">
                        {participant.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {participant.role === 0
                          ? "Admin"
                          : participant.role === 1
                          ? "Agent"
                          : "Member"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Info Section (for single chat) */}
          {room.type === "single" && room.participant.length > 0 && (
            <div className="px-6 py-4 space-y-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Email</p>
                <p className="text-sm text-gray-900">
                  {room.participant[1]?.id || room.participant[0]?.id}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Role</p>
                <p className="text-sm text-gray-900">
                  {room.participant[1]?.role === 0
                    ? "Admin"
                    : room.participant[1]?.role === 1
                    ? "Agent"
                    : "Customer"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
