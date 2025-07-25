import { MenuContainers, Navbar, RequestContainer } from '@/components';
import { Spinner } from '@radix-ui/themes';
import { collection, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import Aurora from './components/bgAurora/BgAurora';
import { db } from './firebase/config';
import { parseCustomDate } from './functions/DateUtils';
import { useLocalStorage } from './hooks/useStorage';

export default function App() {
	const [updating, setUpdating] = useState(0);
	const [name, setName] = useLocalStorage('name', '');

	const menusQuery = query(collection(db, 'menu'));
	const [menu, loadMenus] = useCollectionData(menusQuery, {
		initialValue: [],
		snapshotListenOptions: { includeMetadataChanges: true },
	});
	const menus = menu?.sort((a: any, b: any) => {
		const dateA = a?.date ? parseCustomDate(a.date) : new Date();
		const dateB = b?.date ? parseCustomDate(b.date) : new Date();
		return dateA.getTime() - dateB.getTime();
	});

	const reqsQuery = query(collection(db, 'requests'));
	const [reqs, loadReq] = useCollectionData(reqsQuery, {
		initialValue: [],
		snapshotListenOptions: { includeMetadataChanges: true },
	});
	const requests = reqs?.sort((a: any, b: any) => {
		const dateA = parseCustomDate(a.date);
		const dateB = parseCustomDate(b.date);
		return dateA.getTime() - dateB.getTime();
	});

	useEffect(() => {
		setUpdating((c) => c + 1);
	}, [name]);
	return (
		<div className="relative w-screen h-screen overflow-x-hidden">
			<div className="app-bg w-screen h-screen fixed -z-1"></div>
			<Aurora />

			<section className="w-screen  z-10">
				<Navbar requests={requests} nameState={[name, setName]} />
				<main
					className="dark flex min-h-[calc(100vh-64px)] flex-col w-screen items-center px-4"
					key={updating}
				>
					<MenuContainers state={[menus]} />
					<RequestContainer state={[requests]} menus={menus} />
				</main>

				{(loadMenus || loadReq) && (
					<div className="h-screen w-screen grid fixed z-10 top-0 left-0 place-content-center bg-gray-900/10 backdrop-blur-sm">
						<span className="flex items-center gap-2">
							<Spinner /> Actualizando información
						</span>
					</div>
				)}
			</section>
		</div>
	);
}
