import { db } from '@/firebase/config';
import { getRequests } from '@/firebase/service';
import type { MenuItem, OrderRequest } from '@/types';
import { Button } from '@radix-ui/themes';
import { addDoc, collection, deleteDoc, doc } from 'firebase/firestore';
import { AlertTriangle, ShoppingBag, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { CardRequest, Modal, Separator } from '..';

function RequestContainer({
	state,
	menus,
	userName,
	winnerName = '',
	onRequestAdded,
	onResetWinner,
}: {
	state: [OrderRequest[]];
	menus: MenuItem[];
	userName: string;
	winnerName?: string;
	onRequestAdded?: () => void;
	onResetWinner?: () => void;
}) {
	const [requests] = state;
	const [confirmOpen, setConfirmOpen] = useState(false);

	const totalAmount = (requests ?? []).reduce((sum, item) => sum + (Number(item.price) || 0), 0);
	const paidCount = (requests ?? []).filter((item) => item.paid).length;

	const addReq = async (req: Omit<OrderRequest, 'id'>) => {
		const reqs = collection(db, 'requests');
		await toast.promise(addDoc(reqs, req), {
			loading: 'Agregando...',
			success: 'Pedido agregado correctamente',
			error: 'No se pudo agregar.',
		});
		onRequestAdded?.();
		const prevReqs = localStorage.getItem('prevReqs')
			? JSON.parse(localStorage.getItem('prevReqs') || '{"value":[]}')
			: { value: [] };
		localStorage.setItem(
			'prevReqs',
			JSON.stringify({ value: [...(prevReqs.value ?? []), req.name] }),
		);
	};

	const deleteReq = async (id: string) => {
		if (!id) return;
		const reqDoc = doc(db, 'requests', id);
		await toast.promise(deleteDoc(reqDoc), {
			loading: 'Eliminando...',
			success: 'Eliminado correctamente',
			error: 'No se pudo eliminar.',
		});
	};

	const deleteAllReq = async () => {
		setConfirmOpen(false);
		onResetWinner?.();
		const reqs = await getRequests();
		const deleteAllByIds = () =>
			Promise.all(reqs.map(({ id }) => deleteDoc(doc(db, 'requests', id))));

		toast.promise(deleteAllByIds(), {
			loading: 'Eliminando pedidos...',
			success: 'Pedidos eliminados correctamente!',
			error: 'No se pudieron eliminar los pedidos.',
		});
	};

	return (
		<section className="w-full pb-6">
			<Separator>
				<div className="flex flex-wrap w-full justify-between items-center gap-2">
					<div className="flex flex-wrap gap-2 items-center">
						<ShoppingBag className="w-4 h-4 opacity-80" />
						<span>Pedidos</span>
						<span className="text-xs font-medium px-2 py-0.5 rounded-full bg-white/10 text-gray-300">
							{requests?.length ?? 0}
						</span>
						{totalAmount > 0 && (
							<span
								className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
								style={{
									backgroundColor: 'var(--accent-soft)',
									color: 'var(--accent-hex)',
								}}
							>
								Subtotal: ${totalAmount}
							</span>
						)}
						{requests && requests.length > 0 && (
							<span
								className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
									paidCount === requests.length
										? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300'
										: 'bg-white/[0.06] border-white/10 text-gray-300'
								}`}
							>
								Pagados: {paidCount}/{requests.length}
							</span>
						)}
					</div>
					<Button
						type="button"
						color="red"
						variant="soft"
						size="2"
						className="gap-1.5"
						disabled={!requests || requests.length === 0}
						onClick={() => setConfirmOpen(true)}
					>
						<Trash2 className="w-3.5 h-3.5" />
						Resetear
					</Button>
				</div>
			</Separator>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 w-full mt-2">
				{requests?.map((info, i) => (
					<CardRequest
						key={info.id}
						info={info}
						index={i}
						menus={menus}
						userName={userName}
						winnerName={winnerName}
						deleteReq={deleteReq}
						addReq={addReq}
					/>
				))}
				<CardRequest
					isNew
					index={requests?.length ?? 0}
					addReq={addReq}
					menus={menus}
					userName={userName}
				/>
			</div>

			<Modal
				open={confirmOpen}
				onOpenChange={setConfirmOpen}
				title="Resetear pedidos"
				subtitle="Esta acción eliminará todos los pedidos actuales"
				icon={<AlertTriangle className="w-4 h-4" />}
				maxWidth="420px"
			>
				<p className="text-sm text-gray-300 leading-relaxed">
					¿Estás seguro de que querés eliminar{' '}
					<span className="font-semibold text-white">
						{requests?.length ?? 0} {requests?.length === 1 ? 'pedido' : 'pedidos'}
					</span>
					? Esta acción no se puede deshacer.
				</p>

				<div className="flex justify-end gap-2 mt-5 pt-3 border-t border-white/10">
					<Button type="button" variant="soft" color="gray" onClick={() => setConfirmOpen(false)}>
						Cancelar
					</Button>
					<Button type="button" color="red" variant="solid" onClick={deleteAllReq}>
						Confirmar borrado
					</Button>
				</div>
			</Modal>
		</section>
	);
}

export default RequestContainer;
