import { Badge, Heading, Text } from '@/shared/ui/kit/components';
import { Icons } from '@/shared/ui/kit/icons';
import { onLineAtom } from '@reatom/core';
import { reatomComponent } from '@reatom/react';
import { Container, HStack, VStack } from 'styled-system/jsx';
import { ConversionForm } from './ConversionForm';

export const Component = () => {
	return (
		<Container
			display='flex'
			flexDirection='column'
			alignItems='center'
			padding='0.625rem'
			maxWidth='62.5rem'
			width='full'
			gap='1.875rem'
		>
			<VStack gap='0.625rem'>
				<Heading fontSize='2rem'>Currency converter</Heading>

				<Text color='neutral.500' fontSize='0.875rem'>
					Get real-time exchange rates
				</Text>
			</VStack>

			<HStack gap='1rem'>
				<OnlineBadge />
				<LastUpdatedBadge />
				<RefreshRatesBadgeButton />
			</HStack>

			<HStack gap='1.875rem' width='full'>
				<ConversionForm />
			</HStack>
		</Container>
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
	return (
		<Badge as='button' cursor='pointer'>
			<Icons.Refresh />
			<Text>Refresh rates</Text>
		</Badge>
	);
});
