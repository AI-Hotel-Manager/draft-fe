import { CHAT_API } from "@/lib/urls";
import { ChatResponse } from "@/types/chat";

export const postMessage = async (message: string, conversationId: string | null): Promise<ChatResponse> => {
    const postBody = {
        message: message,
        conversation_id: conversationId
    };
    const resp = await fetch(CHAT_API, {
        method: "POST",
        body: JSON.stringify(postBody),
        headers: {
            "Content-Type": "application/json",
        },
    });
    const data: ChatResponse = await resp.json();
    return data;
};
