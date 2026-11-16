const FLOATING_FOODS = [
	{
		emoji: '🍕',
		top: '8%',
		left: '6%',
		size: '2.2rem',
		duration: '18s',
		delay: '0s',
		opacity: 0.08,
	},
	{
		emoji: '🍔',
		top: '16%',
		left: '84%',
		size: '2.5rem',
		duration: '22s',
		delay: '-4s',
		opacity: 0.07,
	},
	{
		emoji: '🍟',
		top: '28%',
		left: '18%',
		size: '1.9rem',
		duration: '20s',
		delay: '-9s',
		opacity: 0.06,
	},
	{
		emoji: '🌮',
		top: '34%',
		left: '72%',
		size: '2.3rem',
		duration: '24s',
		delay: '-2s',
		opacity: 0.08,
	},
	{
		emoji: '🥗',
		top: '48%',
		left: '9%',
		size: '2rem',
		duration: '21s',
		delay: '-7s',
		opacity: 0.07,
	},
	{
		emoji: '🌯',
		top: '52%',
		left: '90%',
		size: '2.2rem',
		duration: '19s',
		delay: '-11s',
		opacity: 0.07,
	},
	{
		emoji: '🥟',
		top: '64%',
		left: '26%',
		size: '2.4rem',
		duration: '25s',
		delay: '-5s',
		opacity: 0.06,
	},
	{
		emoji: '🍗',
		top: '70%',
		left: '78%',
		size: '2rem',
		duration: '20s',
		delay: '-13s',
		opacity: 0.08,
	},
	{
		emoji: '🍝',
		top: '82%',
		left: '12%',
		size: '2.3rem',
		duration: '23s',
		delay: '-3s',
		opacity: 0.07,
	},
	{
		emoji: '🥪',
		top: '86%',
		left: '60%',
		size: '2.1rem',
		duration: '19s',
		delay: '-8s',
		opacity: 0.06,
	},
	{
		emoji: '🥤',
		top: '20%',
		left: '48%',
		size: '1.8rem',
		duration: '26s',
		delay: '-15s',
		opacity: 0.05,
	},
	{
		emoji: '🍣',
		top: '76%',
		left: '42%',
		size: '2rem',
		duration: '22s',
		delay: '-10s',
		opacity: 0.06,
	},
];

function FoodBackground() {
	return (
		<div
			aria-hidden="true"
			className="pointer-events-none select-none fixed inset-0 overflow-hidden z-0"
		>
			{FLOATING_FOODS.map((item, idx) => (
				<span
					key={`${item.emoji}-${idx}`}
					className="food-float absolute will-change-transform"
					style={{
						top: item.top,
						left: item.left,
						fontSize: item.size,
						opacity: item.opacity,
						animationDuration: item.duration,
						animationDelay: item.delay,
						filter: idx % 3 === 0 ? 'blur(0.5px)' : undefined,
					}}
				>
					{item.emoji}
				</span>
			))}
		</div>
	);
}

export default FoodBackground;
