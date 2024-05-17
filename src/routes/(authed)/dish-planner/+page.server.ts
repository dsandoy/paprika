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
	console.log('this week', thisWeek);
	let nextWeekPlans: ReadPlan[] = [];
	const nextWeek = DateHandler.getWholeWeek(
		new Date(new Date().setDate(todayWithUTCTime.getDate() + 7))
	);
	console.log('Next week: ', nextWeek);

	// get current week plans
	try {
		thisWeekPlans = await PlanQueries.getPlans(user?.email as string, thisWeek);
		console.log('This weeks plans:', thisWeekPlans);
	} catch (e) {
		if (e instanceof NotFoundError) {
			await PlansHandler.CreateMissingPlans(user?.email, thisWeek);
			thisWeekPlans = await PlanQueries.getPlans(user?.email as string, thisWeek);
		} else {
			console.error(e);
		}
	}

	// get next week plans
	try {
		nextWeekPlans = await PlanQueries.getPlans(user?.email as string, nextWeek);
		console.log('next week plans', nextWeekPlans);
	} catch (e) {
		if (e instanceof NotFoundError) {
			await PlansHandler.CreateMissingPlans(user?.email, nextWeek);
			nextWeekPlans = await PlanQueries.getPlans(user?.email as string, nextWeek);
		} else {
			console.error(e);
		}
	}

	return {
		user: user,
		dishes: dishes,
		thisWeekPlans: thisWeekPlans,
		nextWeekPlans: nextWeekPlans
	};
};
