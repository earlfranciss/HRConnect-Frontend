export type Message = { sender: "user" | "ai"; text: string; time: string };

export const ChatStorage = {
  getConversationId: (): number | null => {
    const saved = localStorage.getItem("conversationId");
    return saved ? Number(saved) : null;
  },

  setConversationId: (id: number | null) => {
    if (id) localStorage.setItem("conversationId", id.toString());
    else localStorage.removeItem("conversationId");
  },

  getMessages: (): Message[] => {
    const saved = localStorage.getItem("chatMessages");
    return saved ? JSON.parse(saved) : [];
  },

  setMessages: (messages: Message[]) => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  },

  clear: () => {
    localStorage.removeItem("conversationId");
    localStorage.removeItem("chatMessages");
  },
};