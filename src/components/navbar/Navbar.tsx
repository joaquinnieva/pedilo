import { Button, Tooltip } from '@radix-ui/themes';
import { RefreshCcw } from 'lucide-react';
import { MenuMessage, PreviewRequest, RequestModal } from '..';

export default function Nav({ requests, getData }: any) {
	return (
		<nav className="w-full flex justify-between px-8 py-4">
			<span className="">📦 Pedilo!</span>
			<header className="hidden sm:flex gap-3 items-center">
				<RequestModal spinOptions={requests?.map((req: any) => ({ option: req.name }))} />

				<PreviewRequest requests={requests} />

				<Tooltip content="Actualizar info 🔄️">
					<Button color="purple" onClick={getData} variant="outline" className="!px-2">
						<RefreshCcw className="w-4 h-4" />
					</Button>
				</Tooltip>

				<MenuMessage />
			</header>
		</nav>
	);
}
