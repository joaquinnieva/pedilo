import { PayMethods } from '@/consts/PayMethods';
import { db } from '@/firebase/config';
import { getRequests } from '@/firebase/service';
import { getDateString, isToday } from '@/functions/DateUtils';
import { Badge, Button, Popover as RPopover, TextField, Tooltip } from '@radix-ui/themes';
import { doc, updateDoc } from 'firebase/firestore';
import { Copy, Pencil, Plus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Modal, Popover, Select } from '..';
import AnimatedContent from '../animatedContent/AnimatedContent';

function CardRequest({ info = null, menus, deleteReq, addReq, isNew = false }: any) {
	const name = JSON.parse(localStorage.getItem('name') || 'null');
	const [formInfo, setFormInfo] = useState(info);
	const [isOpen, setOpen] = useState(false);
	const onOpenChange = () => setOpen(!isOpen);
	const onOpen = () => {
		setFormInfo({ ...info, name });
		setOpen(true);
	};

	const isOwnReq = () => {
		// if (localStorage?.getItem?.('admin')) return true;
		const prevReqs = JSON.parse(localStorage.getItem('name') || 'null');
		return prevReqs === info?.name;
	};

	const closeModal = () => {
		setFormInfo(info);
		onOpenChange();
	};

	const selectMenu = (menu: string) => {
		const menuSelected = menus.find((menuItem: any) => menuItem.menu === menu);
		setFormInfo({ ...formInfo, ...menuSelected });
	};

	const acceptEdition = async () => {
		onOpenChange();

		const reqs = await getRequests();
		const id = reqs.find((reqs: any) => reqs.name === info.name && reqs.menu === info.menu)?.id || '';

		const promm = async () => await updateDoc(doc(db, 'requests', id), formInfo);
		toast.promise(promm(), {
			loading: 'Editando...',
			success: () => {
				const prevReqs = localStorage?.getItem?.('prevReqs')
					? JSON.parse(localStorage?.getItem?.('prevReqs') || '')
					: { value: [] };
				localStorage.setItem('prevReqs', JSON.stringify({ value: [...prevReqs.value, formInfo.name] }));
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
		<div className="p-2 w-1/4">
			<AnimatedContent
				distance={0}
				direction="horizontal"
				reverse={false}
				duration={1}
				ease="bounce.out"
				initialOpacity={0.2}
				animateOpacity
				scale={1.1}
			>
				<Tooltip content={info?.name} hidden={!info?.menu}>
					{!isNew ? (
						<div
							onClick={() => isOwnReq() && onOpen()}
							className="cursor-pointer bounce flex shadow-lg rounded-lg h-full bg-card/50 hover:border-gray-500 border-gray-500/50 border p-3 gap-1 flex-col relative text-sm backdrop-blur-xs"
						>
							{isOwnReq() ? (
								<div className="absolute right-3 p-1 z-10 cursor-pointer">
									<Pencil className="w-4 h-4" />
								</div>
							) : (
								<div
									className="absolute right-3 p-1 z-10 cursor-pointer"
									onClick={(e) => {
										e.stopPropagation();
										onOpen();
										setFormInfo({ ...formInfo, name });
									}}
								>
									<Copy className="w-4 h-4" />
								</div>
							)}
							<div className="text-primary-300 font-semibold text-base">{info?.name}</div>
							<div className="text-gray flex-1">
								{info?.menu}
								{info?.description ? `, ${info?.description}` : ''}
							</div>
							<div className="text-gray flex justify-between w-full">
								<div>
									<Badge color={info?.type === PayMethods.EFECTIVO ? 'green' : 'blue'}>
										${info?.price} {info?.type}{' '}
									</Badge>
								</div>
								<div className="text-xs flex items-center gap-2">
									{info?.date}
									{isToday(info?.date) && (
										<Badge variant="outline" color="amber">
											HOY
										</Badge>
									)}
								</div>
							</div>
						</div>
					) : (
						<div
							onClick={onOpen}
							className="flex shadow-lg rounded-lg gap-2 h-full py-4 justify-center items-center cursor-pointer bg-card/50 hover:border-gray-500 border-gray-500/50 border group backdrop-blur-xs"
						>
							<Plus />
							<p className="w-0 h-6 group-hover:w-auto interpolate-size transition-all overflow-hidden ">
								Agregar pedido
							</p>
						</div>
					)}
				</Tooltip>
			</AnimatedContent>

			<Modal
				open={isOpen}
				onOpenChange={closeModal}
				title={isOwnReq() ? (isNew ? 'Crear pedido' : 'Editar pedido') : 'Crear pedido'}
			>
				<div className="flex flex-col gap-3">
					<label>
						Nombre
						<TextField.Root
							radius="large"
							className={`w-full`}
							value={formInfo?.name}
							defaultValue={name}
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
							<Button
								className={isOwnReq() ? (isNew ? '!invisible' : '') : '!invisible'}
								color="red"
								variant="soft"
							>
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
						disabled={!formInfo?.name || !name || !formInfo?.type || !formInfo?.menu}
						onClick={isOwnReq() ? (isNew ? addNewReq : acceptEdition) : addNewReq}
					>
						{isOwnReq() ? (isNew ? 'Crear' : 'Editar') : 'Crear'}
					</Button>
				</div>
			</Modal>
		</div>
	);
}

export default CardRequest;
