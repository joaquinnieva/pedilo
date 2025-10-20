import { MenuContainers, Navbar, RequestContainer } from '@/components';
import { Spinner } from '@radix-ui/themes';
import { collection, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { db } from './firebase/config';
import { parseCustomDate } from './functions/DateUtils';
import { useLocalStorage } from './hooks/useStorage';

export default function App() {
	const [updating, setUpdating] = useState(0);
	const [name, setName] = useLocalStorage('name', '');
	const [lastWinner, setLastWinner] = useState('');

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

	const info = query(collection(db, 'info'));
	const [data] = useCollectionData(info, {
		initialValue: [],
		snapshotListenOptions: { includeMetadataChanges: true },
	});
	const winner = data?.[1];

	useEffect(() => {
		winner?.winner && setLastWinner(winner?.winner);
	}, [winner?.winner]);

	useEffect(() => {
		setUpdating((c) => c + 1);
	}, [name]);
	return (
		<div className="relative w-screen h-screen overflow-x-hidden">
			{lastWinner && (
				<div className="absolute top-2 z-100 right-1/2 p-2 rounded-md shadow-md">
					<p className="text-lg text-white">Ultimo sorteo: {lastWinner}</p>
				</div>
			)}

			<section className="w-screen bg-gray-800 z-10">
				<Navbar requests={requests} nameState={[name, setName]} />
				<main
					className="dark flex min-h-[calc(100vh-64px)] h-full flex-col w-screen items-center px-4 gap-2"
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
