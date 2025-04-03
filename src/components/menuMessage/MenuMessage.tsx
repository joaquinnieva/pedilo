import { db } from '@/firebase/config';
import { getInfo } from '@/firebase/service';
import { getDateString } from '@/functions/DateUtils';
import { Button, TextArea, TextField, Tooltip } from '@radix-ui/themes';
import { doc, updateDoc } from 'firebase/firestore';
import { DollarSign, Settings } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import Modal from '../modal/Modal';

function MenuMessage() {
	const [isOpen, setOpen] = useState(false);
	const onOpen = () => setOpen(true);
	const onOpenChange = () => setOpen(!isOpen);

	const [isEdit, setIsEdit] = useState(false);
	const [message, setMessage] = useState('');
	const [sendPrice, setSendPrice] = useState('0');
	const [phone, setPhone] = useState('');
	const [date, setDate] = useState('');

	const closeModal = () => {
		onOpenChange();
		setIsEdit(false);
	};

	const openModal = async () => {
		const [data]: any = await getInfo();
		setMessage(data?.message);
		setDate(data?.date ? getDateString(new Date(data?.date)) : '');
		setSendPrice(data?.sendPrice || 0);
		setPhone(data?.phone || '+543517513954');
		onOpen();
	};
	const acceptEdition = () => {
		const newDate = new Date().toISOString();
		if (isEdit) {
			onOpenChange();
			toast.promise(updateDoc(doc(db, 'info', 'info'), { message, sendPrice, phone, date: newDate }), {
				loading: 'Editando...',
				success: () => {
					setDate(newDate);
					return 'Editando correctamente!';
				},
				error: 'No se pudo editar.',
			});
		}
		setIsEdit(!isEdit);
	};

	return (
		<>
			<Tooltip content="Configuración">
				<Button variant="outline" className="!px-2" onClick={openModal}>
					<Settings className="w-4 h-4" />
				</Button>
			</Tooltip>

			<Modal open={isOpen} onOpenChange={closeModal} title="Configuración">
				<div className="w-full h-full flex flex-col gap-4">
					<TextArea
						readOnly={!isEdit}
						rows={20}
						className="w-full"
						placeholder="Ingresá el mensaje de difusión"
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						style={{ background: 'transparent', height: '500px!important' }}
					/>
					<label>
						Precio de envío
						<TextField.Root
							readOnly={!isEdit}
							type="number"
							value={sendPrice}
							onChange={(e) => setSendPrice(e.target.value)}
							className={`w-full`}
						>
							<TextField.Slot>
								<DollarSign className="w-4 h-4" />
							</TextField.Slot>
						</TextField.Root>
					</label>
					<label>
						Celular
						<TextField.Root
							readOnly={!isEdit}
							type="text"
							value={phone}
							onChange={(e) => setPhone(e.target.value)}
							className={`w-full`}
						/>
					</label>
				</div>
				<div className="flex w-full justify-between mt-4">
					<span>Última edición: {date}</span>
					<Button onClick={acceptEdition}>{isEdit ? 'Guardar' : 'Modo edición'}</Button>
				</div>
			</Modal>
		</>
	);
}

export default MenuMessage;
