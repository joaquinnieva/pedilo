import { type HTMLAttributes, type MouseEvent, type ReactNode, useRef, useState } from 'react';

interface SpotlightCardProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
	spotlightColor?: string;
	className?: string;
}

function SpotlightCard({
	children,
	spotlightColor = 'var(--spotlight)',
	className = '',
	onMouseMove,
	onMouseEnter,
	onMouseLeave,
	...rest
}: SpotlightCardProps) {
	const divRef = useRef<HTMLDivElement>(null);
	const [position, setPosition] = useState({ x: 0, y: 0 });
	const [opacity, setOpacity] = useState(0);

	const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
		if (divRef.current) {
			const rect = divRef.current.getBoundingClientRect();
			setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
		}
		onMouseMove?.(e);
	};

	const handleMouseEnter = (e: MouseEvent<HTMLDivElement>) => {
		setOpacity(1);
		onMouseEnter?.(e);
	};

	const handleMouseLeave = (e: MouseEvent<HTMLDivElement>) => {
		setOpacity(0);
		onMouseLeave?.(e);
	};

	return (
		<div
			ref={divRef}
			onMouseMove={handleMouseMove}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			className={`relative overflow-hidden rounded-xl border transition-all duration-200 ${className}`}
			{...rest}
		>
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 transition-opacity duration-300"
				style={{
					opacity,
					background: `radial-gradient(280px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 75%)`,
				}}
			/>
			<div className="relative z-10 h-full">{children}</div>
		</div>
	);
}

export default SpotlightCard;
