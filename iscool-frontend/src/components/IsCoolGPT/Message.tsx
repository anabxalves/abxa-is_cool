import { Bot, User } from "lucide-react";
import { motion } from "framer-motion";

interface MessageProps {
	role: "user" | "assistant";
	content: string;
	index: number;
}

export const Message = ({ role, content, index }: MessageProps) => {
	const isUser = role === "user";

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3, delay: index * 0.1 }}
			className={`flex gap-4 mb-6 ${isUser ? "justify-end" : "justify-start"}`}
		>
			{!isUser && (
				<div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 shadow-soft">
					<Bot className="w-5 h-5 text-primary-foreground" />
				</div>
			)}

			<div
				className={`message-bubble max-w-[70%] ${
					isUser
						? "bg-chat-user text-foreground"
						: "bg-chat-ai text-foreground border border-border"
				}`}
			>
				<p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
			</div>

			{isUser && (
				<div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 shadow-soft">
					<User className="w-5 h-5 text-secondary-foreground" />
				</div>
			)}
		</motion.div>
	);
};
