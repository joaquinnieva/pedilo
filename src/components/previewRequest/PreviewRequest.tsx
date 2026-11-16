import { MessageGenerations } from '@/consts/MessageGenerations';
import { getInfo } from '@/firebase/service';
import { FormatCartToText } from '@/functions/GenerateMessage';
import type { AppInfo, OrderRequest } from '@/types';
import { Badge, Button, Dialog, Spinner, Tooltip } from '@radix-ui/themes';
import { Check, Copy, MessageCircle, Send, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

interface PreviewRequestProps {
	requests: OrderRequest[];
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	showTrigger?: boolean;
}

function PreviewRequest({
	requests,
	open: controlledOpen,
	onOpenChange: controlledOnOpenChange,
	showTrigger = true,
}: PreviewRequestProps) {
	const [internalOpen, setInternalOpen] = useState(false);
	const isControlled = controlledOpen !== undefined;
	const isOpen = isControlled ? controlledOpen : internalOpen;

	const setOpen = useCallback(
		(nextOpen: boolean) => {
			if (!isControlled) {
				setInternalOpen(nextOpen);
			}
			controlledOnOpenChange?.(nextOpen);
		},
		[isControlled, controlledOnOpenChange],
	);

	const [isLoading, setIsLoading] = useState(false);
	const [copied, setCopied] = useState(false);
	const [text, setText] = useState('');
	const [info, setInfo] = useState<AppInfo | null>(null);

	const loadPreview = useCallback(async () => {
		setIsLoading(true);
		setCopied(false);
		try {
			const [data] = await getInfo();
			const sendPrice = Number(data?.sendPrice) || 0;
			setInfo(data ?? null);
			setText(
				FormatCartToText({
					data: requests,
					action: MessageGenerations.PREVIEW,
					sendPrice,
				}),
			);
			return true;
		} catch {
			toast.error('No se pudo cargar la información de envío.');
			return false;
		} finally {
			setIsLoading(false);
		}
	}, [requests]);

	useEffect(() => {
		if (isControlled && controlledOpen) {
			void loadPreview();
		}
	}, [isControlled, controlledOpen, loadPreview]);

	const previewText = async () => {
		const loaded = await loadPreview();
		if (loaded) {
			setOpen(true);
		}
	};

	const copyText = async () => {
		try {
			await navigator.clipboard.writeText(
				FormatCartToText({
					data: requests,
					action: MessageGenerations.COPY,
					sendPrice: Number(info?.sendPrice) || 0,
				}),
			);
			setCopied(true);
			toast.success('Copiado al portapapeles');
			setTimeout(() => setCopied(false), 2000);
		} catch {
			toast.error('No se pudo copiar al portapapeles');
		}
	};

	const generateSent = () => {
		const phone = (info?.phone || '+543517513954').replace(/\s+/g, '');
		const wpText = FormatCartToText({
			data: requests,
			action: MessageGenerations.WP,
			sendPrice: Number(info?.sendPrice) || 0,
		});
		window.open(`https://wa.me/${phone}?text=${wpText}`, '_blank', 'noopener,noreferrer');
	};

	const shipping = Number(info?.sendPrice) || 0;

	return (
		<Dialog.Root open={isOpen} onOpenChange={setOpen}>
			{showTrigger && (
				<Tooltip content="Solicitalo o copialo 🙏🏽">
					<Button type="button" onClick={previewText} loading={isLoading} className="gap-1.5">
						<Send className="w-3.5 h-3.5" />
						PEDILO
					</Button>
				</Tooltip>
			)}
			<Dialog.Content className="relative w-[calc(100vw-2rem)] !p-5 sm:!p-6" maxWidth="520px">
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
					<div
						className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
						style={{ backgroundColor: 'var(--accent-soft)', color: 'var(--accent-hex)' }}
					>
						<MessageCircle className="w-4 h-4" />
					</div>
					<div>
						<Dialog.Title className="!mb-0 !text-lg">Previsualizar pedido</Dialog.Title>
						<p className="text-xs text-gray-400 mt-0.5">
							{requests.length} {requests.length === 1 ? 'pedido incluido' : 'pedidos incluidos'}
							{shipping > 0 ? ` · Envío $${shipping}` : ''}
						</p>
					</div>
				</div>

				<div className="w-full relative mb-4">
					<div className="rounded-xl bg-black/30 p-4 pr-11 border border-white/10 whitespace-pre-line text-sm leading-relaxed text-gray-100 max-h-[55vh] min-h-[120px] overflow-y-auto font-mono">
						{isLoading && !text ? (
							<span className="flex items-center gap-2 text-gray-400">
								<Spinner /> Cargando resumen...
							</span>
						) : (
							text
						)}
					</div>
					<Tooltip content={copied ? 'Copiado' : 'Copiar'}>
						<button
							type="button"
							onClick={copyText}
							aria-label="Copiar texto"
							className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-gray-200 transition-colors cursor-pointer"
						>
							{copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
						</button>
					</Tooltip>
				</div>

				<div className="flex flex-wrap items-center justify-between gap-2 pt-1">
					<Badge variant="soft" color="gray">
						Destino: {info?.phone || '+543517513954'}
					</Badge>
					<Button type="button" color="green" onClick={generateSent} className="gap-1.5">
						<Send className="w-3.5 h-3.5" />
						Enviar por WhatsApp
					</Button>
				</div>
			</Dialog.Content>
		</Dialog.Root>
	);
}

export default PreviewRequest;
