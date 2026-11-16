import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'sonner';
import App from './App.tsx';
import { AppThemeProvider } from './context/ThemeContext.tsx';
import '@radix-ui/themes/styles.css';
import './index.css';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<AppThemeProvider>
			<App />
			<Toaster position="bottom-right" richColors theme="dark" />
		</AppThemeProvider>
	</StrictMode>,
);
