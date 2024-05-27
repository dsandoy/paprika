import { DishQueries, PlanQueries } from '$lib/server/queries';
import { DateHandler } from '$lib/utils.js';

export const load = async ({ parent }) => {
	const { user } = await parent();
	const planCount = await PlanQueries.getCount(user.email);
	const dishCount = await DishQueries.getCount(user.email);

	const dateRange = createDateRange();

	const plans = await PlanQueries.getPlans(user.email, dateRange);

	return {
		planCount: planCount,
		dishCount: dishCount,
		plans: plans
	};
};

function createDateRange() {
	const today = new Date();
	const todayWithUTCTime = new Date(
		Date.UTC(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0)
	);
	return [
		DateHandler.getDayNDaysAway(todayWithUTCTime, -1),
		todayWithUTCTime,
		DateHandler.getDayNDaysAway(todayWithUTCTime, 1)
	];
}
