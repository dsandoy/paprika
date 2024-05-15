import { NotFoundError } from '$lib/errors';
import type { CreatePlan, ReadDish, ReadPlan } from '$lib/types';
import { PlanQueries } from './queries';

/** Handles various plan related functions */
export class PlansHandler {
	/** Creates plans for the provided date Range.
	 * WARNING: Does not check if the plans already exists... Careful were you call this!
	 * @param email The logged in user
	 * @param dates dateRange
	 *
	 * ```ts
	 * // first check if the plans already exists
	 * try {
	 * await PlanQueries.getPlans(email, dates); // if plans do not exist.
	 * } catch(e) {
	 *	 if (e instanceof NotFoundError) {
	 * await PlansHandler.CreateMissingPlans(email, dates);
	 * }

	 * }
	 * ```
	 */
	public static async CreateMissingPlans(email: string, dates: Date[]) {
		const plans: CreatePlan[] = [];
		let date = dates[0];
		while (date <= dates[1]) {
			const plan: CreatePlan = {
				date: date,
				user: email
			};
			plans.push(plan);
			date = new Date(date.setDate(date.getDate() + 1));
		}
		await PlanQueries.createMany(plans);
	}

	// TODO Might not need
	protected static getDishFromID(id: number, dishes: ReadDish[]): ReadDish {
		const dish = dishes.find((dish) => dish.id == id);
		if (dish) {
			return dish;
		} else {
			throw new NotFoundError('id not found in dishes!');
		}
	}

	// TODO Might not need...
	public static extractCheckedDishes(plans: ReadPlan[], dishes: ReadDish[]): ReadDish[] {
		/** NOTE: Will trow from getDishFromID if dish id mismatch (which should not happen) */
		const selectedDishes: ReadDish[] = [];
		plans.forEach((plan) => {
			if (plan.checked && plan.dish) {
				selectedDishes.push(this.getDishFromID(plan.dish.id, dishes));
			}
		});

		return selectedDishes;
	}
}
