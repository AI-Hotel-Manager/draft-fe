import { Message } from "./message";

export type ChatResponse = {
    messages: Message[];
    conversation_id?: string;
};
