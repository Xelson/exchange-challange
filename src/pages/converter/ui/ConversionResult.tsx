import { DividerStack, Heading, Skeleton, Text } from '@/shared/ui/kit/components';
import { reatomComponent } from '@reatom/react';
import { Center, HStack, VStack } from 'styled-system/jsx';
import { converterForm } from '../model/form';
import { conversionResult, rateResource } from '../model/rates';
import { usingRatesCache } from '../model/rates-cache';
import { getCurrencyByCode } from '../model/currency';

export const ConversionResult = reatomComponent(() => {
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

				<>
					<UsingCacheStatus />
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
				</>
			</DividerStack>
		</VStack>
	);
}, 'ConversionResult');

export const RateIndicator = reatomComponent(() => {
	const { from, to } = conversionResult() ?? {};
	const rate = conversionResult.fromAmount();
	const amount = converterForm.fields.amount();

	return (
		<Skeleton loading={rateResource.pending() > 0} mx='auto'>
			<VStack gap='0.25rem' width='full' visibility={rate ? 'visible' : 'hidden'}>
				<Heading fontSize='1.5rem' fontWeight='700'>
					{rate?.toFixed(2)} {to && getCurrencyByCode(to)?.symbol}
				</Heading>
				<Text color='neutral.500' fontSize='0.75rem'>
					{amount} {from} =
				</Text>
			</VStack>
		</Skeleton>
	);
}, 'ConversionResult.RateIndicator');

export const ExchangeRateDetails = reatomComponent(() => {
	const pending = rateResource.pending() > 0;
	const { from, to, rate, inverseRate } = conversionResult() ?? {};

	const fromCode = from && getCurrencyByCode(from)?.code;
	const toCode = to && getCurrencyByCode(to)?.code;

	return (
		<VStack alignItems='start' gap='0.75rem' width='full'>
			<HStack gap='1rem' width='full' justifyContent='space-between'>
				<Text color='neutral.500' fontSize='0.75rem'>
					Exchange Rate
				</Text>

				<Skeleton loading={pending}>
					<Text fontSize='0.75rem' fontWeight='600' visibility={rate ? 'visible' : 'hidden'}>
						1 {fromCode} = {rate?.toFixed(6)} {toCode}
					</Text>
				</Skeleton>
			</HStack>

			<HStack gap='1rem' width='full' justifyContent='space-between'>
				<Text color='neutral.500' fontSize='0.75rem'>
					Inverse Rate
				</Text>
				<Skeleton loading={pending}>
					<Text fontSize='0.75rem' fontWeight='600' visibility={inverseRate ? 'visible' : 'hidden'}>
						1 {toCode} = {inverseRate?.toFixed(6)} {fromCode}
					</Text>
				</Skeleton>
			</HStack>
		</VStack>
	);
}, 'ConversionResult.ExchangeRateDetails');

export const UsingCacheStatus = reatomComponent(() => {
	if (!usingRatesCache())
		return null;

	const createdAt = conversionResult.currentCacheEntryCreatedAt();
	if (!createdAt) {
		return (
			<Text color='red.500' fontSize='0.75rem'>
				No cache entry for this rate
			</Text>
		);
	}

	return (
		<Text color='orange.500' fontSize='0.75rem'>
			Using cache from {createdAt.toLocaleString()}
		</Text>
	);
}, 'ConversionResult.UsingCacheStatus');
