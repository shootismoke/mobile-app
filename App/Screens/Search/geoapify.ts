import { LatLng } from '@shootismoke/dataproviders';
import retry from 'async-retry';
import axios from 'axios';

export interface GeoapifyRes {
	city?: string;
	country?: string;
	formatted: string;
	lat: number;
	lon: number;
	state?: string;
}

/**
 * For docs, see https://apidocs.geoapify.com/playground/geocoding and
 * and https://apidocs.geoapify.com/docs/geocoding/forward-geocoding/#about
 */
function getEndpoint(search: string, apiKey: string, gps?: LatLng): string {
	const base = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
		search
	)}&limit=10&format=json&apiKey=${apiKey}`;

	if (gps) {
		return base + `&bias=proximity:${gps.longitude},${gps.latitude}`;
	}

	return base;
}

export async function geoapify(
	search: string,
	apiKey: string,
	gps?: LatLng
): Promise<GeoapifyRes[]> {
	return retry(
		async () => {
			const {
				data: { results },
			} = await axios.get<{ results: GeoapifyRes[] }>(
				getEndpoint(search, apiKey, gps),
				{
					timeout: 5000,
				}
			);

			return results;
		},
		{
			retries: 2,
		}
	);
}
