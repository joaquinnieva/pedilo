import { Dialog } from '@radix-ui/themes';
import { X } from 'lucide-react';
import type { ReactNode } from 'react';

interface ModalProps {
	children: ReactNode;
	open: boolean;
	title: string;
	subtitle?: string;
	icon?: ReactNode;
	maxWidth?: string;
	onOpenChange: (open: boolean) => void;
}

function Modal({
	children,
	open,
	onOpenChange,
	title,
	subtitle,
	icon,
	maxWidth = '460px',
}: ModalProps) {
	return (
		<Dialog.Root open={open} onOpenChange={onOpenChange}>
			<Dialog.Content maxWidth={maxWidth} className="relative w-[calc(100vw-2rem)] !p-5 sm:!p-6">
				<Dialog.Close asChild>
					<button
						type="button"
						aria-label="Cerrar"
						className="!absolute !top-4 !right-4 cursor-pointer rounded-full p-1.5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
					>
						<X className="w-4 h-4" />
					</button>
				</Dialog.Close>

				<div className="flex items-start gap-3 pr-8 mb-4 pb-3 border-b border-white/10">
					{icon && (
						<div
							className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
							style={{ backgroundColor: 'var(--accent-soft)', color: 'var(--accent-hex)' }}
						>
							{icon}
						</div>
					)}
					<div className="min-w-0">
						<Dialog.Title className="!mb-0 !text-lg">{title}</Dialog.Title>
						{subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
					</div>
				</div>

				{children}
			</Dialog.Content>
		</Dialog.Root>
	);
}

export default Modal;
