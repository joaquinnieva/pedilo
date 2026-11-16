export type ThemeId = 'midnight' | 'amber' | 'emerald' | 'violet' | 'crimson' | 'cyan';

export type RadixAccentColor = 'indigo' | 'amber' | 'jade' | 'violet' | 'crimson' | 'cyan';
export type RadixGrayColor = 'slate' | 'sand' | 'sage' | 'mauve';

export interface AppTheme {
	id: ThemeId;
	name: string;
	accentColor: RadixAccentColor;
	grayColor: RadixGrayColor;
	swatch: string;
	swatchSecondary: string;
	bgBase: string;
	bgGlow1: string;
	bgGlow2: string;
	surfaceCard: string;
	surfaceCardHover: string;
	borderSubtle: string;
	accentHex: string;
	accentSoft: string;
	spotlight: string;
}

export const APP_THEMES: Record<ThemeId, AppTheme> = {
	midnight: {
		id: 'midnight',
		name: 'Índigo Nocturno',
		accentColor: 'indigo',
		grayColor: 'slate',
		swatch: '#6366f1',
		swatchSecondary: '#38bdf8',
		bgBase: '#0b1020',
		bgGlow1: 'rgba(99, 102, 241, 0.22)',
		bgGlow2: 'rgba(56, 189, 248, 0.14)',
		surfaceCard: 'rgba(20, 28, 48, 0.72)',
		surfaceCardHover: 'rgba(28, 39, 66, 0.88)',
		borderSubtle: 'rgba(129, 140, 248, 0.2)',
		accentHex: '#818cf8',
		accentSoft: 'rgba(129, 140, 248, 0.16)',
		spotlight: 'rgba(129, 140, 248, 0.22)',
	},
	amber: {
		id: 'amber',
		name: 'Ámbar & Fuego',
		accentColor: 'amber',
		grayColor: 'sand',
		swatch: '#f59e0b',
		swatchSecondary: '#fb7185',
		bgBase: '#14100b',
		bgGlow1: 'rgba(245, 158, 11, 0.20)',
		bgGlow2: 'rgba(234, 88, 12, 0.13)',
		surfaceCard: 'rgba(33, 25, 18, 0.74)',
		surfaceCardHover: 'rgba(46, 35, 25, 0.88)',
		borderSubtle: 'rgba(251, 191, 36, 0.2)',
		accentHex: '#fbbf24',
		accentSoft: 'rgba(251, 191, 36, 0.15)',
		spotlight: 'rgba(251, 191, 36, 0.22)',
	},
	emerald: {
		id: 'emerald',
		name: 'Esmeralda Cyber',
		accentColor: 'jade',
		grayColor: 'sage',
		swatch: '#10b981',
		swatchSecondary: '#2dd4bf',
		bgBase: '#081410',
		bgGlow1: 'rgba(16, 185, 129, 0.20)',
		bgGlow2: 'rgba(45, 212, 191, 0.13)',
		surfaceCard: 'rgba(14, 34, 28, 0.74)',
		surfaceCardHover: 'rgba(20, 47, 39, 0.88)',
		borderSubtle: 'rgba(52, 211, 153, 0.2)',
		accentHex: '#34d399',
		accentSoft: 'rgba(52, 211, 153, 0.15)',
		spotlight: 'rgba(52, 211, 153, 0.22)',
	},
	violet: {
		id: 'violet',
		name: 'Neón Violeta',
		accentColor: 'violet',
		grayColor: 'mauve',
		swatch: '#a855f7',
		swatchSecondary: '#ec4899',
		bgBase: '#110c1c',
		bgGlow1: 'rgba(168, 85, 247, 0.22)',
		bgGlow2: 'rgba(236, 72, 153, 0.14)',
		surfaceCard: 'rgba(29, 21, 45, 0.74)',
		surfaceCardHover: 'rgba(40, 29, 62, 0.88)',
		borderSubtle: 'rgba(192, 132, 252, 0.22)',
		accentHex: '#c084fc',
		accentSoft: 'rgba(192, 132, 252, 0.16)',
		spotlight: 'rgba(192, 132, 252, 0.24)',
	},
	crimson: {
		id: 'crimson',
		name: 'Cereza Nocturna',
		accentColor: 'crimson',
		grayColor: 'mauve',
		swatch: '#f43f5e',
		swatchSecondary: '#fb923c',
		bgBase: '#160a10',
		bgGlow1: 'rgba(244, 63, 94, 0.20)',
		bgGlow2: 'rgba(251, 146, 60, 0.12)',
		surfaceCard: 'rgba(37, 18, 27, 0.74)',
		surfaceCardHover: 'rgba(51, 25, 37, 0.88)',
		borderSubtle: 'rgba(251, 113, 133, 0.2)',
		accentHex: '#fb7185',
		accentSoft: 'rgba(251, 113, 133, 0.15)',
		spotlight: 'rgba(251, 113, 133, 0.22)',
	},
	cyan: {
		id: 'cyan',
		name: 'Ártico Tech',
		accentColor: 'cyan',
		grayColor: 'slate',
		swatch: '#06b6d4',
		swatchSecondary: '#60a5fa',
		bgBase: '#07131a',
		bgGlow1: 'rgba(6, 182, 212, 0.21)',
		bgGlow2: 'rgba(59, 130, 246, 0.13)',
		surfaceCard: 'rgba(14, 32, 43, 0.74)',
		surfaceCardHover: 'rgba(20, 44, 59, 0.88)',
		borderSubtle: 'rgba(34, 211, 238, 0.2)',
		accentHex: '#22d3ee',
		accentSoft: 'rgba(34, 211, 238, 0.15)',
		spotlight: 'rgba(34, 211, 238, 0.22)',
	},
};

export const THEME_LIST = Object.values(APP_THEMES);
