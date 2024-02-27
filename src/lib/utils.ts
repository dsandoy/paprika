import { get } from 'svelte/store';
import { dishes } from './stores';
import type { Ingredient } from './types';

/** Display the date in the date number and month only. Ex: 12. feb,
 * if no datevalue, return emptyMessage, else return empty string
 */
export function showDate(date: Date | null, emptyMessage = '') {
	if (date === null) {
		if (emptyMessage) {
			return emptyMessage;
		}
		return '';
	}
	const dateStr = date.toDateString();
	// remove month and year:
	const dateArr = dateStr.split(' ');
	return dateArr[0] + ' ' + dateArr[2];
}

export const URL_INVALID = -3;

export const DATABASE_ERROR = -8;
/** Validate that the inputed value is a url */
export function validateURL(url: string) {
	const pattern = new RegExp(
		'^(https?:\\/\\/|http?:\\/\\/)?' + // protocol
			'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
			'((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
			'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
			'(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
			'(\\#[-a-z\\d_]*)?$',
		'i'
	); // fragment locator
	return pattern.test(url);
}

/** error code for name empty */
export const NAME_EMPTY = -1;
/** error code for name already in use */
export const NAME_ALREADY_IN_USE = -2;
/** Check that the name is not empty or already in use */
export function validateName(name: string, names: string[] | null = null) {
	if (name.length === 0) return NAME_EMPTY;

	if (names === null)
	{
		names = get(dishes).map((d) => d.name);
	}

	if (names.includes(name)) {
		return NAME_ALREADY_IN_USE;
	}
	return 0;
}

/** Handle the comma separated list of ingredients and returns ingredient array*/
export function handleIngredients(ingredients :string | null) : Ingredient[]
{
	if (ingredients === null) {
		return [];
	}
	const arr = ingredients.split(',');
	return arr.map((i) => ({ value: i }))
}
