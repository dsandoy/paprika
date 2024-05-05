import { DemoData } from '../../demodata';

export const load = async () => {
	try {
		// const dishes = await DishQueries.getMany({ all: true });
		const dishes = DemoData.dishes;
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
