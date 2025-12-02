import { motion } from "framer-motion";
import { ChevronDown, Menu, MessageSquare } from "lucide-react";

interface Model {
    id: string;
    name: string;
}

interface TopBarProps {
    models: Model[];
    activeModelId: string;
    onModelSelect: (modelId: string) => void;
    isMobile: boolean;
    onMenuClick: () => void;
    showMenuHighlight?: boolean;
}

export const TopBar = ({
                           models,
                           activeModelId,
                           onModelSelect,
                           isMobile,
                           onMenuClick,
                           showMenuHighlight,
                       }: TopBarProps) => {
    return (
        <div className="sticky top-0 z-30 h-16 lg:h-20 border-b border-border bg-card/80 backdrop-blur-md flex items-center px-4 lg:px-6 transition-all">

            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-5xl mx-auto flex items-center justify-between"
            >
                <div className="flex items-center">
                    {isMobile && (
                        <button
                            onClick={onMenuClick}
                            className={`p-2 -ml-2 rounded-lg transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                                showMenuHighlight
                                    ? "bg-orange-100 text-orange-600 ring-2 ring-orange-400 ring-offset-2 ring-offset-card animate-pulse shadow-[0_0_15px_rgba(249,115,22,0.5)]"
                                    : "hover:bg-muted text-muted-foreground"
                            }`}
                            aria-label="Abrir menu"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                    )}
                </div>

                {isMobile && (
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-soft shrink-0">
                            <MessageSquare className="w-4 h-4 text-primary-foreground" />
                        </div>
                        <span className="font-bold text-lg text-foreground tracking-tight hidden sm:block">
							IsCoolGPT
						</span>
                    </div>
                )}

                <div className={`flex ${isMobile ? 'justify-end' : 'justify-center flex-1'}`}>
                    <div className="hidden lg:flex items-center gap-2 flex-wrap justify-center">
                        {models.map((model) => {
                            const isActive = model.id === activeModelId;
                            return (
                                <button
                                    key={model.id}
                                    onClick={() => onModelSelect(model.id)}
                                    className={`model-pill ${
                                        isActive
                                            ? "model-pill-active"
                                            : "bg-background border-border text-muted-foreground hover:bg-muted/50"
                                    }`}
                                >
                                    {model.name}
                                </button>
                            );
                        })}
                    </div>

                    <div className="lg:hidden relative w-[130px] sm:w-[160px]">
                        <select
                            value={activeModelId}
                            onChange={(e) => onModelSelect(e.target.value)}
                            className="w-full appearance-none bg-background border border-border rounded-xl py-2 pl-3 pr-8 text-xs sm:text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm truncate text-right sm:text-left"
                        >
                            {models.map((model) => (
                                <option key={model.id} value={model.id}>
                                    {model.name}
                                </option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-muted-foreground">
                            <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};