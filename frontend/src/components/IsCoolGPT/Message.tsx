import { Bot, User, Copy, Check } from "lucide-react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import remarkGfm from "remark-gfm";
import { useState } from "react";

interface MessageProps {
    role: "user" | "assistant";
    content: string;
    index: number;
}

export const Message = ({ role, content, index }: MessageProps) => {
    const isUser = role === "user";

    const CopyButton = ({ text, className = "" }: { text: string; className?: string }) => {
        const [isCopied, setIsCopied] = useState(false);

        const handleCopy = () => {
            navigator.clipboard.writeText(text);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        };

        return (
            <button
                onClick={handleCopy}
                className={`p-1.5 rounded-lg bg-background/80 backdrop-blur-sm border border-border shadow-sm hover:bg-muted transition-all duration-200 group ${className}`}
                title="Copiar texto"
            >
                {isCopied ? (
                    <Check size={14} className="text-green-500 font-bold" />
                ) : (
                    <Copy size={14} className="text-muted-foreground group-hover:text-foreground" />
                )}
            </button>
        );
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`flex gap-4 mb-6 ${isUser ? "justify-end" : "justify-start group"}`}
        >
            {!isUser && (
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 shadow-soft mt-1">
                    <Bot className="w-5 h-5 text-primary-foreground" />
                </div>
            )}

            <div
                className={`relative max-w-[85%] min-w-[10rem] sm:min-w-[14rem] rounded-2xl px-5 py-3 shadow-sm overflow-visible ${
                    isUser
                        ? "bg-primary text-primary-foreground rounded-br-none"
                        : "bg-card text-card-foreground border border-border rounded-bl-none"
                }`}
            >
                {!isUser && (
                    <div className="float-right sticky top-3 -mr-2 -mt-1 ml-4 mb-2 z-20">
                        <CopyButton text={content} />
                    </div>
                )}

                {isUser ? (
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
                ) : (
                    <div className="prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed prose-pre:p-0 prose-pre:bg-transparent">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                                code({ node, inline, className, children, ...props }: any) {
                                    const match = /language-(\w+)/.exec(className || "");
                                    const codeText = String(children).replace(/\n$/, "");

                                    return !inline && match ? (
                                        <div className="relative group/code rounded-md overflow-hidden my-4 border border-zinc-700 bg-[#282c34]">
                                            <div className="flex items-center justify-between bg-zinc-800/50 px-4 py-1.5 border-b border-zinc-700">
												<span className="text-xs text-zinc-400 font-mono lowercase">
													{match[1]}
												</span>
                                                <div className="absolute top-2 right-2">
                                                    <CopyButton
                                                        text={codeText}
                                                        className="bg-zinc-700/50 border-zinc-600 hover:bg-zinc-600 text-zinc-300"
                                                    />
                                                </div>
                                            </div>
                                            <SyntaxHighlighter
                                                style={atomOneDark}
                                                language={match[1]}
                                                PreTag="div"
                                                customStyle={{ margin: 0, borderRadius: 0, background: 'transparent' }}
                                                {...props}
                                            >
                                                {codeText}
                                            </SyntaxHighlighter>
                                        </div>
                                    ) : (
                                        <code
                                            className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono text-primary font-bold"
                                            {...props}
                                        >
                                            {children}
                                        </code>
                                    );
                                },
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