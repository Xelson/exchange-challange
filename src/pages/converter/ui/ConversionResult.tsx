import { DividerStack, Heading, Text } from '@/shared/ui/kit/components';
import { reatomComponent } from '@reatom/react';
import { Center, HStack, VStack } from 'styled-system/jsx';

export const ConversionResult = () => {
	return (
		<VStack
			alignItems='start'
			padding='1.25rem'
			width='full'
			rounded='1rem'
			border='default'
			gap='1.5rem'
			maxWidth='21rem'
			tabletDown={{ maxWidth: 'full' }}
		>
			<Heading as='h3' fontSize='1.125rem'>
				Conversion result
			</Heading>

			<DividerStack alignItems='start' gap='inherit' width='full'>
				<RateIndicator />
				<ExchangeRateDetails />

				<Center
					backgroundColor='neutral.50'
					padding='0.5rem 0.75rem'
					textAlign='center'
					color='neutral.500'
					borderRadius='0.75rem'
					fontSize='0.75rem'
				>
					Rates are for informational purposes only and may not reflect real-time market rates
				</Center>
			</DividerStack>
		</VStack>
	);
};

export const RateIndicator = reatomComponent(() => {
	return (
		<VStack gap='0.25rem' width='full'>
			<Heading fontSize='1.5rem' fontWeight='700'>€0.92</Heading>
			<Text color='neutral.500' fontSize='0.75rem'>1 USD =</Text>
		</VStack>
	);
}, 'ConversionResult.RateIndicator');

export const ExchangeRateDetails = reatomComponent(() => {
	return (
		<VStack alignItems='start' gap='0.75rem' width='full'>
			<HStack gap='1rem' width='full' justifyContent='space-between'>
				<Text color='neutral.500' fontSize='0.75rem'>
					Exchange Rate
				</Text>

				<Text fontSize='0.75rem' fontWeight='600'>
					1 USD = 0.920000 EUR
				</Text>
			</HStack>

			<HStack gap='1rem' width='full' justifyContent='space-between'>
				<Text color='neutral.500' fontSize='0.75rem'>
					Inverse Rate
				</Text>

				<Text fontSize='0.75rem' fontWeight='600'>
					1 EUR = 1.086957 USD
				</Text>
			</HStack>
		</VStack>
	);
}, 'ConversionResult.ExchangeRateDetails');
