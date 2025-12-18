export const formatChatTime = (timestamp: string): string => {
  const messageDate = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - messageDate.getTime();
  const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));

  // Today - show time only (HH:MM)
  if (diffDays === 0) {
    return messageDate.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }

  // Yesterday
  if (diffDays === 1) {
    return "Yesterday";
  }

  // Within this week - show day name
  if (diffDays < 7) {
    return messageDate.toLocaleDateString("en-US", { weekday: "short" });
  }

  // Older - show date
  return messageDate.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
  });
};
