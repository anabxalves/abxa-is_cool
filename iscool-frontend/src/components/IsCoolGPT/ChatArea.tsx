import { useRef, useEffect } from "react";
import { Message } from "./Message";
import { motion, AnimatePresence } from "framer-motion";

interface ChatMessage {
	id: string;
	role: "user" | "assistant";
	content: string;
}

interface ChatAreaProps {
	messages: ChatMessage[];
	isInitialState: boolean;
}

export const ChatArea = ({ messages, isInitialState }: ChatAreaProps) => {
	const messagesEndRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	return (
		<div className="flex-1 overflow-y-auto">
			{isInitialState ? (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="flex flex-col items-center justify-center min-h-[60vh] px-6"
				>
					<h2 className="text-5xl font-bold text-foreground mb-8 text-center tracking-tight">
						Como posso te ajudar?
					</h2>
					<p className="text-muted-foreground text-center max-w-md">
						Escolha um modelo acima e comece a conversar
					</p>
				</motion.div>
			) : (
				<div className="max-w-4xl mx-auto px-6 py-8">
					<AnimatePresence>
						{messages.map((msg, index) => (
							<Message
								key={msg.id}
								role={msg.role}
								content={msg.content}
								index={index}
							/>
						))}
					</AnimatePresence>
					<div ref={messagesEndRef} />
				</div>
			)}
		</div>
	);
};
