import { db } from '@/firebase/config';
import { getInfo } from '@/firebase/service';
import { getDateString } from '@/functions/DateUtils';
import { Badge, Button, TextArea, TextField, Tooltip } from '@radix-ui/themes';
import { doc, setDoc } from 'firebase/firestore';
import { DollarSign, Phone, Settings } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import Modal from '../modal/Modal';

function MenuMessage() {
	const [isOpen, setOpen] = useState(false);
	const [isEdit, setIsEdit] = useState(false);
	const [message, setMessage] = useState('');
	const [sendPrice, setSendPrice] = useState('0');
	const [phone, setPhone] = useState('');
	const [date, setDate] = useState('');

	const closeModal = (nextOpen: boolean) => {
		setOpen(nextOpen);
		if (!nextOpen) {
			setIsEdit(false);
		}
	};

	const openModal = async () => {
		try {
			const [data] = await getInfo();
			setMessage(data?.message ?? '');
			setDate(data?.date ? getDateString(new Date(data.date)) : '');
			setSendPrice(String(data?.sendPrice ?? 0));
			setPhone(data?.phone ?? '+543517513954');
			setOpen(true);
		} catch {
			toast.error('No se pudo cargar la configuración.');
		}
	};

	const acceptEdition = () => {
		if (isEdit) {
			const newDate = new Date().toISOString();
			setOpen(false);
			setIsEdit(false);
			toast.promise(
				setDoc(
					doc(db, 'info', 'info'),
					{ message, sendPrice: Number(sendPrice) || 0, phone, date: newDate },
					{ merge: true },
				),
				{
					loading: 'Editando...',
					success: () => {
						setDate(getDateString(new Date(newDate)));
						return 'Editado correctamente!';
					},
					error: 'No se pudo editar.',
				},
			);
			return;
		}
		setIsEdit(true);
	};

	return (
		<>
			<Tooltip content="Configuración">
				<Button
					type="button"
					variant="soft"
					className="!px-2.5"
					aria-label="Configuración"
					onClick={openModal}
				>
					<Settings className="w-4 h-4" />
				</Button>
			</Tooltip>

			<Modal
				open={isOpen}
				onOpenChange={closeModal}
				title="Configuración"
				subtitle="Mensaje de difusión, costo de envío y WhatsApp destino"
				icon={<Settings className="w-4 h-4" />}
				maxWidth="520px"
			>
				<div className="w-full flex flex-col gap-3.5">
					<div className="flex items-center justify-between">
						<span className="text-xs text-gray-400">Última edición: {date || 'Sin registros'}</span>
						<Badge color={isEdit ? 'amber' : 'gray'} variant="soft">
							{isEdit ? 'Editando' : 'Solo lectura'}
						</Badge>
					</div>

					<label className="flex flex-col gap-1.5 text-sm">
						<span className="text-gray-300 font-medium">Mensaje de difusión</span>
						<TextArea
							readOnly={!isEdit}
							rows={8}
							className="w-full h-48 sm:h-64"
							placeholder="Ingresá el mensaje de difusión"
							value={message}
							onChange={(e) => setMessage(e.target.value)}
							style={{ background: 'rgba(0, 0, 0, 0.25)' }}
						/>
					</label>

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
						<label className="flex flex-col gap-1.5 text-sm">
							<span className="text-gray-300 font-medium">Precio de envío</span>
							<TextField.Root
								readOnly={!isEdit}
								type="number"
								value={sendPrice}
								onChange={(e) => setSendPrice(e.target.value)}
								className="w-full"
							>
								<TextField.Slot>
									<DollarSign className="w-4 h-4" />
								</TextField.Slot>
							</TextField.Root>
						</label>

						<label className="flex flex-col gap-1.5 text-sm">
							<span className="text-gray-300 font-medium">Celular</span>
							<TextField.Root
								readOnly={!isEdit}
								type="text"
								value={phone}
								onChange={(e) => setPhone(e.target.value)}
								className="w-full"
							>
								<TextField.Slot>
									<Phone className="w-4 h-4" />
								</TextField.Slot>
							</TextField.Root>
						</label>
					</div>
				</div>

				<div className="flex items-center w-full justify-end gap-2 mt-5 pt-3 border-t border-white/10">
					{isEdit && (
						<Button type="button" variant="soft" color="gray" onClick={() => setIsEdit(false)}>
							Cancelar
						</Button>
					)}
					<Button type="button" onClick={acceptEdition}>
						{isEdit ? 'Guardar cambios' : 'Modo edición'}
					</Button>
				</div>
			</Modal>
		</>
	);
}

export default MenuMessage;
