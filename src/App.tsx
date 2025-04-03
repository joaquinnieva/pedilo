import { MenuContainers, Navbar, RequestContainer } from '@/components';
import { Spinner } from '@radix-ui/themes';
import { collection, query } from 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { db } from './firebase/config';
import { parseCustomDate } from './functions/DateUtils';

export default function App() {
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

	return (
		<section className="w-full app-bg">
			<Navbar requests={requests} />
			<main className="dark flex min-h-[calc(100vh-64px)] flex-col w-full items-center px-4">
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
	);
}
