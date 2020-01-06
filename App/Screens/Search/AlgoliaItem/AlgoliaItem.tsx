// Sh**t! I Smoke
// Copyright (C) 2018-2020  Marcelo S. Coelho, Amaury Martiny

// Sh**t! I Smoke is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Sh**t! I Smoke is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with Sh**t! I Smoke.  If not, see <http://www.gnu.org/licenses/>.

import React from 'react';

import { ListItem } from '../../../components';
import { Location } from '../../../stores/util/fetchGpsPosition';
import { AlgoliaHit } from '../fetchAlgolia';

interface ItemProps {
  item: AlgoliaHit;
  onClick: (item: Location) => void;
}

export function AlgoliaItem(props: ItemProps): React.ReactElement {
  const { item, onClick } = props;

  const { city, country, county, _geoloc, locale_names: localeNames } = item;

  const handleClick = (): void => {
    onClick({
      latitude: _geoloc.lat,
      longitude: _geoloc.lng,
      name: [
        localeNames[0],
        city,
        county && county.length ? county[0] : null,
        country
      ]
        .filter(_ => _)
        .join(', ')
    });
  };

  return (
    <ListItem
      description={[city, county && county.length ? county[0] : null, country]
        .filter(_ => _)
        .join(', ')}
      icon="pin"
      onPress={handleClick}
      title={localeNames[0]}
    />
  );
}
