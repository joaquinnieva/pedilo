import { THEME_LIST } from '@/consts/Themes';
import { useAppTheme } from '@/context/ThemeContext';
import { Button, Popover } from '@radix-ui/themes';
import { Check, Palette } from 'lucide-react';

function ThemeSwitcher() {
	const { theme, themeId, setThemeId } = useAppTheme();

	return (
		<Popover.Root>
			<Popover.Trigger>
				<Button
					type="button"
					variant="soft"
					className="!px-2.5 gap-1.5"
					aria-label="Cambiar tema de colores"
					title={`Tema: ${theme.name}`}
				>
					<Palette className="w-4 h-4" />
					<span
						className="w-2.5 h-2.5 rounded-full border border-white/40"
						style={{
							background: `linear-gradient(135deg, ${theme.swatch}, ${theme.swatchSecondary})`,
						}}
					/>
				</Button>
			</Popover.Trigger>
			<Popover.Content align="end" className="w-60 !p-3">
				<div className="flex flex-col gap-2">
					<p className="text-xs font-semibold uppercase tracking-wider text-gray-400 px-1">
						Skin / Tema
					</p>
					<div className="flex flex-col gap-1">
						{THEME_LIST.map((item) => {
							const active = item.id === themeId;
							return (
								<Popover.Close key={item.id}>
									<button
										type="button"
										onClick={() => setThemeId(item.id)}
										className={`w-full flex items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-sm transition-colors cursor-pointer ${
											active
												? 'bg-white/12 text-white font-medium'
												: 'text-gray-300 hover:bg-white/6 hover:text-white'
										}`}
									>
										<span className="flex items-center gap-2.5">
											<span
												className="w-4 h-4 rounded-full border border-white/25 shrink-0"
												style={{
													background: `linear-gradient(135deg, ${item.swatch}, ${item.swatchSecondary})`,
												}}
											/>
											{item.name}
										</span>
										{active && <Check className="w-4 h-4 shrink-0" style={{ color: item.accentHex }} />}
									</button>
								</Popover.Close>
							);
						})}
					</div>
				</div>
			</Popover.Content>
		</Popover.Root>
	);
}

export default ThemeSwitcher;
