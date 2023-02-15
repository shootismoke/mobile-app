// Sh**t! I Smoke
// Copyright (C) 2018-2021  Marcelo S. Coelho, Amaury M.

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

import axios, { AxiosError } from 'axios';
import type { IUser, MongoUser } from '@shootismoke/ui';

const axiosConfig = {
	headers: {
		'x-shootismoke-secret': process.env.BACKEND_SECRET as string,
	},
};

export function createUser(user: IUser): Promise<MongoUser> {
	console.log(`<Axios> - POST /api/users, body=${JSON.stringify(user)}`);

	return axios
		.post<MongoUser>(
			`${process.env.BACKEND_URL as string}/api/users`,
			user,
			axiosConfig
		)
		.then(({ data }) => data)
		.catch((err) => {
			throw axiosErrorToError(err as AxiosError);
		});
}

/**
 * Get user by expoPushToken.
 *
 * @param expoPushToken - The Expo push token.
 */
export function getUser(expoPushToken: string): Promise<MongoUser> {
	console.log(`<Axios> - GET /api/users/expoPushToken/${expoPushToken}`);

	return axios
		.get<MongoUser>(
			`${
				process.env.BACKEND_URL as string
			}/api/users/expoPushToken/${expoPushToken}`,
			axiosConfig
		)
		.then(({ data }) => data)
		.catch((err) => {
			throw axiosErrorToError(err as AxiosError);
		});
}

export function updateUser(
	userId: string,
	user: Partial<IUser>
): Promise<MongoUser> {
	console.log(
		`<Axios> - PATCH /api/users/${userId}, body=${JSON.stringify(user)}`
	);

	return axios
		.patch<MongoUser>(
			`${process.env.BACKEND_URL as string}/api/users/${userId}`,
			user,
			axiosConfig
		)
		.then(({ data }) => data)
		.catch((err) => {
			throw axiosErrorToError(err as AxiosError);
		});
}

export function deleteUser(userId: string): Promise<MongoUser> {
	console.log(`<Axios> - DELETE /api/users/${userId}`);

	return axios
		.delete<MongoUser>(
			`${process.env.BACKEND_URL as string}/api/users/${userId}`,
			axiosConfig
		)
		.then(({ data }) => data)
		.catch((err) => {
			throw axiosErrorToError(err as AxiosError);
		});
}

function axiosErrorToError(err: AxiosError) {
	return new Error(`${err.message}: ${JSON.stringify(err.response?.data)}`);
}
