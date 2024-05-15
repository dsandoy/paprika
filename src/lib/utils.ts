import type { User } from 'firebase/auth';
import { DBService, PlanQueries } from './Firebase';
import type { ClientDish, Ingredient, PlanEntry, ShoppingListEntry } from './types';
import type { Dish } from '@prisma/client';
import { Timestamp } from 'firebase/firestore';
import { ArrayEmptyError, NotFoundError, ObjectExists, ValueError } from './errors';

export class DateHandler {
	/** Display the date in the date number and month only. Ex: 12. feb,
	 * if no datevalue, return emptyMessage, else return empty string
	 * @param date The date to display
	 * @param emptyMessage The message to display if no date
	 */
	public static showDate(date: Timestamp | undefined, emptyMessage = '') {
		if (date === undefined || typeof date !== 'object') {
			if (emptyMessage) {
				return emptyMessage;
			}
			return '';
		}
		const date2 = date.toDate();
		const dateStr = date2.toDateString();
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

	public static isTimestampToday(timestamp: Timestamp): 'before' | 'after' | 'today' | '' {
		const date = timestamp.toDate();
		const today = new Date();
		if (
			date.getFullYear() === today.getFullYear() &&
			date.getMonth() === today.getMonth() &&
			date.getDate() === today.getDate()
		) {
			return 'today';
		} else if (date < today) {
			return 'before';
		} else if (date > today) {
			return 'after';
		}
		return '';
	}
}

export interface ValidationResult {
	is_valid: boolean;
	message: string;
}

/** Static class for Dish validation methods */
export class DishValidator {
	public static readonly INVALID_URL: ValidationResult = {
		is_valid: false,
		message: 'Linken er ugyldig!'
	};
	/** Error code if the attribute is empty */
	public static EMPTY(name: string): ValidationResult {
		return {
			is_valid: false,
			message: name + ' kan ikke være tomt'
		};
	}
	/** Error code if the attribute is already in use*/
	public static IN_USE(name: string): ValidationResult {
		return {
			is_valid: false,
			message: name + ' er allerede i bruk'
		};
	}
	/** Error code if the attribute is invalid */
	public static readonly INVALID_FILE_TYPE: ValidationResult = {
		is_valid: false,
		message: 'Filtypen er ikke gyldig'
	};
	/** Code if the attribute is valid */
	public static readonly VALID: ValidationResult = {
		is_valid: true,
		message: ''
	};

	/** Validate that the inputed value is a url */
	public static validateURL(url: string) {
		if (!url) return this.VALID;
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
	 * ```ts
	 * // check if name is in dishes
	 * const v = DishValidator.validateName('name', dishes);
	 *  // check for uniquness only:
	 * const v = DishValidator.validateName('name');
	 * ```
	 */
	public static validateName(name: string, dishes: Dish[] | ClientDish[] = []) {
		if (name.length === 0) return this.EMPTY('Navnet');

		if (dishes.length === 0) return this.VALID;
		const names = dishes.map((d) => d.name);
		if (names.includes(name)) {
			return this.IN_USE('Navnet');
		}
		return this.VALID;
	}

	/** Returns 0 if valid, IN_USE if already in use */
	public static validateIngredients(ing: Ingredient, ingredients: Ingredient[]) {
		if (ingredients.some((i) => i === ing)) {
			return this.IN_USE('Ingrediensen');
		}
		return this.VALID;
	}

	/** Make sure the uploaded file is an image */
	public static validateImage(file: File) {
		if (!file) return this.VALID;
		const imgTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml', 'image/webp'];
		if (imgTypes.includes(file.type)) {
			return this.VALID;
		}
		return this.INVALID_FILE_TYPE;
	}

	/** Validates all fields of a dish simultaneously
	 *  To be used before submitting a dish to the database
	 */
	public static validateAll(dish: ClientDish, dishes: ClientDish[], nameOkay = false) {
		let result = this.VALID;
		if (!nameOkay) {
			result = this.validateName(dish.name, dishes);
		}
		if (result !== this.VALID) return result;
		result = this.validateURL(dish.url);
		if (result !== this.VALID) return result;
		// check the ingredients for dublicates
		if (dish.ingredients) {
			const uniq = [...new Set(dish.ingredients)];
			if (uniq.length !== dish.ingredients.length) {
				return this.IN_USE('Ingrediensen');
			}
		}
		return this.VALID;
	}
}

/** Handles various plan related functions */
export class PlansHandler {
	/** Creates plans for the upcoming week if it does not exist.
	 * @param user The logged in user
	 * @param date optional if the date is not the next monday...
	 */
	public static async CreateMissingPlans(user: User | null, date: Date | null = null) {
		let nextMonday;
		if (!date) {
			nextMonday = DateHandler.getNextMonday(new Date());
		} else {
			nextMonday = date;
		}
		const query = PlanQueries.getPlans(user, [
			nextMonday,
			DateHandler.getDayNDaysAway(nextMonday, 6)
		]);
		const plans = (await DBService.getResources(query)) as PlanEntry[];
		if (!plans || plans.length === 0) {
			await DBService.createWeekPlans(nextMonday, user);
		}
	}

	public static extractCheckedDishes(plans: PlanEntry[], dishes: Dish[]): Dish[] {
		/** NOTE: Will trow from getDishFromID if dish id mismatch (which should not happen) */
		const selectedDishes: Dish[] = [];
		plans.forEach((plan) => {
			if (plan.checked && plan.dish) {
				selectedDishes.push(this.getDishFromID(plan.dish, dishes));
			}
		});

		return selectedDishes;
	}

	protected static getDishFromID(id: string, dishes: Dish[]): Dish {
		const dish = dishes.find((dish) => dish.id == id);
		if (dish) {
			return dish;
		} else {
			throw new NotFoundError('id not found in dishes!');
		}
	}
}

export class ShoppingListHandler {
	/**@example
	 *  ```javascript
	 *  // sort and update shopping list
	 	let list = $shoppingList.list;
	 *  list = ShoppingListHandler.sortlist(list);
		$shoppingList.list = list;
	 * ```
	 */
	public static sortList(list: ShoppingListEntry[]) {
		if (!list || list.length === 0) throw new ArrayEmptyError('No shopping list');
		list.sort((a, b) => {
			return a.text < b.text ? -1 : 1;
		});
		return list;
	}

	/**@example
	 *  ```javascript
	 *  // update shoppinng list
	 	let list = $shoppingList.list;
	 *  list = ShoppingListHandler.addIngredients(list, dish);
		$shoppingList.list = list;
	 * ```
	 */
	public static addIngredients(list: ShoppingListEntry[], dish: Dish) {
		if (!dish.ingredients) throw new ValueError('No ingredients in dish');
		const ingredients = dish.ingredients;

		if (ingredients.length == 0) return list;
		if (list.find((i) => i.dish === dish.name)) {
			throw new ObjectExists('Dish already in shopping list');
		}

		ingredients.forEach((i) => {
			if (i !== '') {
				list.push({ text: i, is_complete: false, dish: dish.name });
			}
		});
		return list;
	}
}

export const navigations = [
	{
		url: '/dish-planner',
		icon: 'zondicons:calendar',
		name: 'Middager'
	},
	{
		url: '/dishes',
		icon: 'zondicons:location-food',
		name: 'Matretter'
	},
	{
		url: '/shopping-list',
		icon: 'zondicons:list',
		name: 'Handleliste'
	}
];
