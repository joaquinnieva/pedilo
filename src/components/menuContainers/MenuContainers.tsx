import { db } from '@/firebase/config';
import { getMenus } from '@/firebase/service';
import { addDoc, collection, deleteDoc, doc } from 'firebase/firestore';
import { toast } from 'sonner';
import { CardMenu, Separator } from '..';

function MenuContainers({ state }: any) {
	const [menus] = state;

	const addMenu = (newMenu: any) => {
		const menus = collection(db, 'menu');
		toast.promise(addDoc(menus, newMenu), {
			loading: 'Agregando...',
			success: 'Menu agregado correctamente!',
			error: 'No se pudo agregar.',
		});
	};

	const deleteMenu = async (menuValue: any) => {
		const menuRes = await getMenus();
		const id = menuRes.find(
			(menu: any) => menu.price === menuValue.price && menu.menu === menuValue.menu,
		)?.id;
		const menu = doc(db, 'menu', id as string);
		toast.promise(deleteDoc(menu), {
			loading: 'Eliminando...',
			success: 'Eliminado correctamente!',
			error: 'No se pudo eliminar.',
		});
	};

	return (
		<div className="w-full">
			<Separator>
				<div className="py-1">
					<div className="flex gap-1 items-center">
						Menus <p className="font-normal text-xs">({menus?.length})</p>
					</div>
				</div>
			</Separator>
			<div className="flex flex-wrap w-full">
				{menus?.map((info: any, i: number) => (
					<CardMenu key={i} info={info} deleteMenu={deleteMenu} />
				))}
				<CardMenu isNew addMenu={addMenu} />
			</div>
		</div>
	);
}

export default MenuContainers;
