import { Bot, User, Copy, Check } from "lucide-react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import { useState } from "react";

interface MessageProps {
    role: "user" | "assistant";
    content: string;
    index: number;
}

export const Message = ({ role, content, index }: MessageProps) => {
    const isUser = role === "user";

    const CopyButton = ({ text }: { text: string }) => {
        const [isCopied, setIsCopied] = useState(false);

        const handleCopy = () => {
            navigator.clipboard.writeText(text);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        };

        return (
            <button onClick={handleCopy} className="absolute top-2 right-2 p-1 rounded hover:bg-zinc-700 transition-colors">
                {isCopied ? <Check size={14} className="text-green-400" /> : <Copy size={14} className="text-zinc-400" />}
            </button>
        );
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`flex gap-4 mb-6 ${isUser ? "justify-end" : "justify-start"}`}
        >
            {!isUser && (
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 shadow-soft mt-1">
                    <Bot className="w-5 h-5 text-primary-foreground" />
                </div>
            )}

            <div
                className={`max-w-[85%] rounded-2xl px-5 py-3 shadow-sm overflow-hidden ${
                    isUser
                        ? "bg-primary text-primary-foreground rounded-br-none"
                        : "bg-card text-card-foreground border border-border rounded-bl-none"
                }`}
            >
                {isUser ? (
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
                ) : (
                    <div className="prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed prose-pre:p-0">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                                code({ node, inline, className, children, ...props }: any) {
                                    const match = /language-(\w+)/.exec(className || "");
                                    const codeText = String(children).replace(/\n$/, "");

                                    return !inline && match ? (
                                        <div className="relative group rounded-md overflow-hidden my-4 border border-zinc-700">
                                            <div className="flex items-center justify-between bg-zinc-900 px-4 py-1.5 border-b border-zinc-700">
                                                <span className="text-xs text-zinc-400 font-mono">{match[1]}</span>
                                                <CopyButton text={codeText} />
                                            </div>
                                            <SyntaxHighlighter
                                                style={vscDarkPlus}
                                                language={match[1]}
                                                PreTag="div"
                                                customStyle={{ margin: 0, borderRadius: 0 }}
                                                {...props}
                                            >
                                                {codeText}
                                            </SyntaxHighlighter>
                                        </div>
                                    ) : (
                                        <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono text-primary font-bold" {...props}>
                                            {children}
                                        </code>
                                    );
                                }
                            }}
                        >
                            {content}
                        </ReactMarkdown>
                    </div>
                )}
            </div>

            {isUser && (
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 shadow-soft mt-1">
                    <User className="w-5 h-5 text-secondary-foreground" />
                </div>
            )}
        </motion.div>
    );
};