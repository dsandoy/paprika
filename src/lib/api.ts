/** This files contains types, api urls and utiltiy functions to interact with the apis.. */

import type { CreateIngredient } from './types';
import type { ValidationResult } from './utils';

/** Collection of available api urls */
export class APIURLS {
	static ADD_DISH = '/api/dishes/add';
	static EDIT_DISH = '/api/dishes/edit';
	static DELETE_DISH = '/api/dishes/delete';

	/** Returns all api urls in a list */
	public static all(): string[] {
		return [this.ADD_DISH, this.EDIT_DISH, this.DELETE_DISH];
	}
}

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

/** Create a post request to the provided api endpoint using form data... */
export async function fetchFromApiForm(url: string, body: FormData) {
	if (APIURLS.all().includes(url)) {
		const response = await fetch(url, {
			method: 'POST',
			body: body
		});
		return response;
	} else {
		throw new Error('Invalid api url: ' + url);
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

/** Type of body request in the edit dish api */
export type EditDishBody = {
	id: number;
	name: string;
	url: string;
	ingredients: CreateIngredient[];
	email: string;
	image: File | undefined;
};

/** type of body request in the delete dish api */
export type DeleteDishBody = {
	id: number;
	email: string;
};

export type AddDishResponse = {
	va: ValidationResult;
};

export type EditDishResponse = {
	va: ValidationResult;
};

export type DeleteDishResponse = {
	va: ValidationResult;
};
