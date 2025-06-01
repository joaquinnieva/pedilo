import { Button, Dialog, TextField, Tooltip } from '@radix-ui/themes';
import { RefreshCcw } from 'lucide-react';
import { useState } from 'react';
import { MenuMessage, PreviewRequest, RequestModal } from '..';

export default function Navbar({ requests, getData, nameState }: any) {
	const [name, setName] = nameState;
	const [nameAux, setNameAux] = useState(name);
	const [opened, setOpened] = useState(!name);
	return (
		<nav className="w-full flex justify-between px-8 py-4 z-100">
			<div className="z-10 flex items-center gap-2 !text-base">
				<span className="">📦 Pedilo</span>
				<Dialog.Root onOpenChange={setOpened} open={opened}>
					<Dialog.Trigger>
						<Button variant="ghost" className="!p-0 ml-2">
							<TextField.Root
								placeholder="Ingresa tu nombre"
								radius="large"
								className={`w-full !bg-transparent !shadow-none !border-0 !text-base`}
								value={name}
							/>
						</Button>
					</Dialog.Trigger>

					<Dialog.Content className="rounded-lg p-4 bg-white shadow-lg">
						<Dialog.Title>Asigna un nombre para tus pedidos</Dialog.Title>
						<TextField.Root
							placeholder="Ingresa tu nombre"
							radius="large"
							className={`w-full`}
							value={nameAux}
							onChange={(e) => setNameAux(e.target.value)}
						/>

						<div className="w-full mt-2 flex justify-end">
							<Dialog.Close>
								<Button className="!px-2 " onClick={() => setName(nameAux)}>
									Listo
								</Button>
							</Dialog.Close>
						</div>
					</Dialog.Content>
				</Dialog.Root>
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
