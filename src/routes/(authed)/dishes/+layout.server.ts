import { DishQueries } from '$lib/server/queries';
import { checkUser } from '$lib/server/utils';

export const load = async (event) => {
	try {
		const user = await checkUser(event);
		const dishes = await DishQueries.getMany(user.email as string);
		if (dishes)
			return {
				user: user,
				dishes: dishes
			};
		return {
			user: user,
			error: 'failed to get dishes'
		};
	} catch (error) {
		console.error(error);
		return {
			error: 'Failed to get dishes'
		};
	}
};
