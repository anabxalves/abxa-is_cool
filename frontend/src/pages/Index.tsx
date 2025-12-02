import { useState } from "react";
import { Sidebar } from "@/components/IsCoolGPT/Sidebar";
import { TopBar } from "@/components/IsCoolGPT/TopBar";
import { ChatArea } from "@/components/IsCoolGPT/ChatArea";
import { InputBox } from "@/components/IsCoolGPT/InputBox";

interface ChatMessage {
	id: string;
	role: "user" | "assistant";
	content: string;
}

interface Model {
	id: string;
	name: string;
}

const MODELS: Model[] = [
	{ id: "gemini", name: "Gemini 2.5 (Flash)" },
    { id: "openai", name: "GPT (OSS 20b)" },
	{ id: "llama", name: "Llama 3.3 (70b Versatile)" },
    { id: "moonshot", name: "Moonshot (Kimi K2)" },
];

const Index = () => {
	const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
	const [activeModelId, setActiveModelId] = useState(MODELS[0].id);
	const [messages, setMessages] = useState<ChatMessage[]>([]);

	const isInitialState = messages.length === 0;

    const handleSendMessage = async (content: string) => {
        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            role: "user",
            content,
        };
        setMessages((prev) => [...prev, userMessage]);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message: content,
                    model: activeModelId,
                }),
            });

            if (!response.ok) throw new Error("Erro na API");

            const data = await response.json();

            const aiMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: data.response,
            };
            setMessages((prev) => [...prev, aiMessage]);

        } catch (error) {
            console.error("Erro ao conectar com o backend:", error);
            const errorMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: "Desculpe, não consegui conectar ao servidor. Verifique se o Backend está rodando.",
            };
            setMessages((prev) => [...prev, errorMessage]);
        }
    };

	return (
		<div className="flex h-screen w-full overflow-hidden">
			<Sidebar
				isCollapsed={isSidebarCollapsed}
				onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
			/>

			<div className="flex flex-col flex-1 w-full">
				<TopBar
					models={MODELS}
					activeModelId={activeModelId}
					onModelSelect={setActiveModelId}
				/>

				<ChatArea messages={messages} isInitialState={isInitialState} />

				<div className={isInitialState ? "pb-12" : ""}>
					<InputBox
						onSendMessage={handleSendMessage}
						isInitialState={isInitialState}
					/>
				</div>
			</div>
		</div>
	);
};

export default Index;
