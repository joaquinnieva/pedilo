import { Button } from '@radix-ui/themes';
import confetti from 'canvas-confetti';
import { useEffect, useRef, useState } from 'react';

export function PrizeWheel({
	participants = [],
}: {
	participants: string[];
}) {
	const [isSpinning, setIsSpinning] = useState(false);
	const [rotation, setRotation] = useState(0);
	const [winner, setWinner] = useState<string | null>(participants[0]);
	const canvasRef = useRef<HTMLCanvasElement>(null);

	const COLORS = Array.from({ length: participants.length }, (_, i) => {
		const index = i % 2 === 0 ? i : i - participants.length / 2;
		const hue = (index * 360) / participants.length;
		return `oklch(0.5 0.1 ${hue})`;
	});

	const spinWheel = () => {
		if (isSpinning || participants.length === 0) return;
		setIsSpinning(true);

		const winnerIndex = Math.floor(Math.random() * participants.length);
		const selectedWinner = participants[winnerIndex];
		setWinner((prev) => {
			if (selectedWinner === prev) {
				return participants[Math.floor(Math.random() * participants.length)];;
			}
			return selectedWinner;
		});


		const spinDuration = 4000;
		const minSpins = 4;

		const sliceAngle = 360 / participants.length;
		const targetAngle = (360 - (winnerIndex * sliceAngle + sliceAngle / 2)) % 360;
		const extraRotation = (targetAngle - (rotation % 360) + 360) % 360;
		const totalRotation = minSpins * 360 + extraRotation - 45;

		const startTime = Date.now();
		const startRotation = rotation;

		const animate = () => {
			const currentTime = Date.now();
			const elapsed = currentTime - startTime;
			const progress = Math.min(elapsed / spinDuration, 1);

			// Easing function for smooth deceleration
			const easeOut = 1 - Math.pow(1 - progress, 4);
			const currentRotation = startRotation + totalRotation * easeOut;

			setRotation(currentRotation % 360);

			if (progress < 1) {
				requestAnimationFrame(animate);
			} else {
				setIsSpinning(false);
			}

			setTimeout(() => {
				handleClick();
			}, 3500);
		};
		animate();
	};

	const handleClick = () => {
		const duration = 1 * 1000;
		const animationEnd = Date.now() + duration;
		const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
		const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;
		const interval = window.setInterval(() => {
			const timeLeft = animationEnd - Date.now();
			if (timeLeft <= 0) {
				return clearInterval(interval);
			}
			const particleCount = 5 * (timeLeft / duration);
			confetti({
				...defaults,
				particleCount,
				origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
			});
			confetti({
				...defaults,
				particleCount,
				origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
			});
		}, 250);
	};

	useEffect(() => {
		const drawWheel = () => {
			const canvas = canvasRef.current;
			if (!canvas) return;

			const ctx = canvas.getContext('2d');
			if (!ctx) return;

			const centerX = canvas.width / 2;
			const centerY = canvas.height / 2;
			const radius = Math.min(centerX, centerY) - 10;

			ctx.clearRect(0, 0, canvas.width, canvas.height);

			const sliceAngle = (2 * Math.PI) / participants.length;

			participants.forEach((participant, index) => {
				const startAngle = index * sliceAngle + (rotation * Math.PI) / 180;
				const endAngle = startAngle + sliceAngle;

				// Draw slice
				ctx.beginPath();
				ctx.moveTo(centerX, centerY);
				ctx.arc(centerX, centerY, radius, startAngle, endAngle);
				ctx.closePath();
				ctx.fillStyle = COLORS[index];
				ctx.fill();
				ctx.strokeStyle = 'oklch(1 0 0)';
				ctx.lineWidth = 2;
				ctx.stroke();

				// Draw text
				ctx.save();
				ctx.translate(centerX, centerY);
				ctx.rotate(startAngle + sliceAngle / 2);
				ctx.textAlign = 'center';
				ctx.fillStyle = 'oklch(1 0 0)';
				ctx.font = 'bold 16px sans-serif';
				ctx.letterSpacing = '2px';
				ctx.fillText(participant, radius * 0.65, 5);
				ctx.restore();
			});

			// Draw center circle
			ctx.beginPath();
			ctx.arc(centerX, centerY, 20, 0, 2 * Math.PI);
			ctx.fillStyle = 'oklch(0.3 0 0)';
			ctx.fill();
			ctx.strokeStyle = 'oklch(1 0 0)';
			ctx.lineWidth = 2;
			ctx.stroke();
		};
		drawWheel();
	}, [rotation]);

	return (
		<div className="w-full mx-auto">
			{/* Wheel Section */}
			<div className="p-2 flex flex-col items-center justify-center relative overflow-hidden !border-transparent w-full">
				<div className="relative mb-6">
					{/* Pointer */}
					<div className="absolute top-4 right-0 -translate-x-1/2 z-10">
						<div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[30px] border-t-destructive drop-shadow-lg rotate-45" />
					</div>

					<canvas
						ref={canvasRef}
						width={400}
						height={400}
						className="max-w-full h-auto drop-shadow-2xl"
					/>
				</div>

				<div className="flex justify-between w-full">
					<p className="text-primary">
						Resultado: <b>{winner}</b>
					</p>
					<Button
						onClick={spinWheel}
						disabled={isSpinning || participants.length === 0}
						className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
					>
						{isSpinning ? '¡Girando!' : '¡Girar Ruleta!'}
					</Button>
				</div>
			</div>
		</div>
	);
}
