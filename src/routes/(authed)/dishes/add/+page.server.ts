import { checkUser } from '$lib/server/utils.js';

export const load = async (event) => {
	// note that parent fetches dishes...
	const user = await checkUser(event);
	return {
		user: user
	};
};
