import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
// @ts-expect-error idk
import '@fontsource-variable/inter';
import { ConverterPage } from '@/pages/converter';

if (import.meta.env.DEV) {
	const { connectLogger } = await import('@reatom/core');
	connectLogger();
}

createRoot(document.body!).render(
	<StrictMode>
		<ConverterPage />
	</StrictMode>,
);
