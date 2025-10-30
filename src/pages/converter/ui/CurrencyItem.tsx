import { Circle, HStack, VStack, type HstackProps } from 'styled-system/jsx';
import type { Currency } from '../model/currency';
import { Heading, Text } from '@/shared/ui/kit/components';

export const CurrencyItem = ({ currency, ...props }: HstackProps & { currency: Currency }) => {
	return (
		<HStack gap='0.75rem' {...props}>
			<Circle
				boxSize='1.875rem'
				border='default'
				borderColor='colorPalette.200'
				backgroundColor='colorPalette.50'
				color='colorPalette.700'
				fontSize='0.75rem'
			>
				{currency.symbol}
			</Circle>

			<VStack alignItems='start' gap='0.125rem'>
				<Heading as='h5'  fontSize='0.875rem'>
					{currency.code}
				</Heading>

				<Text color='neutral.500'  fontSize='0.75rem'>
					{currency.name}
				</Text>
			</VStack>
		</HStack>
	);
};
