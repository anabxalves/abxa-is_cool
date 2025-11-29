import { useState, FormEvent, KeyboardEvent } from "react";
import { Paperclip, Send } from "lucide-react";
import { motion } from "framer-motion";

interface InputBoxProps {
	onSendMessage: (message: string) => void;
	isInitialState: boolean;
}

export const InputBox = ({ onSendMessage, isInitialState }: InputBoxProps) => {
	const [message, setMessage] = useState("");

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		if (message.trim()) {
			onSendMessage(message);
			setMessage("");
		}
	};

	const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSubmit(e);
		}
	};

	return (
		<motion.div
			initial={false}
			animate={{
				y: 0,
				scale: 1,
			}}
			transition={{ duration: 0.3 }}
			className={`w-full ${
				isInitialState ? "max-w-3xl mx-auto" : "max-w-4xl mx-auto px-6 pb-8"
			}`}
		>
			<form onSubmit={handleSubmit} className="input-elegant">
				<div className="flex items-end gap-3 p-4">
					<button
						type="button"
						className="flex-shrink-0 w-10 h-10 rounded-xl bg-muted hover:bg-muted/70 flex items-center justify-center transition-colors"
						aria-label="Anexar arquivo"
					>
						<Paperclip className="w-5 h-5 text-muted-foreground" />
					</button>

					<textarea
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						onKeyDown={handleKeyDown}
						placeholder="Digite sua mensagem..."
						className="flex-1 bg-transparent border-none outline-none resize-none text-sm text-foreground placeholder:text-muted-foreground min-h-[40px] max-h-[200px] py-2"
						rows={1}
					/>

					<button
						type="submit"
						disabled={!message.trim()}
						className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary hover:bg-primary/90 disabled:bg-muted disabled:cursor-not-allowed flex items-center justify-center transition-colors shadow-soft"
						aria-label="Enviar mensagem"
					>
						<Send className="w-5 h-5 text-primary-foreground" />
					</button>
				</div>
			</form>

			{isInitialState && (
				<motion.p
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.3 }}
					className="text-xs text-muted-foreground text-center mt-3"
				>
					Pressione Enter para enviar, Shift + Enter para nova linha
				</motion.p>
			)}
		</motion.div>
	);
};
