import { MessageSquare, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

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
			className="h-screen bg-sidebar border-r border-sidebar-border flex flex-col"
		>
			<div className="p-6 flex items-center justify-between">
				<motion.div
					initial={false}
					animate={{ opacity: isCollapsed ? 0 : 1 }}
					transition={{ duration: 0.2 }}
					className="flex items-center gap-3"
				>
					{!isCollapsed && (
						<>
							<div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-soft">
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
					className="w-8 h-8 rounded-lg bg-sidebar-accent hover:bg-sidebar-accent/70 flex items-center justify-center transition-colors"
					aria-label={isCollapsed ? "Expandir sidebar" : "Recolher sidebar"}
				>
					{isCollapsed ? (
						<ChevronRight className="w-4 h-4 text-sidebar-foreground" />
					) : (
						<ChevronLeft className="w-4 h-4 text-sidebar-foreground" />
					)}
				</button>
			</div>

			{/* Empty space for future features */}
			<div className="flex-1" />

			{!isCollapsed && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.2 }}
					className="p-6 text-xs text-muted-foreground"
				>
					Seu hub centralizado de IAs
				</motion.div>
			)}
		</motion.aside>
	);
};
