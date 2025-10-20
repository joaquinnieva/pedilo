import { db } from '@/firebase/config';
import { Button, Dialog, Tooltip } from '@radix-ui/themes';
import { doc, updateDoc } from 'firebase/firestore';
import { X } from 'lucide-react';
import { useState } from 'react';
import { PrizeWheel } from '../wheel/Wheel';

type Props = {
	spinOptions: string[];
};

function RequestModal({ spinOptions }: Props) {
	const [isOpen, setOpen] = useState(false);
	const onOpen = () => setOpen(true);
	const onOpenChange = () => setOpen(!isOpen);

	const onWheelValue = (value: string) => {
		updateDoc(doc(db, 'info', 'wheel'), { winner: value });
		setTimeout(() => {
			updateDoc(doc(db, 'info', 'wheel'), { winner: '' });
		}, 100);
	};

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
				<PrizeWheel participants={spinOptions} onChange={onWheelValue} />
			</Dialog.Content>
		</Dialog.Root>
	);
}
export default RequestModal;
