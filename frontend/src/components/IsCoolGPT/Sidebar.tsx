import { BrainCircuit, ChevronLeft, ChevronRight, Eraser, GraduationCap, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SidebarProps {
    isCollapsed: boolean;
    onToggle: () => void;
}

export const Sidebar = ({ isCollapsed, onToggle }: SidebarProps) => {
    return (
        <motion.aside
            initial={false}
            animate={{ width: isCollapsed ? 80 : 280 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="h-screen bg-sidebar border-r border-sidebar-border flex flex-col shadow-sm relative z-20"
        >
            <div className="p-6 flex items-center justify-between">
                <motion.div
                    initial={false}
                    animate={{ opacity: isCollapsed ? 0 : 1 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-3 overflow-hidden whitespace-nowrap"
                >
                    {!isCollapsed && (
                        <>
                            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-soft shrink-0">
                                <MessageSquare className="w-5 h-5 text-primary-foreground" />
                            </div>
                            <h1 className="text-xl font-bold text-sidebar-foreground tracking-tight">
                                IsCoolGPT
                            </h1>
                        </>
                    )}
                </motion.div>

                <button
                    onClick={onToggle}
                    className="w-8 h-8 rounded-lg bg-sidebar-accent hover:bg-sidebar-accent/70 flex items-center justify-center transition-colors shrink-0"
                    aria-label={isCollapsed ? "Expandir sidebar" : "Recolher sidebar"}
                >
                    {isCollapsed ? (
                        <ChevronRight className="w-4 h-4 text-sidebar-foreground" />
                    ) : (
                        <ChevronLeft className="w-4 h-4 text-sidebar-foreground" />
                    )}
                </button>
            </div>

            <AnimatePresence>
                {!isCollapsed && (
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2, delay: 0.1 }}
                        className="px-6 py-4 space-y-8 overflow-y-auto"
                    >
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-primary">
                                <GraduationCap className="w-5 h-5" />
                                <h3 className="font-semibold text-sm">Seu Assistente de Estudos</h3>
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed text-justify">
                                O <strong>IsCoolGPT</strong> é uma plataforma inteligente projetada para potencializar seu aprendizado.
                                Aqui você tem acesso centralizado aos modelos de IA mais avançados do mercado para tirar dúvidas, resumir conteúdos e aprofundar seus conhecimentos acadêmicos.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-primary">
                                <BrainCircuit className="w-5 h-5" />
                                <h3 className="font-semibold text-sm">Modo de Estudo</h3>
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed text-justify">
                                O contexto é compartilhado! Você pode pedir para o <strong>Gemini</strong> explicar um conceito difícil e, em seguida, pedir ao <strong>Llama</strong> para criar um quiz sobre a explicação anterior.
                                Use as diferentes "personalidades" das IAs para enriquecer seu aprendizado.
                            </p>
                        </div>

                        <div className="space-y-3 p-4 bg-orange-50/50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-800 rounded-xl">
                            <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
                                <Eraser className="w-5 h-5" />
                                <h3 className="font-semibold text-sm">Sessão Temporária</h3>
                            </div>
                            <p className="text-xs text-muted-foreground/80 leading-relaxed text-justify">
                                Focamos na sua privacidade: <strong>nenhum histórico é salvo</strong> em nossos servidores.
                                <br /><br />
                                Ao recarregar a página, a conversa atual será apagada. Lembre-se de salvar o que for importante.
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex-1" />

            {!isCollapsed && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="p-6 text-xs text-center text-muted-foreground border-t border-sidebar-border"
                >
                    <p>Projeto AV2</p>
                    <p className="opacity-50 mt-1">Fundamentos da Computação em Nuvem • 2025.2</p>
                    <p className="opacity-50 mt-1">CESAR School</p>
                    &nbsp;
                    <p className="opacity-50 mt-1">Desenvolvido por:</p>
                    <p>Ana Beatriz Ximenes Alves</p>
                </motion.div>
            )}
        </motion.aside>
    );
};
