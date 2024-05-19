import { ListQueries } from '$lib/server/queries';
import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();
	const { user } = body;
	const list = await ListQueries.getAll(user);
	return json(list);
};
