import { motion } from "framer-motion";

interface Model {
	id: string;
	name: string;
}

interface TopBarProps {
	models: Model[];
	activeModelId: string;
	onModelSelect: (modelId: string) => void;
}

export const TopBar = ({
	models,
	activeModelId,
	onModelSelect,
}: TopBarProps) => {
	return (
		<div className="h-20 border-b border-border bg-card flex items-center justify-center px-6">
			<motion.div
				initial={{ opacity: 0, y: -10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.4 }}
				className="flex items-center gap-2 flex-wrap"
			>
				{models.map((model) => {
					const isActive = model.id === activeModelId;
					return (
						<button
							key={model.id}
							onClick={() => onModelSelect(model.id)}
							className={`model-pill ${
								isActive
									? "model-pill-active"
									: "bg-background border-border text-muted-foreground"
							}`}
						>
							{model.name}
						</button>
					);
				})}
			</motion.div>
		</div>
	);
};
