import { Badge, Heading, Text } from '@/shared/ui/kit/components';
import { Icons } from '@/shared/ui/kit/icons';
import { noop, onLineAtom, wrap } from '@reatom/core';
import { reatomComponent } from '@reatom/react';
import { HStack, VStack } from 'styled-system/jsx';
import { ConversionForm } from './ConversionForm';
import { ConversionResult } from './ConversionResult';
import { currencySelectDialog } from './currency-select';
import { converterForm } from '../model/form';
import { conversionResult } from '../model/rates';

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
	const lastUpdatedAt = conversionResult.lastUpdatedAt();
	if (!lastUpdatedAt) return null;

	return (
		<HStack color='neutral.500' fontSize='0.75rem' gap='0.375rem'>
			<Icons.Time boxSize='0.75rem' />

			<Text>
				Last updated: {lastUpdatedAt.toLocaleString()}
			</Text>
		</HStack>
	);
}, 'LastUpdatedBadge');

const RefreshRatesBadgeButton = reatomComponent(() => {
	const { dirty } = converterForm.focus();
	const { errors } = converterForm.validation();
	const pending = converterForm.submit.pending() > 0;

	return (
		<Badge
			cursor='pointer'
			transition='100ms opacity'
			_disabled={{
				opacity: 0.5,
				cursor: 'not-allowed',
			}}
			_icon={{
				animation: pending ? 'spin' : 'none',
			}}
			asChild
		>
			<button
				disabled={pending || !dirty || errors.length > 0}
				onClick={wrap(() => converterForm.submit().catch(noop))}
			>
				<Icons.Refresh />
				<Text>Refresh rates</Text>
			</button>
		</Badge>
	);
}, 'RefreshRatesBadgeButton');
