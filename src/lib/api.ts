/** This files contains types, api urls and utiltiy functions to interact with the apis.. */

import type { CreateIngredient } from './types';
import type { ValidationResult } from './utils';

/** Collection of available api urls */
export class APIURLS {
	static ADD_DISH = '/api/dishes/add';

	/** Returns all api urls in a list */
	public static all(): string[] {
		return [this.ADD_DISH];
	}
}

/** Type of body request in the add dish api */
export type AddDishBody = {
	name: string;
	url: string;
	ingredients: CreateIngredient[];
	email: string;
	image: File | undefined;
};

export type AddDishResponse = {
	va: ValidationResult;
};

/** Create a post request to the provided api endpoint */
export async function fetchFromApi<T>(url: string, body: T) {
	if (APIURLS.all().includes(url)) {
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(body)
		});
		return response;
	} else {
		throw new Error('Invalid api url: ' + url);
	}
}
