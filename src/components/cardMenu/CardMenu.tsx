import { db } from '@/firebase/config';
import { getDateString } from '@/functions/DateUtils';
import type { MenuItem } from '@/types';
import { Button, Popover as RPopover, TextField, Tooltip } from '@radix-ui/themes';
import { doc, updateDoc } from 'firebase/firestore';
import { Calendar, DollarSign, Pencil, Plus, UtensilsCrossed } from 'lucide-react';
import { type KeyboardEvent, useState } from 'react';
import { toast } from 'sonner';
import { Modal, Popover, SpotlightCard } from '..';
import AnimatedContent from '../animatedContent/AnimatedContent';

interface CardMenuProps {
	info?: MenuItem;
	index?: number;
	deleteMenu?: (id: string) => void;
	addMenu?: (menu: Omit<MenuItem, 'id'>) => Promise<void> | void;
	isNew?: boolean;
}

interface MenuFormState {
	price: string;
	menu: string;
}

const emptyForm: MenuFormState = {
	price: '',
	menu: '',
};

function CardMenu({ info, index = 0, deleteMenu, addMenu, isNew = false }: CardMenuProps) {
	const [formInfo, setFormInfo] = useState<MenuFormState>(() =>
		info ? { price: String(info.price ?? ''), menu: info.menu ?? '' } : emptyForm,
	);
	const [isOpen, setOpen] = useState(false);

	const onOpen = () => {
		setFormInfo(info ? { price: String(info.price ?? ''), menu: info.menu ?? '' } : emptyForm);
		setOpen(true);
	};

	const handleOpenChange = (nextOpen: boolean) => {
		setOpen(nextOpen);
		if (!nextOpen) {
			setFormInfo(info ? { price: String(info.price ?? ''), menu: info.menu ?? '' } : emptyForm);
		}
	};

	const acceptEdition = () => {
		if (!info?.id) {
			toast.error('No se encontró el identificador del menú.');
			return;
		}
		toast.promise(
			updateDoc(doc(db, 'menu', info.id), {
				menu: formInfo.menu.trim(),
				price: Number(formInfo.price),
			}),
			{
				loading: 'Editando...',
				success: 'Editado correctamente!',
				error: 'No se pudo editar.',
			},
		);
		setOpen(false);
	};

	const deleteMenuHandler = () => {
		if (!info?.id || !deleteMenu) return;
		deleteMenu(info.id);
		setOpen(false);
	};

	const addNewMenu = async () => {
		if (!addMenu) return;
		await addMenu({
			menu: formInfo.menu.trim(),
			price: Number(formInfo.price),
			date: getDateString(new Date()),
		});
		handleOpenChange(false);
	};

	const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			onOpen();
		}
	};

	const menuTitle = info?.menu ? info.menu.charAt(0).toUpperCase() + info.menu.slice(1) : '';

	return (
		<div className="text-white h-full">
			<AnimatedContent
				distance={14}
				direction="vertical"
				duration={0.4}
				scale={0.97}
				delay={Math.min(index * 0.04, 0.28)}
			>
				<Tooltip content={info?.menu ?? ''} hidden={!info?.menu}>
					{!isNew ? (
						<SpotlightCard
							role="button"
							tabIndex={0}
							onClick={onOpen}
							onKeyDown={handleKeyDown}
							className="card-surface group cursor-pointer h-full p-3.5 shadow-lg hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-indigo-400"
						>
							<div className="flex flex-col justify-between gap-2.5 h-full">
								<div className="flex items-start justify-between gap-2">
									<span
										className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-bold tracking-tight"
										style={{
											backgroundColor: 'var(--accent-soft)',
											color: 'var(--accent-hex)',
										}}
									>
										${info?.price}
									</span>
									<span
										className="p-1 rounded-md text-gray-400 opacity-60 group-hover:opacity-100 group-hover:bg-white/10 transition-all"
										aria-hidden="true"
									>
										<Pencil className="w-3.5 h-3.5" />
									</span>
								</div>

								<div className="text-gray-100 font-medium text-sm line-clamp-2 leading-snug">
									{menuTitle}
								</div>

								<div className="flex items-center gap-1 text-[11px] text-gray-400 pt-0.5">
									<Calendar className="w-3 h-3 opacity-70" />
									<span>{info?.date || 'sin fecha'}</span>
								</div>
							</div>
						</SpotlightCard>
					) : (
						<div
							role="button"
							tabIndex={0}
							onClick={onOpen}
							onKeyDown={handleKeyDown}
							className="flex shadow-lg rounded-xl gap-2 h-full min-h-[108px] py-4 px-3 justify-center items-center cursor-pointer bg-white/[0.02] hover:bg-white/[0.06] border border-dashed border-white/20 hover:border-white/40 group transition-all duration-200 focus-visible:outline-2 focus-visible:outline-indigo-400"
						>
							<div
								className="w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-200 group-hover:scale-110"
								style={{
									backgroundColor: 'var(--accent-soft)',
									color: 'var(--accent-hex)',
								}}
							>
								<Plus className="w-4 h-4" aria-hidden="true" />
							</div>
							<span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
								Agregar menú
							</span>
						</div>
					)}
				</Tooltip>
			</AnimatedContent>

			<Modal
				open={isOpen}
				onOpenChange={handleOpenChange}
				title={isNew ? 'Crear menú' : 'Editar menú'}
				subtitle={
					isNew ? 'Agregá una nueva opción disponible para pedir' : 'Modificá el precio o descripción'
				}
				icon={<UtensilsCrossed className="w-4 h-4" />}
			>
				<div className="w-full flex flex-col gap-3.5">
					<label className="flex flex-col gap-1.5 text-sm">
						<span className="text-gray-300 font-medium">Precio</span>
						<TextField.Root
							style={{ background: 'rgba(0,0,0,0.25)' }}
							value={formInfo.price}
							type="number"
							placeholder="Ej. 8500"
							onChange={(e) => setFormInfo({ ...formInfo, price: e.target.value })}
							className="w-full"
						>
							<TextField.Slot>
								<DollarSign className="w-4 h-4" />
							</TextField.Slot>
						</TextField.Root>
					</label>

					<label className="flex flex-col gap-1.5 text-sm">
						<span className="text-gray-300 font-medium">Nombre del menú</span>
						<TextField.Root
							style={{ background: 'rgba(0,0,0,0.25)' }}
							value={formInfo.menu}
							placeholder="Ej. Milanesa con puré"
							onChange={(e) => setFormInfo({ ...formInfo, menu: e.target.value })}
							className="w-full"
						/>
					</label>
				</div>

				<div className="flex w-full justify-between items-center mt-5 pt-3 border-t border-white/10">
					{!isNew ? (
						<Popover
							trigger={
								<Button type="button" color="red" variant="soft">
									Eliminar
								</Button>
							}
							content={
								<span className="flex items-center flex-col gap-2 text-sm">
									¿Estás seguro de borrar este menú?
									<RPopover.Close>
										<Button type="button" color="red" onClick={deleteMenuHandler}>
											Confirmar
										</Button>
									</RPopover.Close>
								</span>
							}
						/>
					) : (
						<div />
					)}

					<div className="flex gap-2">
						<Button type="button" variant="soft" color="gray" onClick={() => handleOpenChange(false)}>
							Cancelar
						</Button>
						<Button
							type="button"
							disabled={!formInfo.price || !formInfo.menu.trim()}
							onClick={isNew ? addNewMenu : acceptEdition}
						>
							{isNew ? 'Crear menú' : 'Guardar cambios'}
						</Button>
					</div>
				</div>
			</Modal>
		</div>
	);
}

export default CardMenu;
