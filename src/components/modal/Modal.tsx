import { Dialog } from '@radix-ui/themes';
import { X } from 'lucide-react';

interface ModalProps {
	children: React.ReactNode;
	open: boolean;
	title: string;
	onOpenChange: (open: boolean) => void;
}

function Modal({ children, open, onOpenChange, title }: ModalProps) {
	return (
		<Dialog.Root open={open} onOpenChange={onOpenChange}>
			<Dialog.Content maxWidth="450px" className="relative">
				<Dialog.Title>{title}</Dialog.Title>
				<Dialog.Close className="!absolute !top-5 !right-5 cursor-pointer">
					<button>
						<X />
					</button>
				</Dialog.Close>
				{children}
			</Dialog.Content>
		</Dialog.Root>
	);
}

export default Modal;
