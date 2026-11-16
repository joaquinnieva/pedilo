import { PayMethods } from '@/consts/PayMethods';
import { db } from '@/firebase/config';
import { getDateString, isToday } from '@/functions/DateUtils';
import type { MenuItem, OrderRequest } from '@/types';
import { Badge, Button, Checkbox, Popover as RPopover, TextField, Tooltip } from '@radix-ui/themes';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import {
	ArrowLeftRight,
	Banknote,
	Check,
	Copy,
	Crown,
	DollarSign,
	Pencil,
	Plus,
	ShoppingBag,
} from 'lucide-react';
import { type KeyboardEvent, type MouseEvent, useState } from 'react';
import { toast } from 'sonner';
import { Modal, Popover, Select, SpotlightCard } from '..';
import AnimatedContent from '../animatedContent/AnimatedContent';

interface CardRequestProps {
	info?: OrderRequest;
	index?: number;
	menus: MenuItem[];
	userName: string;
	winnerName?: string;
	deleteReq?: (id: string) => Promise<void> | void;
	addReq?: (req: Omit<OrderRequest, 'id'>) => Promise<void> | void;
	isNew?: boolean;
}

interface RequestFormState {
	name: string;
	type: string;
	menu: string;
	price: number | string;
	description: string;
	paid: boolean;
}

function getInitials(name?: string): string {
	if (!name) return '?';
	return name
		.trim()
		.split(/\s+/)
		.slice(0, 2)
		.map((part) => part[0]?.toUpperCase() ?? '')
		.join('');
}

