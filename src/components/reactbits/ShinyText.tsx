interface ShinyTextProps {
	text: string;
	disabled?: boolean;
	speed?: number;
	className?: string;
}

function ShinyText({ text, disabled = false, speed = 4, className = '' }: ShinyTextProps) {
	return (
		<span
			className={`inline-block bg-clip-text text-transparent ${disabled ? '' : 'animate-shine'} ${className}`}
			style={{
				backgroundImage:
					'linear-gradient(120deg, rgba(255, 255, 255, 0.72) 40%, rgba(255, 255, 255, 1) 50%, rgba(255, 255, 255, 0.72) 60%)',
				backgroundSize: '200% 100%',
				WebkitBackgroundClip: 'text',
				animationDuration: `${speed}s`,
			}}
		>
			{text}
		</span>
	);
}

export default ShinyText;
