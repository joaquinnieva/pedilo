import { useAppTheme } from '@/context/ThemeContext';
import { Button } from '@radix-ui/themes';
import confetti from 'canvas-confetti';
import { Lock, RotateCw, Sparkles } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import ShinyText from '../reactbits/ShinyText';

const WHEEL_PALETTE = [
	['#6366f1', '#4338ca'],
	['#ec4899', '#be185d'],
	['#06b6d4', '#0e7490'],
	['#f59e0b', '#b45309'],
	['#10b981', '#047857'],
	['#8b5cf6', '#6d28d9'],
	['#f43f5e', '#be123c'],
	['#3b82f6', '#1d4ed8'],
];

const CANVAS_SIZE = 340;
const LED_COUNT = 16;

export function PrizeWheel({
	participants = [],
	onWinner,
	isLocked = false,
	lockedWinner = '',
}: {
	participants: string[];
	onWinner?: (winnerName: string) => void;
	isLocked?: boolean;
	lockedWinner?: string;
}) {
	const { theme } = useAppTheme();
	const [isSpinning, setIsSpinning] = useState(false);
	const [rotation, setRotation] = useState(0);
	const [winner, setWinner] = useState<string | null>(null);
	const [winnerIdx, setWinnerIdx] = useState<number | null>(null);
	const [pointerTilt, setPointerTilt] = useState(0);
	const [ledTick, setLedTick] = useState(0);

	const canvasRef = useRef<HTMLCanvasElement>(null);
	const rafRef = useRef<number | null>(null);
	const confettiIntervalRef = useRef<number | null>(null);

	const sliceColors = useMemo(
		() =>
			Array.from({ length: participants.length }, (_, i) => {
				return WHEEL_PALETTE[i % WHEEL_PALETTE.length];
			}),
		[participants.length],
	);

	useEffect(() => {
		if (isSpinning) return;
		const idleTimer = window.setInterval(() => {
			setLedTick((t) => (t + 1) % 2);
		}, 500);
		return () => clearInterval(idleTimer);
	}, [isSpinning]);

	useEffect(() => {
		return () => {
			if (rafRef.current !== null) {
				cancelAnimationFrame(rafRef.current);
			}
			if (confettiIntervalRef.current !== null) {
				clearInterval(confettiIntervalRef.current);
			}
		};
	}, []);

	const launchConfetti = () => {
		if (confettiIntervalRef.current !== null) {
			clearInterval(confettiIntervalRef.current);
		}
		const duration = 1200;
		const animationEnd = Date.now() + duration;
		const colors = [theme.swatch, theme.swatchSecondary, '#fbbf24', '#ffffff'];
		const defaults = { startVelocity: 34, spread: 75, ticks: 70, zIndex: 9999, colors };
		const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

		confetti({
			...defaults,
			particleCount: 45,
			origin: { x: 0.5, y: 0.45 },
		});

		confettiIntervalRef.current = window.setInterval(() => {
			const timeLeft = animationEnd - Date.now();
			if (timeLeft <= 0) {
				if (confettiIntervalRef.current !== null) {
					clearInterval(confettiIntervalRef.current);
					confettiIntervalRef.current = null;
				}
				return;
			}
			const particleCount = Math.max(4, Math.round(18 * (timeLeft / duration)));
			confetti({
				...defaults,
				particleCount,
				origin: { x: randomInRange(0.15, 0.35), y: Math.random() * 0.3 + 0.2 },
			});
			confetti({
				...defaults,
				particleCount,
				origin: { x: randomInRange(0.65, 0.85), y: Math.random() * 0.3 + 0.2 },
			});
		}, 220);
	};

	const spinWheel = () => {
		if (isSpinning || isLocked || participants.length === 0) return;
		setIsSpinning(true);
		setWinner(null);
		setWinnerIdx(null);

		const chosenIndex = Math.floor(Math.random() * participants.length);
		const selectedWinner = participants[chosenIndex];

		const spinDuration = 4800;
		const minSpins = 6;
		const sliceAngle = 360 / participants.length;
		// Top pointer is at 270° in canvas coordinates (12 o'clock)
		const targetAngle = (270 - (chosenIndex * sliceAngle + sliceAngle / 2) + 360) % 360;
		const extraRotation = (targetAngle - (rotation % 360) + 360) % 360;
		const totalRotation = minSpins * 360 + extraRotation;

		const startTime = Date.now();
		const startRotation = rotation;

		const animate = () => {
			const elapsed = Date.now() - startTime;
			const progress = Math.min(elapsed / spinDuration, 1);
			// Quintic ease-out for realistic smooth deceleration
			const easeOut = 1 - (1 - progress) ** 5;
			const currentRotation = startRotation + totalRotation * easeOut;
			const normalizedRot = currentRotation % 360;

			// Mechanical flipper tilt whenever a slice divider crosses 270°
			const pointerPhase = (((270 - normalizedRot) % sliceAngle) + sliceAngle) % sliceAngle;
			const distToDivider = Math.min(pointerPhase, sliceAngle - pointerPhase);
			const threshold = Math.min(8, sliceAngle * 0.25);
			const speedFactor = 1 - progress;
			if (distToDivider < threshold && progress < 0.98) {
				setPointerTilt(-18 * (1 - distToDivider / threshold) * (0.4 + 0.6 * speedFactor));
			} else {
				setPointerTilt(0);
			}

			setLedTick(Math.floor(currentRotation / 18) % 2);
			setRotation(normalizedRot);

			if (progress < 1) {
				rafRef.current = requestAnimationFrame(animate);
			} else {
				rafRef.current = null;
				setPointerTilt(0);
				setIsSpinning(false);
				setWinner(selectedWinner);
				setWinnerIdx(chosenIndex);
				onWinner?.(selectedWinner);
				launchConfetti();
			}
		};

		rafRef.current = requestAnimationFrame(animate);
	};

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas || participants.length === 0) return;

		const dpr = window.devicePixelRatio || 1;
		canvas.width = CANVAS_SIZE * dpr;
		canvas.height = CANVAS_SIZE * dpr;

		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		ctx.save();
		ctx.scale(dpr, dpr);

		const centerX = CANVAS_SIZE / 2;
		const centerY = CANVAS_SIZE / 2;
		const outerRadius = CANVAS_SIZE / 2 - 6;
		const wheelRadius = outerRadius - 14;

		ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

		// Outer metallic bezel
		const bezelGradient = ctx.createLinearGradient(0, 0, CANVAS_SIZE, CANVAS_SIZE);
		bezelGradient.addColorStop(0, '#334155');
		bezelGradient.addColorStop(0.5, '#0f172a');
		bezelGradient.addColorStop(1, '#334155');
		ctx.beginPath();
		ctx.arc(centerX, centerY, outerRadius, 0, 2 * Math.PI);
		ctx.fillStyle = bezelGradient;
		ctx.fill();
		ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
		ctx.lineWidth = 2;
		ctx.stroke();

		// LED bulbs on outer rim
		for (let i = 0; i < LED_COUNT; i++) {
			const angle = (i * 2 * Math.PI) / LED_COUNT;
			const lx = centerX + Math.cos(angle) * (outerRadius - 7);
			const ly = centerY + Math.sin(angle) * (outerRadius - 7);
			const isLit = i % 2 === ledTick;

			ctx.beginPath();
			ctx.arc(lx, ly, isLit ? 3.2 : 2.5, 0, 2 * Math.PI);
			ctx.fillStyle = isLit ? '#fde047' : 'rgba(255, 255, 255, 0.22)';
			if (isLit) {
				ctx.shadowColor = '#facc15';
				ctx.shadowBlur = 8;
			} else {
				ctx.shadowBlur = 0;
			}
			ctx.fill();
			ctx.shadowBlur = 0;
		}

		// Slices
		const sliceAngle = (2 * Math.PI) / participants.length;
		const fontSize = participants.length > 10 ? 12 : participants.length > 6 ? 13.5 : 15;

		participants.forEach((participant, index) => {
			const startAngle = index * sliceAngle + (rotation * Math.PI) / 180;
			const endAngle = startAngle + sliceAngle;
			const [colorStart, colorEnd] = sliceColors[index] ?? ['#6366f1', '#4338ca'];

			const grad = ctx.createRadialGradient(
				centerX,
				centerY,
				wheelRadius * 0.15,
				centerX,
				centerY,
				wheelRadius,
			);
			grad.addColorStop(0, colorStart);
			grad.addColorStop(1, colorEnd);

			ctx.beginPath();
			ctx.moveTo(centerX, centerY);
			ctx.arc(centerX, centerY, wheelRadius, startAngle, endAngle);
			ctx.closePath();
			ctx.fillStyle = grad;
			ctx.fill();

			if (winnerIdx === index && !isSpinning) {
				ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
				ctx.fill();
			}

			ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
			ctx.lineWidth = 1.75;
			ctx.stroke();

			// Label
			ctx.save();
			ctx.translate(centerX, centerY);
			ctx.rotate(startAngle + sliceAngle / 2);
			ctx.textAlign = 'right';
			ctx.textBaseline = 'middle';
			ctx.fillStyle = '#ffffff';
			ctx.shadowColor = 'rgba(0, 0, 0, 0.55)';
			ctx.shadowBlur = 4;
			ctx.font = `600 ${fontSize}px system-ui, -apple-system, sans-serif`;
			const label = participant.length > 12 ? `${participant.slice(0, 11)}…` : participant;
			ctx.fillText(label, wheelRadius - 14, 0);
			ctx.restore();
		});

		// Inner shadow ring around wheel
		ctx.beginPath();
		ctx.arc(centerX, centerY, wheelRadius, 0, 2 * Math.PI);
		ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
		ctx.lineWidth = 2;
		ctx.stroke();

		// Center decorative cap
		const hubGrad = ctx.createRadialGradient(centerX - 4, centerY - 4, 2, centerX, centerY, 20);
		hubGrad.addColorStop(0, '#475569');
		hubGrad.addColorStop(1, '#0f172a');
		ctx.beginPath();
		ctx.arc(centerX, centerY, 20, 0, 2 * Math.PI);
		ctx.fillStyle = hubGrad;
		ctx.fill();
		ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
		ctx.lineWidth = 2;
		ctx.stroke();

		ctx.restore();
	}, [rotation, participants, sliceColors, ledTick, winnerIdx, isSpinning]);

	return (
		<div className="w-full mx-auto flex flex-col items-center gap-4">
			<div className="relative flex items-center justify-center pt-3">
				{/* Mechanical top stopper pointer */}
				<div
					aria-hidden="true"
					className="absolute -top-0.5 left-1/2 z-20 origin-top transition-transform duration-75"
					style={{
						transform: `translateX(-50%) rotate(${pointerTilt}deg)`,
					}}
				>
					<svg width="34" height="36" viewBox="0 0 34 36" fill="none">
						<path
							d="M17 35L4 12C1.5 7.5 4.8 2 10 2H24C29.2 2 32.5 7.5 30 12L17 35Z"
							fill="#fbbf24"
							stroke="#0f172a"
							strokeWidth="2.5"
						/>
						<circle cx="17" cy="11" r="3.5" fill="#0f172a" />
					</svg>
				</div>

				{/* Wheel canvas */}
				<div className="relative">
					<canvas
						ref={canvasRef}
						style={{ width: CANVAS_SIZE, height: CANVAS_SIZE }}
						className="max-w-full h-auto drop-shadow-[0_14px_35px_rgba(0,0,0,0.55)]"
					/>
				</div>
			</div>

			{/* Winner card */}
			{(() => {
				const displayedWinner = winner ?? (isLocked && lockedWinner ? lockedWinner : null);
				if (displayedWinner && !isSpinning) {
					return (
						<div
							className="w-full rounded-xl p-3.5 border text-center flex flex-col items-center gap-1"
							style={{
								backgroundColor: 'var(--accent-soft)',
								borderColor: 'var(--border-subtle)',
							}}
						>
							<span className="text-[11px] uppercase tracking-wider font-semibold text-gray-300 flex items-center gap-1">
								<Sparkles className="w-3.5 h-3.5" style={{ color: 'var(--accent-hex)' }} />
								Resultado del sorteo
							</span>
							<ShinyText
								text={`🎉 ¡Le toca pedir a ${displayedWinner}!`}
								speed={3}
								className="text-lg font-bold"
							/>
							{isLocked && (
								<span className="text-xs text-gray-300 mt-1 flex items-center gap-1">
									<Lock className="w-3 h-3" />
									Agregá un nuevo pedido para volver a sortear.
								</span>
							)}
						</div>
					);
				}

				return (
					<div className="flex flex-col items-center gap-2 w-full">
						<div className="flex flex-wrap justify-center gap-1.5 max-h-20 overflow-y-auto px-1">
							{participants.map((p, idx) => (
								<span
									key={`${p}-${idx}`}
									className="text-xs px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/10 text-gray-300"
								>
									{p}
								</span>
							))}
						</div>
						{isLocked && !isSpinning && (
							<span className="text-xs text-amber-300 flex items-center gap-1">
								<Lock className="w-3 h-3" />
								Ya se realizó un sorteo. Agregá un nuevo pedido para volver a sortear.
							</span>
						)}
					</div>
				);
			})()}

			<div className="flex justify-end w-full pt-2 border-t border-white/10">
				<Button
					type="button"
					onClick={spinWheel}
					disabled={isSpinning || isLocked || participants.length === 0}
					className="gap-2"
				>
					{isLocked ? (
						<Lock className="w-4 h-4" />
					) : (
						<RotateCw className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
					)}
					{isSpinning ? 'Girando...' : isLocked ? 'Sorteo realizado' : '¡Girar Ruleta!'}
				</Button>
			</div>
		</div>
	);
}
