import { DishQueries, ListQueries } from '$lib/server/queries.js';

export const load = async ({ parent }) => {
	const { user } = await parent();
	const dishes = await DishQueries.getMany(user.email as string);
	const list = await ListQueries.getAll(user.email as string);
	return {
		user: user,
		dishes: dishes,
		shoppingList: list
	};
};