function CardRequest({
	info,
	index = 0,
	menus,
	userName,
	winnerName = '',
	deleteReq,
	addReq,
	isNew = false,
}: CardRequestProps) {
	const [mode, setMode] = useState<'create' | 'edit'>('create');
	const [formInfo, setFormInfo] = useState<RequestFormState>({
		name: userName,
		type: PayMethods.EFECTIVO,
		menu: '',
		price: '',
		description: '',
		paid: false,
	});
	const [isOpen, setOpen] = useState(false);
	const [isCustomMenu, setIsCustomMenu] = useState(false);
	const [isTogglingPaid, setIsTogglingPaid] = useState(false);

	const isOwnReq = !isNew && Boolean(userName) && userName === info?.name;

	const openCreateModal = () => {
		setMode('create');
		setIsCustomMenu(menus.length === 0);
		setFormInfo({
			name: userName,
			type: PayMethods.EFECTIVO,
			menu: '',
			price: '',
			description: '',
			paid: false,
		});
		setOpen(true);
	};

	const openEditModal = () => {
		if (!info) return;
		setMode('edit');
		setIsCustomMenu(false);
		setFormInfo({
			name: info.name ?? userName,
			type: info.type ?? PayMethods.EFECTIVO,
			menu: info.menu ?? '',
			price: info.price ?? '',
			description: info.description ?? '',
			paid: Boolean(info.paid),
		});
		setOpen(true);
	};

	const openCloneModal = () => {
		if (!info) return;
		setMode('create');
		setIsCustomMenu(false);
		setFormInfo({
			name: userName,
			type: info.type ?? PayMethods.EFECTIVO,
			menu: info.menu ?? '',
			price: info.price ?? '',
			description: info.description ?? '',
			paid: false,
		});
		setOpen(true);
	};

	const toggleCustomMenu = (custom: boolean) => {
		setIsCustomMenu(custom);
		setFormInfo((prev) => ({
			...prev,
			menu: '',
			price: '',
		}));
	};

	const ensureMenuSaved = async (menuName: string, priceValue: number | string) => {
		const trimmedMenu = menuName.trim();
		const numericPrice = Number(priceValue);
		const alreadyExists = menus.some(
			(item) => item.menu.trim().toLowerCase() === trimmedMenu.toLowerCase(),
		);
		if (!alreadyExists && trimmedMenu) {
			await addDoc(collection(db, 'menu'), {
				menu: trimmedMenu,
				price: numericPrice,
				date: getDateString(new Date()),
			});
		}
	};

	const selectMenu = (menuName: string) => {
		const menuSelected = menus.find((menuItem) => menuItem.menu === menuName);
		setFormInfo((prev) => ({
			...prev,
			menu: menuSelected?.menu ?? menuName,
			price: menuSelected?.price ?? prev.price,
		}));
	};

	const acceptEdition = async () => {
		if (!info?.id) {
			toast.error('No se encontró el identificador del pedido.');
			return;
		}
		const trimmedMenu = formInfo.menu.trim();
		const numericPrice = Number(formInfo.price);
		setOpen(false);

		const updatePromise = async () => {
			if (isCustomMenu) {
				await ensureMenuSaved(trimmedMenu, numericPrice);
			}
			await updateDoc(doc(db, 'requests', info.id), {
				name: formInfo.name.trim(),
				type: formInfo.type,
				menu: trimmedMenu,
				price: numericPrice,
				description: formInfo.description.trim(),
				paid: formInfo.paid,
			});
		};

		toast.promise(updatePromise(), {
			loading: 'Editando...',
			success: () => {
				const prevReqs = localStorage.getItem('prevReqs')
					? JSON.parse(localStorage.getItem('prevReqs') || '{"value":[]}')
					: { value: [] };
				localStorage.setItem(
					'prevReqs',
					JSON.stringify({ value: [...(prevReqs.value ?? []), formInfo.name.trim()] }),
				);
				return 'Editado correctamente!';
			},
			error: 'No se pudo editar.',
		});
	};

	const deleteRequest = async () => {
		if (!info?.id || !deleteReq) return;
		await deleteReq(info.id);
		setOpen(false);
		const prevReqs = localStorage.getItem('prevReqs')
			? JSON.parse(localStorage.getItem('prevReqs') || '{"value":[]}')
			: { value: [] };
		localStorage.setItem(
			'prevReqs',
			JSON.stringify({
				value: (prevReqs.value ?? []).filter((value: string) => value !== info.name),
			}),
		);
	};

	const addNewReq = async () => {
		if (!addReq) return;
		const trimmedMenu = formInfo.menu.trim();
		const numericPrice = Number(formInfo.price);

		if (isCustomMenu) {
			try {
				await ensureMenuSaved(trimmedMenu, numericPrice);
			} catch {
				toast.error('No se pudo guardar el nuevo menú.');
				return;
			}
		}

		await addReq({
			name: formInfo.name.trim(),
			type: formInfo.type,
			menu: trimmedMenu,
			price: numericPrice,
			description: formInfo.description.trim(),
			date: getDateString(new Date()),
			paid: formInfo.paid,
		});
		setOpen(false);
	};

	const togglePaid = async (e: MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation();
		if (!info?.id || isTogglingPaid) return;
		const nextPaid = !info.paid;
		setIsTogglingPaid(true);
		try {
			await updateDoc(doc(db, 'requests', info.id), { paid: nextPaid });
		} catch {
			toast.error('No se pudo actualizar el estado de pago.');
		} finally {
			setIsTogglingPaid(false);
		}
	};

	const handleCardKeyDown = (e: KeyboardEvent<HTMLDivElement>, handler: () => void) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			handler();
		}
	};

	const hasValidCustomPrice =
		!isCustomMenu || (formInfo.price !== '' && !Number.isNaN(Number(formInfo.price)));
	const canSubmit = Boolean(
		formInfo.name.trim() && formInfo.type && formInfo.menu.trim() && hasValidCustomPrice,
	);
	const isCash = info?.type === PayMethods.EFECTIVO;
	const isWinner =
		!isNew &&
		Boolean(winnerName) &&
		Boolean(info?.name) &&
		info?.name.trim().toLowerCase() === winnerName.trim().toLowerCase();

	return (
		<div className="h-full">
			<AnimatedContent
				distance={16}
				direction="vertical"
				duration={0.42}
				scale={0.97}
				delay={Math.min(index * 0.04, 0.32)}
			>
				<Tooltip content={info?.name ?? ''} hidden={!info?.menu}>
					{!isNew ? (
						<SpotlightCard
							role={isOwnReq ? 'button' : undefined}
							tabIndex={isOwnReq ? 0 : undefined}
							onClick={isOwnReq ? openEditModal : undefined}
							onKeyDown={isOwnReq ? (e) => handleCardKeyDown(e, openEditModal) : undefined}
							spotlightColor={isWinner ? 'rgba(251, 191, 36, 0.35)' : undefined}
							className={`card-surface group h-full p-3.5 shadow-lg text-sm ${
								isWinner ? 'card-winner' : info?.paid ? '!border-emerald-500/40' : ''
							} ${
								isOwnReq
									? 'cursor-pointer hover:-translate-y-0.5 ring-1 ring-inset ring-white/15 focus-visible:outline-2 focus-visible:outline-indigo-400'
									: ''
							}`}
						>
							<div className="flex flex-col gap-2.5 h-full">
								<div className="flex items-start justify-between gap-2">
									<div className="flex items-center gap-2.5 min-w-0">
										<div
											className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 border ${
												isWinner ? 'border-amber-300/60 bg-amber-400/25 text-amber-200' : 'border-white/10'
											}`}
											style={
												isWinner
													? undefined
													: isOwnReq
														? {
																backgroundColor: 'var(--accent-soft)',
																color: 'var(--accent-hex)',
															}
														: {
																backgroundColor: 'rgba(255, 255, 255, 0.08)',
																color: '#e2e8f0',
															}
											}
										>
											{isWinner ? <Crown className="w-4 h-4 text-amber-300" /> : getInitials(info?.name)}
										</div>
										<div className="min-w-0">
											<div className="flex flex-wrap items-center gap-1.5">
												<span
													className={`font-semibold truncate text-base leading-tight ${
														isWinner ? 'text-amber-100' : 'text-white'
													}`}
												>
													{info?.name}
												</span>
												{isOwnReq && (
													<Badge size="1" variant="soft">
														Tú
													</Badge>
												)}
												{isWinner && (
													<Badge size="1" color="amber" variant="solid" className="gap-1">
														Le toca pedir
													</Badge>
												)}
											</div>
										</div>
									</div>

									<div className="flex items-center gap-1.5 shrink-0">
										<Tooltip content={info?.paid ? 'Marcar como pendiente' : 'Marcar como pagado'}>
											<button
												type="button"
												aria-pressed={Boolean(info?.paid)}
												aria-label={
													info?.paid
														? `${info?.name ?? 'Pedido'} ya pagó`
														: `Marcar pago de ${info?.name ?? 'pedido'}`
												}
												disabled={isTogglingPaid}
												onClick={togglePaid}
												className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-medium border transition-all cursor-pointer disabled:opacity-60 ${
													info?.paid
														? 'bg-emerald-500/20 border-emerald-400/50 text-emerald-300 hover:bg-emerald-500/30'
														: 'bg-white/[0.04] border-white/15 text-gray-400 hover:text-white hover:border-white/30'
												}`}
											>
												<span
													className={`w-3.5 h-3.5 rounded-sm flex items-center justify-center border ${
														info?.paid ? 'bg-emerald-400 border-emerald-400 text-slate-950' : 'border-current'
													}`}
												>
													{info?.paid && <Check className="w-2.5 h-2.5 stroke-[3]" />}
												</span>
												<span>Pagado</span>
											</button>
										</Tooltip>

										{isOwnReq ? (
											<span
												className="p-1.5 rounded-md text-gray-400 opacity-60 group-hover:opacity-100 group-hover:bg-white/10 transition-all shrink-0"
												aria-hidden="true"
											>
												<Pencil className="w-3.5 h-3.5" />
											</span>
										) : (
											<Tooltip content="Copiar este pedido">
												<button
													type="button"
													aria-label={`Copiar pedido de ${info?.name ?? ''}`}
													className="p-1.5 z-10 cursor-pointer rounded-md bg-white/[0.04] hover:bg-white/15 text-gray-300 hover:text-white transition-colors shrink-0"
													onClick={openCloneModal}
												>
													<Copy className="w-3.5 h-3.5" />
												</button>
											</Tooltip>
										)}
									</div>
								</div>

								<div className="flex-1 flex flex-col gap-1">
									<p className="text-gray-100 font-medium leading-snug">{info?.menu}</p>
									{info?.description && (
										<p className="text-xs text-gray-400 italic line-clamp-2">“{info.description}”</p>
									)}
								</div>

								<div className="flex flex-wrap justify-between items-center gap-2 pt-2 border-t border-white/[0.07]">
									<Badge color={isCash ? 'green' : 'blue'} variant="soft" className="gap-1">
										{isCash ? <Banknote className="w-3 h-3" /> : <ArrowLeftRight className="w-3 h-3" />}$
										{info?.price} · {info?.type}
									</Badge>

									<div className="text-[11px] flex items-center gap-1.5 text-gray-400">
										<span>{info?.date}</span>
										{isToday(info?.date) && (
											<Badge variant="solid" color="amber" size="1">
												HOY
											</Badge>
										)}
									</div>
								</div>
							</div>
						</SpotlightCard>
					) : (
						<div
							role="button"
							tabIndex={0}
							onClick={openCreateModal}
							onKeyDown={(e) => handleCardKeyDown(e, openCreateModal)}
							className="flex shadow-lg rounded-xl gap-2.5 h-full min-h-[124px] py-4 px-3 justify-center items-center cursor-pointer bg-white/[0.02] hover:bg-white/[0.06] border border-dashed border-white/20 hover:border-white/40 group transition-all duration-200 focus-visible:outline-2 focus-visible:outline-indigo-400"
						>
							<div
								className="w-9 h-9 rounded-full flex items-center justify-center transition-transform duration-200 group-hover:scale-110"
								style={{
									backgroundColor: 'var(--accent-soft)',
									color: 'var(--accent-hex)',
								}}
							>
								<Plus className="w-5 h-5" aria-hidden="true" />
							</div>
							<span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
								Agregar pedido
							</span>
						</div>
					)}
				</Tooltip>
			</AnimatedContent>

			<Modal
				open={isOpen}
				onOpenChange={setOpen}
				title={mode === 'edit' ? 'Editar pedido' : 'Nuevo pedido'}
				subtitle={
					mode === 'edit'
						? 'Actualizá tu elección o forma de pago'
						: 'Elegí un menú disponible y cómo vas a pagar'
				}
				icon={<ShoppingBag className="w-4 h-4" />}
			>
				<div className="flex flex-col gap-3.5">
					<label className="flex flex-col gap-1.5 text-sm">
						<span className="text-gray-300 font-medium">Nombre</span>
						<TextField.Root
							radius="large"
							className="w-full"
							value={formInfo.name}
							placeholder="Tu nombre"
							onChange={(e) => setFormInfo({ ...formInfo, name: e.target.value })}
						/>
					</label>

					<label className="flex flex-col gap-1.5 text-sm">
						<span className="text-gray-300 font-medium">Tipo de pago</span>
						<Select
							value={formInfo.type}
							onChange={(type) => setFormInfo({ ...formInfo, type })}
							items={[
								{ value: PayMethods.EFECTIVO, label: PayMethods.EFECTIVO },
								{ value: PayMethods.TRANSFERENCIA, label: PayMethods.TRANSFERENCIA },
							]}
						/>
					</label>

					<div className="flex flex-col gap-1.5 text-sm">
						<div className="flex items-center justify-between gap-2">
							<span className="text-gray-300 font-medium">Menú</span>
							<div className="flex items-center gap-2.5">
								{!isCustomMenu && formInfo.price !== '' && (
									<span className="text-xs font-semibold" style={{ color: 'var(--accent-hex)' }}>
										Precio: ${formInfo.price}
									</span>
								)}
								{isCustomMenu ? (
									menus.length > 0 && (
										<button
											type="button"
											onClick={() => toggleCustomMenu(false)}
											className="text-xs font-medium hover:underline cursor-pointer"
											style={{ color: 'var(--accent-hex)' }}
										>
											Elegir de la lista
										</button>
									)
								) : (
									<button
										type="button"
										onClick={() => toggleCustomMenu(true)}
										className="text-xs font-medium inline-flex items-center gap-1 hover:underline cursor-pointer"
										style={{ color: 'var(--accent-hex)' }}
									>
										<Plus className="w-3 h-3" />
										Nuevo menú
									</button>
								)}
							</div>
						</div>

						{!isCustomMenu ? (
							<Select
								value={formInfo.menu}
								onChange={selectMenu}
								items={menus}
								valueKey="menu"
								labelKey="menu"
								placeholder="Elegí un menú..."
							/>
						) : (
							<div className="flex flex-col gap-2">
								<div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
									<TextField.Root
										radius="large"
										className="sm:col-span-2 w-full"
										value={formInfo.menu}
										placeholder="Nombre del menú"
										onChange={(e) => setFormInfo({ ...formInfo, menu: e.target.value })}
									/>
									<TextField.Root
										radius="large"
										type="number"
										className="w-full"
										value={String(formInfo.price)}
										placeholder="Precio"
										onChange={(e) => setFormInfo({ ...formInfo, price: e.target.value })}
									>
										<TextField.Slot>
											<DollarSign className="w-3.5 h-3.5" />
										</TextField.Slot>
									</TextField.Root>
								</div>
								<span className="text-[11px] text-gray-400">
									Se agregará automáticamente a la sección Menús.
								</span>
							</div>
						)}
					</div>

					<label className="flex flex-col gap-1.5 text-sm">
						<span className="text-gray-300 font-medium">Aclaraciones</span>
						<TextField.Root
							radius="large"
							className="w-full"
							value={formInfo.description}
							placeholder="Opcional (ej. sin cebolla, con queso)"
							onChange={(e) => setFormInfo({ ...formInfo, description: e.target.value })}
						/>
					</label>

					<label className="flex items-center gap-2 text-sm cursor-pointer select-none pt-1">
						<Checkbox
							checked={formInfo.paid}
							onCheckedChange={(checked) => setFormInfo({ ...formInfo, paid: checked === true })}
						/>
						<span className="text-gray-200">Ya pagado</span>
					</label>
				</div>

				<div className="flex w-full justify-between items-center mt-5 pt-3 border-t border-white/10">
					{mode === 'edit' ? (
						<Popover
							trigger={
								<Button type="button" color="red" variant="soft">
									Eliminar
								</Button>
							}
							content={
								<span className="flex items-center flex-col gap-2 text-sm">
									¿Estás seguro de borrar este pedido?
									<RPopover.Close>
										<Button type="button" color="red" variant="solid" onClick={deleteRequest}>
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
						<Button type="button" variant="soft" color="gray" onClick={() => setOpen(false)}>
							Cancelar
						</Button>
						<Button
							type="button"
							disabled={!canSubmit}
							onClick={mode === 'edit' ? acceptEdition : addNewReq}
						>
							{mode === 'edit' ? 'Guardar cambios' : 'Crear pedido'}
						</Button>
					</div>
				</div>
			</Modal>
		</div>
	);
}

export default CardRequest;
