import { PayMethods } from '@/consts/PayMethods';
import { db } from '@/firebase/config';
import { getDateString, isToday } from '@/functions/DateUtils';
import { Badge, Button, TextField, Tooltip } from '@radix-ui/themes';
import { Popover as RPopover } from '@radix-ui/themes';
import { doc, updateDoc } from 'firebase/firestore';
import { Pencil, Plus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Modal, Popover, Select } from '..';

function CardRequest({ info = null, menus, deleteReq, addReq, isNew = false }: any) {
	const [formInfo, setFormInfo] = useState(info);
	const [isOpen, setOpen] = useState(false);
	const onOpenChange = () => setOpen(!isOpen);
	const onOpen = () => {
		setFormInfo(info);
		setOpen(true);
	};

	const isOwnReq = () => {
		if (localStorage?.getItem?.('admin')) return true;

		const prevReqs = localStorage?.getItem?.('prevReqs')
			? JSON.parse(localStorage?.getItem?.('prevReqs') || '')
			: { value: [] };
		return prevReqs?.value.includes(info?.name);
	};

	const closeModal = () => {
		setFormInfo(info);
		onOpenChange();
	};

	const selectMenu = (menu: string) => {
		const menuSelected = menus.find((menuItem: any) => menuItem.menu === menu);
		setFormInfo({ ...formInfo, ...menuSelected });
	};

	const acceptEdition = () => {
		onOpenChange();

		const promm = async () => await updateDoc(doc(db, 'requests', info.id), formInfo);
		toast.promise(promm(), {
			loading: 'Editando...',
			success: () => {
				const prevReqs = localStorage?.getItem?.('prevReqs')
					? JSON.parse(localStorage?.getItem?.('prevReqs') || '')
					: { value: [] };
				localStorage.setItem(
					'prevReqs',
					JSON.stringify({ value: [...prevReqs.value.filter(), formInfo.name] }),
				);
				return 'Editando correctamente!';
			},
			error: 'No se pudo editar.',
		});
	};

	const deleteRequest = async (req: any) => {
		await deleteReq(req);
		onOpenChange();
		const prevReqs = localStorage?.getItem?.('prevReqs')
			? JSON.parse(localStorage?.getItem?.('prevReqs') || '')
			: { value: [] };
		localStorage.setItem(
			'prevReqs',
			JSON.stringify({ value: prevReqs.value.filter((value: string) => value !== info.name) }),
		);
	};

	const addNewReq = async () => {
		await addReq({ ...formInfo, date: getDateString(new Date()) });
		closeModal();
	};
	return (
		<div className="p-4 w-1/4">
			<Tooltip content={info?.name} hidden={!info?.menu}>
				{!isNew ? (
					<div
						onClick={() => isOwnReq() && onOpen()}
						className="cursor-pointer flex shadow-lg rounded-lg h-full bg-card/50 hover:bg-card/100 border-gray-500/50 border p-3 gap-1 flex-col relative text-sm backdrop-blur-xs"
					>
						{isOwnReq() && (
							<div className="absolute right-3 p-1 z-10 cursor-pointer">
								<Pencil className="w-4 h-4" />
							</div>
						)}
						<div className="text-primary-300 font-semibold text-base">{info?.name}</div>
						<div className="text-gray flex-1">
							{info?.menu}
							{info?.description ? `, ${info?.description}` : ''}
						</div>
						<div className="text-gray flex justify-between w-full">
							<Badge color={info?.type === PayMethods.EFECTIVO ? 'green' : 'blue'}>{info?.type} </Badge>
							<div className="text-xs flex items-center gap-2">
								{isToday(info?.date) && <Badge color="amber">HOY</Badge>}
								{info?.date}
							</div>
						</div>
					</div>
				) : (
					<div
						onClick={onOpen}
						className="flex shadow-lg rounded-lg gap-2 h-full py-4 justify-center items-center cursor-pointer bg-card/50 hover:bg-card/100 border-gray-500/50 border group backdrop-blur-xs"
					>
						<Plus />
						<p className="w-0 h-6 group-hover:w-auto interpolate-size transition-all overflow-hidden ">
							Agregar pedido
						</p>
					</div>
				)}
			</Tooltip>

			<Modal open={isOpen} onOpenChange={closeModal} title={isNew ? 'Crear pedido' : 'Editar pedido'}>
				<div className="flex flex-col gap-3">
					<label>
						Nombre
						<TextField.Root
							radius="large"
							className={`w-full`}
							value={formInfo?.name}
							onChange={(e) => setFormInfo({ ...formInfo, name: e.target.value })}
						/>
					</label>

					<label className="flex flex-col">
						Tipo de pago
						<Select
							value={formInfo?.type}
							onChange={(type) => setFormInfo({ ...formInfo, type })}
							items={[
								{ value: PayMethods.EFECTIVO, label: PayMethods.EFECTIVO },
								{ value: PayMethods.TRANSFERENCIA, label: PayMethods.TRANSFERENCIA },
							]}
						/>
					</label>

					<label className="flex flex-col">
						Menú
						<Select
							value={formInfo?.menu}
							onChange={selectMenu}
							items={menus}
							valueKey="menu"
							labelKey="menu"
						/>
					</label>

					<label>
						Descripción
						<TextField.Root
							radius="large"
							className={`w-full`}
							value={formInfo?.description}
							onChange={(e) => setFormInfo({ ...formInfo, description: e.target.value })}
						/>
					</label>
				</div>
				<div className="flex w-full justify-between mt-4">
					<Popover
						trigger={
							<Button className={isNew ? '!invisible' : ''} color="red" variant="soft">
								Eliminar
							</Button>
						}
						content={
							<span className="flex items-center flex-col gap-2">
								¿Estás seguro de borrar este pedido?
								<RPopover.Close>
									<Button color="red" variant="solid" onClick={() => deleteRequest(info)}>
										Confirmar
									</Button>
								</RPopover.Close>
							</span>
						}
					/>

					<Button
						disabled={!formInfo?.name || !formInfo?.type || !formInfo?.menu}
						onClick={isNew ? addNewReq : acceptEdition}
					>
						{isNew ? 'Crear' : 'Editar'}
					</Button>
				</div>
			</Modal>
		</div>
	);
}

export default CardRequest;
