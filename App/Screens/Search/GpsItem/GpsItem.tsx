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

import React, { useContext } from 'react';

import { ListItem } from '../../../components';
import { t } from '../../../localization';
import { CurrentLocationContext, GpsLocationContext } from '../../../stores';

export function GpsItem(): React.ReactElement | null {
	const { setCurrentLocation } = useContext(CurrentLocationContext);
	const { gps } = useContext(GpsLocationContext);

	if (!gps) {
		return null;
	}

	const handleClick = (): void => {
		setCurrentLocation(gps);
	};

	return (
		<ListItem
			description={t('search_current_location')}
			icon="gps"
			onPress={handleClick}
			title={gps.name || 'Your City'}
		/>
	);
}
