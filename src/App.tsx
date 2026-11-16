import {
	BroadcastBanner,
	FoodBackground,
	MenuContainers,
	Navbar,
	PreviewRequest,
	RequestContainer,
	WinnerModal,
} from '@/components';
import { Spinner } from '@radix-ui/themes';
import { doc, query, setDoc } from 'firebase/firestore';
import { useEffect, useMemo, useState } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { toast } from 'sonner';
import { db } from './firebase/config';
import {
	getMenus,
	getRequests,
	infoCollection,
	menusCollection,
	requestsCollection,
} from './firebase/service';
import { parseCustomDate } from './functions/DateUtils';
import { useLocalStorage } from './hooks/useStorage';

export default function App() {
	const [name, setName] = useLocalStorage('name', '');
	const [winnerName, setWinnerName] = useState('');
	const [winnerDrawId, setWinnerDrawId] = useState('');
	const [wheelLocked, setWheelLocked] = useState(false);
	const [previewOpen, setPreviewOpen] = useState(false);

	const menusQuery = useMemo(() => query(menusCollection), []);
	const [menu, loadMenus] = useCollectionData(menusQuery, {
		initialValue: [],
		snapshotListenOptions: { includeMetadataChanges: true },
	});
	const menus = useMemo(
		() =>
			[...(menu ?? [])].sort((a, b) => {
				const dateA = parseCustomDate(a?.date);
				const dateB = parseCustomDate(b?.date);
				return dateA.getTime() - dateB.getTime();
			}),
		[menu],
	);

	const reqsQuery = useMemo(() => query(requestsCollection), []);
	const [reqs, loadReq] = useCollectionData(reqsQuery, {
		initialValue: [],
		snapshotListenOptions: { includeMetadataChanges: true },
	});
	const requests = useMemo(
		() =>
			[...(reqs ?? [])].sort((a, b) => {
				const dateA = parseCustomDate(a?.date);
				const dateB = parseCustomDate(b?.date);
				return dateA.getTime() - dateB.getTime();
			}),
		[reqs],
	);

	const infoQuery = useMemo(() => query(infoCollection), []);
	const [infoDocs] = useCollectionData(infoQuery, {
		initialValue: [],
	});

	useEffect(() => {
		const infoDoc = infoDocs?.[0];
		if (!infoDoc) return;
		if (typeof infoDoc.winner === 'string') {
			setWinnerName(infoDoc.winner);
		}
		if (typeof infoDoc.winnerDrawId === 'string') {
			setWinnerDrawId(infoDoc.winnerDrawId);
		}
		if (typeof infoDoc.wheelLocked === 'boolean') {
			setWheelLocked(infoDoc.wheelLocked);
		}
	}, [infoDocs]);

	const handleWinnerSelected = (winner: string) => {
		const drawId = String(Date.now());
		setWinnerName(winner);
		setWinnerDrawId(drawId);
		setWheelLocked(true);
		setDoc(
			doc(db, 'info', 'info'),
			{ winner, winnerDrawId: drawId, wheelLocked: true },
			{ merge: true },
		).catch(() => {});
	};

	const handleUnlockWheel = () => {
		setWheelLocked(false);
		setDoc(doc(db, 'info', 'info'), { wheelLocked: false }, { merge: true }).catch(() => {});
	};

	const handleResetWinner = () => {
		setWinnerName('');
		setWinnerDrawId('');
		setWheelLocked(false);
		setDoc(
			doc(db, 'info', 'info'),
			{ winner: '', winnerDrawId: '', wheelLocked: false },
			{ merge: true },
		).catch(() => {});
	};

	const handleRefresh = () => {
		toast.promise(Promise.all([getMenus(), getRequests()]), {
			loading: 'Actualizando...',
			success: 'Información actualizada!',
			error: 'No se pudo actualizar.',
		});
	};

	return (
		<div className="relative min-h-screen w-full overflow-x-hidden app-mesh-bg">
			<FoodBackground />
			<section className="relative z-10 w-full min-h-screen flex flex-col">
				<Navbar
					requests={requests}
					onRefresh={handleRefresh}
					onWinner={handleWinnerSelected}
					wheelLocked={wheelLocked}
					winnerName={winnerName}
					nameState={[name, setName]}
				/>
				<main className="flex flex-1 flex-col w-full max-w-7xl mx-auto items-center px-4 sm:px-6 pt-3 pb-10 gap-5">
					<BroadcastBanner info={infoDocs?.[0]} />
					<MenuContainers state={[menus]} />
					<RequestContainer
						state={[requests]}
						menus={menus}
						userName={name}
						winnerName={winnerName}
						onRequestAdded={handleUnlockWheel}
						onResetWinner={handleResetWinner}
					/>
				</main>

				<WinnerModal
					winnerName={winnerName}
					winnerDrawId={winnerDrawId}
					userName={name}
					onOpenPedilo={() => setPreviewOpen(true)}
				/>

				<PreviewRequest
					requests={requests}
					open={previewOpen}
					onOpenChange={setPreviewOpen}
					showTrigger={false}
				/>

				{(loadMenus || loadReq) && (
					<div className="h-screen w-screen grid fixed z-40 top-0 left-0 place-content-center bg-black/40 backdrop-blur-sm">
						<span className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-white/10 border border-white/15 text-sm">
							<Spinner /> Actualizando información
						</span>
					</div>
				)}
			</section>
		</div>
	);
}
