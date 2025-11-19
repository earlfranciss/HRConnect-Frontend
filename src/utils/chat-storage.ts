const isBrowser = typeof window !== "undefined";

export type Message = { sender: "user" | "ai"; text: string; time: string };


// Stores the selected conversation id
// Used when the user switches between chat widget and full screen chat window 
export const ChatStorage = {
  getConversationId: (): number | null => {
    if (!isBrowser) return null;

    const saved = localStorage.getItem("conversationId");
    return saved ? Number(saved) : null;
  },

  setConversationId: (id: number | null) => {
    if (!isBrowser) return;

    if (id) localStorage.setItem("conversationId", id.toString());
    else localStorage.removeItem("conversationId");
  },

  getMessages: (): Message[] => {
    if (!isBrowser) return []; 
    
    const saved = localStorage.getItem("chatMessages");
    return saved ? JSON.parse(saved) : [];
  },

  setMessages: (messages: Message[]) => {
    if (!isBrowser) return; 
    
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  },

  clear: () => {
    if (!isBrowser) return;

    localStorage.removeItem("conversationId");
    localStorage.removeItem("chatMessages");
  },
};