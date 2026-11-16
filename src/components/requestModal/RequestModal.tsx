import { Button, Dialog, Tooltip } from '@radix-ui/themes';
import { Dices, X } from 'lucide-react';
import { useState } from 'react';
import { PrizeWheel } from '../wheel/Wheel';

type Props = {
	spinOptions: string[];
	onWinner?: (winnerName: string) => void;
	wheelLocked?: boolean;
	winnerName?: string;
};

function RequestModal({ spinOptions, onWinner, wheelLocked = false, winnerName = '' }: Props) {
	const [isOpen, setOpen] = useState(false);

	if (!spinOptions || spinOptions.length === 0) return null;

	return (
		<Dialog.Root open={isOpen} onOpenChange={setOpen}>
			<Tooltip
				content={
					wheelLocked
						? 'Ya se sorteó. Agregá un nuevo pedido para volver a sortear'
						: 'Hay que sortearlo 🥚'
				}
			>
				<Button
					type="button"
					color="amber"
					variant="soft"
					className="gap-1.5"
					onClick={() => setOpen(true)}
				>
					<Dices className="w-4 h-4" />
					¿Quién lo tiene que pedir?
				</Button>
			</Tooltip>

			<Dialog.Content className="relative w-[calc(100vw-2rem)] !p-5 sm:!p-6" maxWidth="500px">
				<Dialog.Close asChild>
					<button
						type="button"
						aria-label="Cerrar"
						className="!absolute !top-4 !right-4 cursor-pointer rounded-full p-1.5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
					>
						<X className="w-4 h-4" />
					</button>
				</Dialog.Close>

				<div className="flex items-start gap-3 pr-8 mb-3 pb-3 border-b border-white/10">
					<div
						className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
						style={{ backgroundColor: 'var(--accent-soft)', color: 'var(--accent-hex)' }}
					>
						<Dices className="w-4 h-4" />
					</div>
					<div>
						<Dialog.Title className="!mb-0 !text-lg">¿Quién lo tiene que pedir?</Dialog.Title>
						<p className="text-xs text-gray-400 mt-0.5">
							Participan {spinOptions.length} {spinOptions.length === 1 ? 'pedido' : 'pedidos'}
						</p>
					</div>
				</div>

				<PrizeWheel
					participants={spinOptions}
					onWinner={onWinner}
					isLocked={wheelLocked}
					lockedWinner={winnerName}
				/>
			</Dialog.Content>
		</Dialog.Root>
	);
}

export default RequestModal;
