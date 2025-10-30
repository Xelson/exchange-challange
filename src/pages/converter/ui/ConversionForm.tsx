import { Text, TextField } from '@/shared/ui/kit/components';
import { Icons } from '@/shared/ui/kit/icons';
import { reatomComponent } from '@reatom/react';
import { HStack, styled, VStack } from 'styled-system/jsx';
import { CurrencyItem } from './CurrencyItem';
import { currencySelectDialog } from './currency-select';
import { wrap } from '@reatom/core';
import { converterForm } from '../model/form';

export const ConversionForm = () => {
	return (
		<VStack
			padding='1.25rem'
			width='full'
			rounded='1rem'
			border='default'
			gap='1.5rem'
		>
			<AmountField />

			<HStack
				width='full'
				gap='0.75rem'
				alignItems='end'
				tabletDown={{
					flexDirection: 'column',
					alignItems: 'center',
					gap: '0',
				}}
			>
				<FromField />
				<SwapButton />
				<ToField />
			</HStack>
		</VStack>
	);
};

const Field = styled('label', {
	base: {
		display: 'flex',
		flexDir: 'column',
		gap: '0.5rem',
		width: 'full',
	},
});

const AmountField = reatomComponent(() => {
	const field = converterForm.fields.amount;

	return (
		<Field>
			<Text>Amount</Text>

			<TextField.Root
				asChild
				width='full'
				value={field.value()}
				onValueChange={wrap(field.change)}
				invalid={!!field.validation().error}
			>
				<div>
					<TextField.Input
						placeholder='Enter amount...'
						textAlign='center'
					/>
				</div>
			</TextField.Root>
		</Field>
	);
}, 'ConversionForm.AmountField');

const CurrencyButton = styled('button', {
	base: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		border: 'default',
		paddingX: '0.5rem',
		background: 'neutral.50',
		rounded: '0.5rem',
		height: '2.5625rem',
		cursor: 'pointer',
		transition: '100ms background-color',
		_hover: {
			background: 'neutral.100',
		},
		_focus: {
			background: 'neutral.100',
		},
	},
});

const FromField = reatomComponent(() => {
	const handleClick = wrap(async () => {
		const result = await wrap(currencySelectDialog.requestOpen({
			defaultCurrency: converterForm.fields.from(),
		}));

		if (result)
			converterForm.fields.from.set(result);
	});

	return (
		<Field as='div'>
			<Text>From</Text>

			<CurrencyButton
				width='full'
				onClick={handleClick}
			>
				<CurrencyItem currency={converterForm.fields.from()} />
			</CurrencyButton>
		</Field>
	);
}, 'ConversionForm.FromField');

const ToField = reatomComponent(() => {
	const handleClick = wrap(async () => {
		const result = await wrap(currencySelectDialog.requestOpen({
			defaultCurrency: converterForm.fields.to(),
		}));

		if (result)
			converterForm.fields.to.set(result);
	});

	return (
		<Field as='div'>
			<Text>To</Text>

			<CurrencyButton
				width='full'
				onClick={handleClick}
			>
				<CurrencyItem currency={converterForm.fields.to()} />
			</CurrencyButton>
		</Field>
	);
}, 'ConversionForm.ToField');

const SwapButton = reatomComponent(() => {
	return (
		<styled.button
			display='flex'
			alignItems='center'
			justifyContent='center'
			boxSize='2.625rem'
			flexShrink='0'
			cursor='pointer'
			rounded='full'
			_icon={{ boxSize: '1.125rem' }}
			onClick={wrap(converterForm.swapDirections)}
		>
			<Icons.Swap />
		</styled.button>
	);
}, 'ConversionForm.SwapButton');
