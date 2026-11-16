import type { OrderRequest } from '@/types';
import { Button, Dialog, TextField, Tooltip } from '@radix-ui/themes';
import { Pencil, RefreshCcw, User, X } from 'lucide-react';
import { type FormEvent, useState } from 'react';
import { MenuMessage, PreviewRequest, RequestModal, ShinyText, ThemeSwitcher } from '..';

interface NavbarProps {
	requests: OrderRequest[];
	onRefresh: () => void;
	onWinner?: (winnerName: string) => void;
	wheelLocked?: boolean;
	winnerName?: string;
	nameState: [string, (value: string) => void];
}

export default function Navbar({
	requests,
	onRefresh,
	onWinner,
	wheelLocked = false,
	winnerName = '',
	nameState,
}: NavbarProps) {
	const [name, setName] = nameState;
	const [nameAux, setNameAux] = useState(name);
	const [opened, setOpened] = useState(!name);

	const handleOpenChange = (nextOpen: boolean) => {
		if (nextOpen) {
			setNameAux(name);
		}
		setOpened(nextOpen);
	};

	const handleSaveName = (e?: FormEvent) => {
		e?.preventDefault();
		setName(nameAux.trim());
		setOpened(false);
	};

	const initials = name
		? name
				.trim()
				.split(/\s+/)
				.slice(0, 2)
				.map((part) => part[0]?.toUpperCase() ?? '')
				.join('')
		: '';

	return (
		<nav className="sticky top-0 z-30 w-full backdrop-blur-md bg-black/25 border-b border-white/10">
			<div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-3 px-4 sm:px-6 py-3">
				<div className="flex items-center gap-3 text-base">
					<div className="flex items-center gap-2">
						<span className="text-xl" aria-hidden="true">
							📦
						</span>
						<ShinyText text="Pedilo" speed={5} className="font-bold text-lg tracking-tight" />
					</div>

					<span className="text-white/15 hidden sm:inline">|</span>

					<Dialog.Root onOpenChange={handleOpenChange} open={opened}>
						<Dialog.Trigger>
							<button
								type="button"
								className="flex items-center gap-2 rounded-full pl-1.5 pr-3 py-1 text-sm bg-white/[0.05] hover:bg-white/10 border border-white/10 cursor-pointer transition-all"
							>
								<span
									className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold shrink-0"
									style={{
										backgroundColor: 'var(--accent-soft)',
										color: 'var(--accent-hex)',
									}}
								>
									{initials || <User className="w-3.5 h-3.5" />}
								</span>
								<span className={name ? 'text-white font-medium' : 'text-gray-400'}>
									{name || 'Ingresa tu nombre'}
								</span>
								<Pencil className="w-3 h-3 text-gray-400" aria-hidden="true" />
							</button>
						</Dialog.Trigger>

						<Dialog.Content
							className="rounded-xl !p-5 sm:!p-6 shadow-2xl w-[calc(100vw-2rem)] relative"
							maxWidth="420px"
						>
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
									<User className="w-4 h-4" />
								</div>
								<div>
									<Dialog.Title className="!mb-0 !text-lg">¿Cómo te llamás?</Dialog.Title>
									<p className="text-xs text-gray-400 mt-0.5">
										Se usará para identificar y editar tus pedidos.
									</p>
								</div>
							</div>

							<form onSubmit={handleSaveName} className="flex flex-col gap-3">
								<TextField.Root
									placeholder="Ej. Nico"
									radius="large"
									size="3"
									className="w-full"
									value={nameAux}
									onChange={(e) => setNameAux(e.target.value)}
									autoFocus
								/>

								<div className="w-full flex justify-end gap-2 mt-1">
									<Button type="submit" size="2" disabled={!nameAux.trim()}>
										Guardar nombre
									</Button>
								</div>
							</form>
						</Dialog.Content>
					</Dialog.Root>
				</div>

				<header className="flex flex-wrap gap-2 items-center">
					<RequestModal
						spinOptions={requests?.map((req) => req.name).filter(Boolean)}
						onWinner={onWinner}
						wheelLocked={wheelLocked}
						winnerName={winnerName}
					/>

					<PreviewRequest requests={requests} />

					<Tooltip content="Actualizar info 🔄️">
						<Button
							type="button"
							onClick={onRefresh}
							variant="soft"
							className="!px-2.5"
							aria-label="Actualizar información"
						>
							<RefreshCcw className="w-4 h-4" />
						</Button>
					</Tooltip>

					<ThemeSwitcher />

					<MenuMessage />
				</header>
			</div>
		</nav>
	);
}
