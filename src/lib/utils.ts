import { DBService } from './Firebase';
import type { Dish, Ingredient, PlanEntry } from './types';

export class DateHandler {
	/** Display the date in the date number and month only. Ex: 12. feb,
	 * if no datevalue, return emptyMessage, else return empty string
	 */
	public static showDate(date: Date | undefined, emptyMessage = '') {
		if (date === undefined) {
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

	/** Returns the next monday from the provided date.. */
	public static getNextMonday(date: Date): Date {
		let daysToMonday = 8 - date.getDay();
		if (daysToMonday === 8) {
			// getDay is 0 on sunday..
			daysToMonday = 1;
		}
		const nextMonday = this.getDayNDaysAway(date, daysToMonday);
		return nextMonday;
	}

	public static getNextDay(date: Date): Date {
		return this.getDayNDaysAway(date, 1);
	}

	/** Returns the date the set distance away. Works both back and forewards.. */
	public static getDayNDaysAway(date: Date, distance: number) {
		return new Date(date.getFullYear(), date.getMonth(), date.getDate() + distance);
	}

	/** Checks if the provided date preceeds the current date */
	public static hasDayPassed(date: Date) {
		return date < new Date();
	}

	/** Returns a date range of the current week */
	public static getWeek(date: Date) {
		const day = date.getDay();
		if (day === 0) {
			return [this.getDayNDaysAway(date, -6), date];
		}
		return [this.getDayNDaysAway(date, -(day - 1)), this.getDayNDaysAway(date, 7 - day)];
	}
}

/** Static class for Dish validation methods */
export class DishValidator {
	public static readonly INVALID_URL = -3;
	/** Error code if the attribute is empty */
	public static readonly EMPTY = -1;
	/** Error code if the attribute is already in use*/
	public static readonly IN_USE = -2;
	/** Error code if the attribute is invalid */
	public static readonly INVALID_FILE_TYPE = -4;
	/** Code if the attribute is valid */
	public static readonly VALID = 0;

	/** Validate that the inputed value is a url */
	public static validateURL(url: string) {
		if (!url) return 0;
		const pattern = new RegExp(
			'^(https?:\\/\\/|http?:\\/\\/)?' + // protocol
				'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{1,}|' + // domain name
				'((\\d{0,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
				'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
				'(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
				'(\\#[-a-z\\d_]*)?$',
			'i'
		); // fragment locator
		const res = pattern.test(url);
		if (!res) return this.INVALID_URL;
		return this.VALID;
	}
	/** Check that the name is not empty or already in use
	 * Returns 0 if valid, EMPTY if empty, IN_USE if already in use
	 */
	public static validateName(name: string, dishes: Dish[]) {
		if (name.length === 0) return this.EMPTY;

		const names = dishes.map((d) => d.name);
		if (names.includes(name)) {
			return this.IN_USE;
		}
		return this.VALID;
	}

	/** Returns 0 if valid, IN_USE if already in use */
	public static validateIngredients(ing: Ingredient, ingredients: Ingredient[]) {
		if (ingredients.some((i) => i === ing)) {
			return this.IN_USE;
		}
		return this.VALID;
	}

	/** Make sure the uploaded file is an image */
	public static validateImage(file: File) {
		if (!file) return this.VALID;
		const imgTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'];
		if (imgTypes.includes(file.type)) {
			return this.VALID;
		}
		return this.INVALID_FILE_TYPE;
	}

	/** Validates all fields of a dish simultaneously
	 *  To be used before submitting a dish to the database
	 */
	public static validateAll(dish: Dish, dishes: Dish[]) {
		let result = this.validateName(dish.name, dishes);
		if (result !== this.VALID) return result;
		result = this.validateURL(dish.url);
		if (result !== this.VALID) return result;
		// check the ingredients for dublicates
		if (dish.ingredients) {
			const uniq = [...new Set(dish.ingredients)];
			if (uniq.length !== dish.ingredients.length) {
				console.log('Ingrendients are not unique...');
				return this.IN_USE;
			}
		}
		return this.VALID;
	}
}

/** Creates the Planentries for the upcoming week if the dont exist */
export class PlannerCreator {
	/** Creates plans for the upcoming week if it does not exist. */
	public static async CreateMissingPlans(plans: PlanEntry[]) {
		const nextMonday = DateHandler.getNextMonday(new Date());
		if (!this.doesPlansExist(plans, nextMonday)) {
			await DBService.createWeekPlans(nextMonday);
		}
	}
	/** Check if plans exist for the upcoming week. */
	public static doesPlansExist(plans: PlanEntry[], date: Date) {
		for (const plan of plans) {
			if (plan.date.toDateString() === date.toDateString()) {
				return true;
			}
		}
		return false;
	}
}
