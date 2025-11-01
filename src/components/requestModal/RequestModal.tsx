import { Button, Dialog, Tooltip } from '@radix-ui/themes';
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
				<PrizeWheel participants={spinOptions} />
			</Dialog.Content>
		</Dialog.Root>
	);
}
export default RequestModal;
