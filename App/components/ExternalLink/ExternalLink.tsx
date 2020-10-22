import React, { ReactNode } from 'react';
import { Text, GestureResponderEvent } from 'react-native';

import { link } from '../../util/theme';

interface ExlinkProps {
	dest: (event: GestureResponderEvent) => void;
	children: ReactNode
}

export function Exlink(props: ExlinkProps): React.ReactElement {
	const { children, dest } = props
	return <Text onPress={dest} style={link}>{children}</Text>
}
