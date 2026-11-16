import { APP_THEMES, type AppTheme, type ThemeId } from '@/consts/Themes';
import { useLocalStorage } from '@/hooks/useStorage';
import { Theme } from '@radix-ui/themes';
import { type ReactNode, createContext, useContext, useEffect } from 'react';

interface ThemeContextValue {
	theme: AppTheme;
	themeId: ThemeId;
	setThemeId: (id: ThemeId) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function AppThemeProvider({ children }: { children: ReactNode }) {
	const [storedId, setStoredId] = useLocalStorage<ThemeId>('pedilo-theme', 'midnight');
	const themeId: ThemeId = storedId in APP_THEMES ? storedId : 'midnight';
	const theme = APP_THEMES[themeId];

	useEffect(() => {
		const root = document.documentElement;
		root.style.setProperty('--bg-base', theme.bgBase);
		root.style.setProperty('--bg-glow-1', theme.bgGlow1);
		root.style.setProperty('--bg-glow-2', theme.bgGlow2);
		root.style.setProperty('--surface-card', theme.surfaceCard);
		root.style.setProperty('--surface-card-hover', theme.surfaceCardHover);
		root.style.setProperty('--border-subtle', theme.borderSubtle);
		root.style.setProperty('--accent-hex', theme.accentHex);
		root.style.setProperty('--accent-soft', theme.accentSoft);
		root.style.setProperty('--spotlight', theme.spotlight);
	}, [theme]);

	return (
		<ThemeContext.Provider value={{ theme, themeId, setThemeId: setStoredId }}>
			<Theme
				appearance="dark"
				accentColor={theme.accentColor}
				grayColor={theme.grayColor}
				radius="large"
				panelBackground="translucent"
			>
				{children}
			</Theme>
		</ThemeContext.Provider>
	);
}

export function useAppTheme() {
	const ctx = useContext(ThemeContext);
	if (!ctx) {
		throw new Error('useAppTheme must be used inside AppThemeProvider');
	}
	return ctx;
}
