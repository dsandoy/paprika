import { DishQueries } from '$lib/server/queries';

export const load = async () => {
	try {
		const dishes = await DishQueries.getMany({ all: true });
		if (dishes)
			return {
				dishes: dishes
			};
		return {
			error: 'failed to get dishes'
		};
	} catch (error) {
		console.error(error);
		return {
			error: 'Failed to get dishes'
		};
	}
};
