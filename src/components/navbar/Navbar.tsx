import { Button, TextField, Tooltip } from '@radix-ui/themes';
import { RefreshCcw } from 'lucide-react';
import { MenuMessage, PreviewRequest, RequestModal } from '..';
import { useLocalStorage } from '@/hooks/useStorage';

export default function Navbar({ requests, getData, nameState }: any) {
	const [name, setName] = nameState;
	return (
		<nav className="w-full flex justify-between px-8 py-4 z-100">
			<span className="z-10">📦 Pedilo!</span>
			<div>
				<TextField.Root
					placeholder="Ingresa tu nombre"
					radius="large"
					className={`w-full`}
					value={name}
					onChange={(e) => setName(e.target.value)}
				/>
			</div>
			<header className="hidden sm:flex gap-3 items-center z-10">
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
