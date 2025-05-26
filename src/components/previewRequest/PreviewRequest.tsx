import { MessageGenerations } from '@/consts/MessageGenerations';
import { getInfo } from '@/firebase/service';
import { FormatCartToText } from '@/functions/GenerateMessage';
import { Button, Dialog, Tooltip } from '@radix-ui/themes';
import { X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

function PreviewRequest({ requests }: { requests: any }) {
	const [isOpen, setOpen] = useState(false);
	const onOpen = () => setOpen(true);
	const onOpenChange = () => setOpen(!isOpen);

	const [text, setText] = useState('');
	const [info, setInfo] = useState<any>(null);

	const previewText = async () => {
		const [data]: any = await getInfo();
		setInfo(data);
		setText(
			FormatCartToText({
				data: requests,
				action: MessageGenerations.PREVIEW,
				sendPrice: Number(data?.sendPrice),
			}),
		);
		onOpen();
	};

	const copyText = () => {
		navigator.clipboard.writeText(
			FormatCartToText({
				data: requests,
				action: MessageGenerations.COPY,
				sendPrice: Number(info?.sendPrice),
			}),
		);
		toast.success('Copiado al portapapeles');
	};

	const generateSent = () => {
		window.open(
			`https://wa.me/${info?.phone || '+543517513954'}?text=${FormatCartToText({
				data: requests,
				action: MessageGenerations.WP,
				sendPrice: Number(info?.sendPrice),
			})}`,
		);
	};

	return (
		<Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
			<Dialog.Trigger>
				<Tooltip content="Solicitalo o copialo 🙏🏽">
					<Button onClick={previewText}>PEDILO</Button>
				</Tooltip>
			</Dialog.Trigger>
			<Dialog.Content className="grid place-items-center">
				<Dialog.Close className="!absolute !top-5 !right-5 cursor-pointer">
					<button>
						<X />
					</button>
				</Dialog.Close>
				<Dialog.Title className="flex flex-col gap-1 place-self-start">
					Previsualizar mensaje
				</Dialog.Title>
				<div className="w-full">
					<div className="mb-2 rounded-md bg-foreground-50/50 p-4 border border-gray-500/50 whitespace-pre-line">
						{text}
					</div>
				</div>
				<div className="flex w-full justify-end gap-2">
					<Button onClick={copyText}>Copiar</Button>
					<Button color="yellow" onClick={generateSent}>
						PEDILO
					</Button>
				</div>
			</Dialog.Content>
		</Dialog.Root>
	);
}

export default PreviewRequest;
