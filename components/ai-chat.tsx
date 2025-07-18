"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, X, Bot, User } from "lucide-react";
import { ChangeEvent, FormEvent, useState } from "react";
import { Message } from "@/types/message";
import { postMessage } from "@/app/api/chat/chatApi";
import { v4 as uuidv4 } from "uuid";

interface AIChatProps {
    onClose: () => void;
}

export function AIChat({ onClose }: AIChatProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [input, setInput] = useState("");
    const [conversationId, setConversationId] = useState<string | null>(null);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInput(value);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const newUserMessage: Message = {
            id: uuidv4(),
            role: "user",
            content: input,
        };
        setMessages((prev) => [...prev, newUserMessage]);
        setIsLoading(true);
        setInput("");
        try {
            const data = await postMessage(input, conversationId);
            console.log("data.conversation_id")
            console.log("data.conversation_id")
            console.log(data.conversation_id)
            if (!conversationId) {
                setConversationId(data.conversation_id ? data.conversation_id : null);
            }
            const newAiMessage: Message = {
                role: "assistant",
                id: uuidv4(),
                content: data.messages[0].content,
            };

            setMessages((prev) => [...prev, newAiMessage]);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="max-w-md h-[800px] flex flex-col overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Bot className="w-5 h-5 text-blue-600" />
                            <span>AI Hotel Assistant</span>
                        </div>
                        <Button variant="ghost" size="sm" onClick={onClose}>
                            <X className="w-4 h-4" />
                        </Button>
                    </DialogTitle>
                </DialogHeader>

                <div className="flex-1 flex flex-col">
                    <ScrollArea className="flex-1 p-4">
                        <div className="space-y-4">
                            {messages.map((message) => (
                                <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                                    <div
                                        className={`flex items-start space-x-2 max-w-[80%] ${
                                            message.role === "user" ? "flex-row-reverse space-x-reverse" : ""
                                        }`}
                                    >
                                        <div
                                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                                message.role === "user" ? "bg-blue-600" : "bg-gray-200"
                                            }`}
                                        >
                                            {message.role === "user" ? (
                                                <User className="w-4 h-4 text-white" />
                                            ) : (
                                                <Bot className="w-4 h-4 text-gray-600" />
                                            )}
                                        </div>
                                        <div
                                            className={`rounded-lg p-3 ${
                                                message.role === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                                            }`}
                                        >
                                            {message.content}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="flex items-start space-x-2">
                                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                            <Bot className="w-4 h-4 text-gray-600" />
                                        </div>
                                        <div className="bg-gray-100 rounded-lg p-3">
                                            <div className="flex space-x-1">
                                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                                <div
                                                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                                    style={{ animationDelay: "0.1s" }}
                                                ></div>
                                                <div
                                                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                                    style={{ animationDelay: "0.2s" }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </ScrollArea>

                    <form onSubmit={handleSubmit} className="p-4 border-t">
                        <div className="flex space-x-2">
                            <Input
                                value={input}
                                onChange={handleInputChange}
                                placeholder="Ask about rooms, availability, or make a booking..."
                                disabled={isLoading}
                            />
                            <Button type="submit" disabled={isLoading || !input.trim()}>
                                <Send className="w-4 h-4" />
                            </Button>
                        </div>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
