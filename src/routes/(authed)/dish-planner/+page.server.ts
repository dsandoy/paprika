import { NotFoundError } from '$lib/errors';
import { PlansHandler } from '$lib/server/handlers';
import { DishQueries, PlanQueries } from '$lib/server/queries';
import type { ReadPlan } from '$lib/types';
import { DateHandler } from '$lib/utils.js';

export const load = async ({ parent }) => {
	const { user } = await parent();
	const dishes = await DishQueries.getMany(user?.email as string);

	let thisWeekPlans: ReadPlan[] = [];
	const today = new Date();
	const todayWithUTCTime = new Date(
		Date.UTC(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0)
	);
	const thisWeek = DateHandler.getWholeWeek(todayWithUTCTime);
	let nextWeekPlans: ReadPlan[] = [];
	const nextWeek = DateHandler.getWholeWeek(
		new Date(new Date().setDate(todayWithUTCTime.getDate() + 7))
	);

	// get current week plans
	try {
		thisWeekPlans = await PlanQueries.getPlans(user?.email as string, thisWeek);
	} catch (e) {
		if (e instanceof NotFoundError) {
			await PlansHandler.CreateMissingPlans(user?.email as string, thisWeek);
			thisWeekPlans = await PlanQueries.getPlans(user?.email as string, thisWeek);
		} else {
			console.error(e);
		}
	}

	// get next week plans
	try {
		nextWeekPlans = await PlanQueries.getPlans(user?.email as string, nextWeek);
	} catch (e) {
		if (e instanceof NotFoundError) {
			await PlansHandler.CreateMissingPlans(user?.email as string, nextWeek);
			nextWeekPlans = await PlanQueries.getPlans(user?.email as string, nextWeek);
		} else {
			console.error(e);
		}
	}
	thisWeekPlans = thisWeekPlans.filter(
		(p) => p.date >= DateHandler.getDayNDaysAway(todayWithUTCTime, -2)
	);

	const plans = [...thisWeekPlans, ...nextWeekPlans];

	return {
		user: user,
		dishes: dishes,
		plans: plans
	};
};
