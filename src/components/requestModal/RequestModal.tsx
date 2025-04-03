import { Button, Dialog, Tooltip } from '@radix-ui/themes';
import confetti from 'canvas-confetti';
import { X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Wheel } from 'react-custom-roulette';

type Props = {
	spinOptions: { option: string }[];
};
const isBrowser = () => typeof window !== 'undefined';

function RequestModal({ spinOptions }: Props) {
	const [isOpen, setOpen] = useState(false);
	const onOpen = () => setOpen(true);
	const onOpenChange = () => setOpen(!isOpen);

	const wheell = useRef<HTMLSpanElement>(null);

	const [show, setShow] = useState(false);
	const [mustSpin, setMustSpin] = useState(false);
	const [prizeNumber, setPrizeNumber] = useState(0);

	const handleSpinClick = () => {
		if (!mustSpin) {
			const newPrizeNumber = Math.floor(Math.random() * spinOptions.length);
			setPrizeNumber(newPrizeNumber);
			setMustSpin(true);
		}
	};
	useEffect(() => {
		if (isBrowser()) setShow(true);
	}, []);

	if (!show) return null;
	if (spinOptions?.length === 0) return null;
	return (
		<Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
			<Dialog.Trigger>
				<Tooltip content="Hay que sortearlo 🥚">
					<Button color="yellow" variant="soft" onClick={onOpen} disabled={spinOptions?.length === 0}>
						¿Quién lo tiene que pedir?
					</Button>
				</Tooltip>
			</Dialog.Trigger>

			<Dialog.Content className="grid place-items-center">
				<Dialog.Close className="!absolute !top-5 !right-5 cursor-pointer">
					<button>
						<X />
					</button>
				</Dialog.Close>
				<Dialog.Title className="flex flex-col gap-1 place-self-start">
					¿Quién lo tiene que pedir?
				</Dialog.Title>
				<div className="relative w-[550px] h-[500px] flex justify-center p-4 overflow-hidden">
					<span ref={wheell} className="absolute top-1/2 left-1/2"></span>
					<div className="z-1">
						<Wheel
							mustStartSpinning={mustSpin}
							prizeNumber={prizeNumber}
							data={spinOptions}
							textColors={['#fff']}
							outerBorderColor="#c4c4c4"
							radiusLineColor="#c4c4c4"
							backgroundColors={[
								'#df3428',
								'#ff6f3c',
								'#155263',
								'#ff9a3c',
								'#00bbf0',
								'#42b883',
								'#35495e',
								'#ff7e67',
							]}
							onStopSpinning={async () => {
								setMustSpin(false);

								try {
									const rect = wheell.current!.getBoundingClientRect();
									const x = rect.left + rect.width / 2;
									const y = rect.top + rect.height / 2;
									await confetti({
										particleCount: 300,
										spread: 360,
										origin: {
											x: x / window.innerWidth,
											y: y / window.innerHeight,
										},
									});
								} catch (error) {
									console.error('Confetti button error:', error);
								}
							}}
						/>
					</div>
				</div>
				<div className="flex w-full justify-end mt-4">
					<Button onClick={handleSpinClick}>Girar</Button>
				</div>
			</Dialog.Content>
		</Dialog.Root>
	);
}
export default RequestModal;
