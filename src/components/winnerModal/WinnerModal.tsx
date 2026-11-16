import { Button, Dialog } from '@radix-ui/themes';
import confetti from 'canvas-confetti';
import { Crown, Send, Volume2, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import ShinyText from '../reactbits/ShinyText';

interface WinnerModalProps {
	winnerName: string;
	winnerDrawId: string;
	userName: string;
	onOpenPedilo: () => void;
}

const LAST_DRAW_STORAGE_KEY = 'pedilo-last-celebrated-draw';
const VICTORY_SOUND_URL = '/sounds/trompetitas_ganadoras.wav';

function normalizeName(value?: string): string {
	return (value ?? '').trim().toLowerCase();
}

function WinnerModal({ winnerName, winnerDrawId, userName, onOpenPedilo }: WinnerModalProps) {
	const [isOpen, setOpen] = useState(false);
	const [audioBlocked, setAudioBlocked] = useState(false);
	const audioRef = useRef<HTMLAudioElement | null>(null);
	const lastHandledDrawRef = useRef<string>('');

	const stopSound = useCallback(() => {
		if (audioRef.current) {
			audioRef.current.pause();
			audioRef.current.currentTime = 0;
		}
	}, []);

	const playVictorySound = useCallback(async () => {
		try {
			if (!audioRef.current) {
				audioRef.current = new Audio(VICTORY_SOUND_URL);
			}
			audioRef.current.currentTime = 0;
			audioRef.current.volume = 0.85;
			await audioRef.current.play();
			setAudioBlocked(false);
		} catch {
			setAudioBlocked(true);
		}
	}, []);

	const launchGoldenConfetti = useCallback(() => {
		const colors = ['#fbbf24', '#fde047', '#f59e0b', '#ffffff'];
		confetti({
			particleCount: 70,
			spread: 85,
			startVelocity: 38,
			origin: { x: 0.5, y: 0.45 },
			zIndex: 9999,
			colors,
		});
		setTimeout(() => {
			confetti({
				particleCount: 40,
				angle: 60,
				spread: 60,
				origin: { x: 0.15, y: 0.6 },
				zIndex: 9999,
				colors,
			});
			confetti({
				particleCount: 40,
				angle: 120,
				spread: 60,
				origin: { x: 0.85, y: 0.6 },
				zIndex: 9999,
				colors,
			});
		}, 250);
	}, []);

	useEffect(() => {
		if (!winnerDrawId || !winnerName || !userName) return;
		if (normalizeName(winnerName) !== normalizeName(userName)) return;

		const alreadyHandledInSession = lastHandledDrawRef.current === winnerDrawId;
		const alreadyCelebrated = localStorage.getItem(LAST_DRAW_STORAGE_KEY) === winnerDrawId;
		if (alreadyHandledInSession || alreadyCelebrated) return;

		lastHandledDrawRef.current = winnerDrawId;
		localStorage.setItem(LAST_DRAW_STORAGE_KEY, winnerDrawId);

		setOpen(true);
		launchGoldenConfetti();
		void playVictorySound();
	}, [winnerDrawId, winnerName, userName, launchGoldenConfetti, playVictorySound]);

	useEffect(() => {
		return () => {
			stopSound();
		};
	}, [stopSound]);

	const handleOpenChange = (nextOpen: boolean) => {
		if (!nextOpen) {
			stopSound();
		}
		setOpen(nextOpen);
	};

	const handleGoPedilo = () => {
		stopSound();
		setOpen(false);
		onOpenPedilo();
	};

	return (
		<Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
			<Dialog.Content
				maxWidth="440px"
				className="relative w-[calc(100vw-2rem)] !p-6 !z-[60] card-winner"
			>
				<Dialog.Close asChild>
					<button
						type="button"
						aria-label="Cerrar"
						className="!absolute !top-4 !right-4 cursor-pointer rounded-full p-1.5 text-amber-200/80 hover:text-white hover:bg-white/10 transition-colors"
					>
						<X className="w-4 h-4" />
					</button>
				</Dialog.Close>

				<div className="flex flex-col items-center text-center gap-3 pt-2">
					<div className="w-16 h-16 rounded-full bg-amber-400/20 border-2 border-amber-300/70 flex items-center justify-center shadow-[0_0_28px_rgba(251,191,36,0.45)] animate-bounce">
						<Crown className="w-8 h-8 text-amber-300" />
					</div>

					<div className="flex flex-col gap-1">
						<span className="text-xs font-semibold uppercase tracking-widest text-amber-300">
							🎉 ¡Saliste sorteado!
						</span>
						<Dialog.Title className="!mb-0 !text-2xl">
							<ShinyText text={`¡Te toca pedir, ${winnerName}!`} speed={3} />
						</Dialog.Title>
						<p className="text-sm text-amber-100/80 mt-1">
							La ruleta decidió que hoy te encargás de mandar el pedido del grupo.
						</p>
					</div>

					<button
						type="button"
						onClick={() => void playVictorySound()}
						className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
							audioBlocked
								? 'bg-amber-400/25 border-amber-300/70 text-amber-100 hover:bg-amber-400/35'
								: 'bg-white/[0.06] border-white/15 text-amber-200/90 hover:bg-white/10'
						}`}
					>
						<Volume2 className="w-3.5 h-3.5" />
						{audioBlocked ? 'Sonar trompetas de victoria' : 'Volver a sonar trompetas'}
					</button>

					<div className="flex flex-wrap justify-center gap-2.5 w-full mt-3 pt-4 border-t border-amber-300/20">
						<Button type="button" variant="soft" color="gray" onClick={() => handleOpenChange(false)}>
							Cerrar
						</Button>
						<Button type="button" color="amber" onClick={handleGoPedilo} className="gap-1.5">
							<Send className="w-3.5 h-3.5" />
							PEDILO ahora
						</Button>
					</div>
				</div>
			</Dialog.Content>
		</Dialog.Root>
	);
}

export default WinnerModal;
