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

import { Linking } from 'react-native';

import { sentryError } from '../../util/sentry';

function AboutLink(url: string): void {
	Linking.openURL(url).catch(sentryError('About'));
}

export function handleOpenWaqi(): void {
	AboutLink('https://aqicn.org');
}

export function handleOpenOpenAQ(): void {
	AboutLink('https://openaq.org');
}

export function handleOpenBerkeley(): void {
	AboutLink(
		'http://berkeleyearth.org/air-pollution-and-cigarette-equivalence/'
	);
}

export function handleOpenAmaury(): void {
	AboutLink('https://twitter.com/amaurymartiny');
}

export function handleOpenGithub(): void {
	AboutLink('https://github.com/amaurymartiny/shoot-i-smoke');
}

export function handleOpenMarcelo(): void {
	AboutLink('https://www.behance.net/marceloscoelho');
}
