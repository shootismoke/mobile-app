// Shoot! I Smoke
// Copyright (C) 2018-2023  Marcelo S. Coelho, Amaury M.

// Shoot! I Smoke is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Shoot! I Smoke is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with Shoot! I Smoke.  If not, see <http://www.gnu.org/licenses/>.

import type { GeoapifyRes } from '@shootismoke/ui';
import React from 'react';

import { ListItem } from '../../../components';
import { Location } from '../../../stores/util/fetchGpsPosition';

interface ItemProps {
	item: GeoapifyRes;
	onClick: (item: Location) => void;
}

export function GeoapifyItem(props: ItemProps): React.ReactElement {
	const { item, onClick } = props;

	const { city, country, formatted, lat, lon } = item;

	const handleClick = (): void => {
		onClick({
			latitude: lat,
			longitude: lon,
			name: [city, country].filter((_) => _).join(', ') || formatted,
		});
	};

	return (
		<ListItem
			description={formatted}
			icon="pin"
			onPress={handleClick}
			title={[city, country].filter((_) => _).join(', ') || formatted}
		/>
	);
}
