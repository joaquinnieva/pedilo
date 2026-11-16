import { db } from '@/firebase/config';
import { getMenus } from '@/firebase/service';
import type { MenuItem } from '@/types';
import { Button } from '@radix-ui/themes';
import { addDoc, collection, deleteDoc, doc } from 'firebase/firestore';
import { AlertTriangle, Trash2, UtensilsCrossed } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { CardMenu, Modal, Separator } from '..';

function MenuContainers({ state }: { state: [MenuItem[]] }) {
	const [menus] = state;
	const [confirmOpen, setConfirmOpen] = useState(false);

	const addMenu = async (newMenu: Omit<MenuItem, 'id'>) => {
		const menusRef = collection(db, 'menu');
		await toast.promise(addDoc(menusRef, newMenu), {
			loading: 'Agregando...',
			success: 'Menú agregado correctamente!',
			error: 'No se pudo agregar.',
		});
	};

	const deleteMenu = (id: string) => {
		if (!id) return;
		const menuDoc = doc(db, 'menu', id);
		toast.promise(deleteDoc(menuDoc), {
			loading: 'Eliminando...',
			success: 'Eliminado correctamente!',
			error: 'No se pudo eliminar.',
		});
	};

	const deleteAllMenus = async () => {
		setConfirmOpen(false);
		const currentMenus = await getMenus();
		const deleteAllByIds = () =>
			Promise.all(currentMenus.map(({ id }) => deleteDoc(doc(db, 'menu', id))));

		toast.promise(deleteAllByIds(), {
			loading: 'Eliminando menús...',
			success: 'Menús eliminados correctamente!',
			error: 'No se pudieron eliminar los menús.',
		});
	};

	return (
		<section className="w-full">
			<Separator>
				<div className="flex flex-wrap w-full justify-between items-center gap-2">
					<div className="flex gap-2 items-center">
						<UtensilsCrossed className="w-4 h-4 opacity-80" />
						<span>Menús</span>
						<span className="text-xs font-medium px-2 py-0.5 rounded-full bg-white/10 text-gray-300">
							{menus?.length ?? 0}
						</span>
					</div>

					<Button
						type="button"
						color="red"
						variant="soft"
						size="2"
						className="gap-1.5"
						disabled={!menus || menus.length === 0}
						onClick={() => setConfirmOpen(true)}
					>
						<Trash2 className="w-3.5 h-3.5" />
						Resetear
					</Button>
				</div>
			</Separator>

			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 w-full mt-2">
				{menus?.map((info, i) => (
					<CardMenu key={info.id} info={info} index={i} deleteMenu={deleteMenu} />
				))}
				<CardMenu isNew index={menus?.length ?? 0} addMenu={addMenu} />
			</div>

			<Modal
				open={confirmOpen}
				onOpenChange={setConfirmOpen}
				title="Resetear menús"
				subtitle="Esta acción eliminará todos los menús cargados"
				icon={<AlertTriangle className="w-4 h-4" />}
				maxWidth="420px"
			>
				<p className="text-sm text-gray-300 leading-relaxed">
					¿Estás seguro de que querés eliminar{' '}
					<span className="font-semibold text-white">
						{menus?.length ?? 0} {menus?.length === 1 ? 'menú' : 'menús'}
					</span>
					? Esta acción no se puede deshacer.
				</p>

				<div className="flex justify-end gap-2 mt-5 pt-3 border-t border-white/10">
					<Button type="button" variant="soft" color="gray" onClick={() => setConfirmOpen(false)}>
						Cancelar
					</Button>
					<Button type="button" color="red" variant="solid" onClick={deleteAllMenus}>
						Confirmar borrado
					</Button>
				</div>
			</Modal>
		</section>
	);
}

export default MenuContainers;
