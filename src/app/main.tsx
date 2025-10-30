import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import '@fontsource-variable/inter';
import { ConverterPage } from '@/pages/converter';

createRoot(document.body!).render(
	<StrictMode>
		<ConverterPage />
	</StrictMode>,
);
