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

import React, { createContext, useState } from 'react';
import { noop } from '@shootismoke/ui';

interface Context {
	error?: Error;
	setError: (error?: Error) => void;
}

export const ErrorContext = createContext<Context>({
	error: undefined,
	setError: noop,
});

export function ErrorContextProvider({
	children,
}: {
	children: JSX.Element;
}): React.ReactElement {
	const [error, setError] = useState<Error | undefined>(undefined);

	return (
		<ErrorContext.Provider value={{ error, setError }}>
			{children}
		</ErrorContext.Provider>
	);
}
