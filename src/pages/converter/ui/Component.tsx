import { Badge, Heading, Text } from '@/shared/ui/kit/components';
import { Icons } from '@/shared/ui/kit/icons';
import { noop, onLineAtom, wrap } from '@reatom/core';
import { reatomComponent } from '@reatom/react';
import { HStack, VStack } from 'styled-system/jsx';
import { ConversionForm } from './ConversionForm';
import { ConversionResult } from './ConversionResult';
import { currencySelectDialog } from './currency-select';
import { converterForm } from '../model/form';

export const Component = () => {
	return (
		<VStack
			padding='0.625rem'
			maxWidth='62.5rem'
			width='full'
			marginX='auto'
			gap='1.875rem'
			tabletDown={{
				padding: '1.5rem 1rem',
				marginTop: '1.5rem',
			}}
		>
			<VStack gap='0.625rem'>
				<Heading fontSize='2rem'>Currency converter</Heading>

				<Text color='neutral.500' fontSize='0.875rem'>
					Get real-time exchange rates
				</Text>
			</VStack>

			<HStack
				gap='1rem'
				tabletDown={{ flexDirection: 'column' }}
			>
				<OnlineBadge />
				<LastUpdatedBadge />
				<RefreshRatesBadgeButton />
			</HStack>

			<HStack
				alignItems='start'
				gap='1.875rem'
				width='full'
				tabletDown={{ flexDirection: 'column' }}
			>
				<ConversionForm />
				<ConversionResult />
			</HStack>

			<currencySelectDialog.Viewport />
		</VStack>
	);
};

const OnlineBadge = reatomComponent(() => {
	const online = onLineAtom();
	const Icon = online ? Icons.Online : Icons.Offline;

	return (
		<Badge colorPalette={online ? 'green' : 'red'}>
			<Icon />
			<Text>{online ? 'Online' : 'Offline'}</Text>
		</Badge>
	);
}, 'OnlineBadge');

const LastUpdatedBadge = reatomComponent(() => {
	return (
		<HStack color='neutral.500' fontSize='0.75rem' gap='0.375rem'>
			<Icons.Time boxSize='0.75rem' />

			<Text>
				Last updated: {new Date().toLocaleString()}
			</Text>
		</HStack>
	);
});

const RefreshRatesBadgeButton = reatomComponent(() => {
	const pending = converterForm.submit.pending() > 0;

	return (
		<Badge
			cursor='pointer'
			asChild
		>
			<button
				disabled={pending}
				onClick={wrap(() => converterForm.submit(true).catch(noop))}
			>
				<Icons.Refresh />
				<Text>Refresh rates</Text>
			</button>
		</Badge>
	);
});
