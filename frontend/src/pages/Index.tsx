import { useState, useEffect } from "react";
import { Sidebar } from "@/components/IsCoolGPT/Sidebar";
import { TopBar } from "@/components/IsCoolGPT/TopBar";
import { ChatArea } from "@/components/IsCoolGPT/ChatArea";
import { InputBox } from "@/components/IsCoolGPT/InputBox";
import { Menu } from "lucide-react";

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
    { id: "openai", name: "OpenAI GPT OSS" },
	{ id: "llama", name: "Llama 3.3" },
    { id: "moonshot", name: "Moonshot (Kimi K2)" },
];

const Index = () => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [hasInteractedWithMenu, setHasInteractedWithMenu] = useState(false);
    const [isMobile, setIsMobile] = useState(() => window.innerWidth < 1024);
    const [activeModelId, setActiveModelId] = useState(MODELS[0].id);
    const [messages, setMessages] = useState<ChatMessage[]>([]);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024);
        };

        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const isInitialState = messages.length === 0;

    const handleMenuClick = () => {
        setIsMobileSidebarOpen(true);
        setHasInteractedWithMenu(true);
    };

    const handleSendMessage = async (content: string) => {
        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            role: "user",
            content,
        };

        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    messages: updatedMessages.map(msg => ({
                        role: msg.role,
                        content: msg.content
                    })),
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
        <div className="flex h-screen w-full overflow-hidden bg-background relative">
            <Sidebar
                isCollapsed={isSidebarCollapsed}
                isMobile={isMobile}
                isOpen={isMobileSidebarOpen}
                onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                onCloseMobile={() => setIsMobileSidebarOpen(false)}
            />

            <div className="flex flex-col flex-1 w-full relative h-full">
                <TopBar
                    models={MODELS}
                    activeModelId={activeModelId}
                    onModelSelect={setActiveModelId}
                    isMobile={isMobile}
                    onMenuClick={handleMenuClick}
                    showMenuHighlight={!hasInteractedWithMenu && isInitialState}
                />

                <ChatArea messages={messages} isInitialState={isInitialState} />

                <div className="pb-12 p-4">
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