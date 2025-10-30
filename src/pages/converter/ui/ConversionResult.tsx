import { DividerStack, Heading, Text } from '@/shared/ui/kit/components';
import { reatomComponent } from '@reatom/react';
import { Center, HStack, VStack } from 'styled-system/jsx';
import { conversionResult, converterForm, dataAtom } from '../model/form';

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
	const rate = conversionResult();
	const from = converterForm.fields.from();
	const to = converterForm.fields.to();
	const amount = converterForm.fields.amount();

	return (
		<VStack gap='0.25rem' width='full'>
			<Heading fontSize='1.5rem' fontWeight='700'>
				{rate?.toFixed(2)} {to.symbol}
			</Heading>
			<Text color='neutral.500' fontSize='0.75rem'>
				{amount} {from.code} =
			</Text>
		</VStack>
	);
}, 'ConversionResult.RateIndicator');

export const ExchangeRateDetails = reatomComponent(() => {
	const from = converterForm.fields.from();
	const to = converterForm.fields.to();

	return (
		<VStack alignItems='start' gap='0.75rem' width='full'>
			<HStack gap='1rem' width='full' justifyContent='space-between'>
				<Text color='neutral.500' fontSize='0.75rem'>
					Exchange Rate
				</Text>

				<Text fontSize='0.75rem' fontWeight='600'>
					1 {from.code} = {dataAtom()?.rate?.toFixed(2)} {to.code}
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
