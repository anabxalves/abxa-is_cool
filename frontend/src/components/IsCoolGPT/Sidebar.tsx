import { BrainCircuit, ChevronLeft, ChevronRight, Eraser, GraduationCap, MessageSquare, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

interface SidebarProps {
    isCollapsed: boolean;
    isMobile: boolean;
    isOpen: boolean;
    onToggle: () => void;
    onCloseMobile: () => void;
}

export const Sidebar = ({ isCollapsed, isMobile, isOpen, onToggle, onCloseMobile }: SidebarProps) => {
    useEffect(() => {
        if (!isMobile && isOpen) {
            onCloseMobile();
        }
    }, [isMobile, isOpen, onCloseMobile]);

    const sidebarVariants = {
        desktop: { width: isCollapsed ? 80 : 280 },
        mobileOpen: { x: 0, width: 280 },
        mobileClosed: { x: "-100%" },
    };

    const Content = () => (
        <>
            <div className="p-6 flex items-center justify-between">
                <motion.div
                    initial={false}
                    animate={{ opacity: (isCollapsed && !isMobile) ? 0 : 1 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-3 overflow-hidden whitespace-nowrap"
                >
                    {(!isCollapsed || isMobile) && (
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
                    onClick={isMobile ? onCloseMobile : onToggle}
                    className="w-8 h-8 rounded-lg bg-sidebar-accent hover:bg-sidebar-accent/70 flex items-center justify-center transition-colors shrink-0"
                    aria-label={isMobile ? "Fechar menu" : isCollapsed ? "Expandir sidebar" : "Recolher sidebar"}
                >
                    {isMobile ? (
                        <X className="w-5 h-5 text-sidebar-foreground" />
                    ) : isCollapsed ? (
                        <ChevronRight className="w-4 h-4 text-sidebar-foreground" />
                    ) : (
                        <ChevronLeft className="w-4 h-4 text-sidebar-foreground" />
                    )}
                </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
                <AnimatePresence>
                    {(!isCollapsed || isMobile) && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-8"
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
                                    O contexto é compartilhado! Você pode pedir para o <strong>Gemini</strong> explicar um conceito e depois pedir ao <strong>Llama</strong> para criar um quiz.
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
                                    Ao recarregar a página, a conversa atual será apagada. <strong>Lembre-se de salvar o que for importante.</strong>
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {(!isCollapsed || isMobile) && (
                <div className="p-6 text-xs text-center text-muted-foreground border-t border-sidebar-border mt-auto">
                    <p>Projeto AV2</p>
                    <p className="opacity-50 mt-1">Fundamentos da Computação em Nuvem • 2025.2</p>
                    <p className="opacity-50 mt-1">CESAR School</p>
                    &nbsp;
                    <p className="opacity-50 mt-1">Devsenvolvido por:</p>
                    <p>Ana Beatriz Ximenes Alves</p>
                </div>
            )}
        </>
    );

    if (isMobile) {
        return (
            <>
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={onCloseMobile}
                            className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm"
                        />
                    )}
                </AnimatePresence>

                <motion.aside
                    initial="mobileClosed"
                    animate={isOpen ? "mobileOpen" : "mobileClosed"}
                    variants={sidebarVariants}
                    transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                    className="fixed inset-y-0 left-0 z-50 bg-sidebar border-r border-sidebar-border flex flex-col shadow-2xl w-[280px]"
                >
                    <Content />
                </motion.aside>
            </>
        );
    }

    return (
        <motion.aside
            initial={false}
            animate="desktop"
            variants={sidebarVariants}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="h-screen bg-sidebar border-r border-sidebar-border flex flex-col shadow-sm relative z-20 hidden lg:flex"
        >
            <Content />
        </motion.aside>
    );
};