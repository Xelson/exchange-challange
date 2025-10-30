import { ark } from '@ark-ui/react';
import { Children, Fragment } from 'react';
import { HStack, styled, VStack, type HstackProps, type VstackProps } from 'styled-system/jsx';

export const Divider = styled(ark.hr, {
	base: {
		flexGrow: '1',
		borderColor: 'neutral.200',
		flexShrink: '0',
		width: 'full',
	},
});

export const DividerWithElement = ({ children, ...props }: HstackProps) => (
	<HStack
		gap='0.5rem'
		color='neutral.400'
		fontWeight='semibold'
		textStyle='p.300'
		width='full'
		maskImage='radial-gradient(rgba(0, 0, 0, 1) 20%, rgba(0, 0, 0, 0) 70%)'
		{...props}
	>
		<Divider />
		{children}
		<Divider />
	</HStack>
);

export const DividerStack = ({ divider = <Divider />, children, ...props }: VstackProps & { divider?: React.ReactNode }) => {
	const dividedChildren = Children
		.toArray(children)
		.map((child, index, array) => (
			<Fragment key={index}>
				{child} {index < array.length - 1 && divider}
			</Fragment>
		));

	return (
		<VStack {...props}>
			{dividedChildren}
		</VStack>
	);
};
