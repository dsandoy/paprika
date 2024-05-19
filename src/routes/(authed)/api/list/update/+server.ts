import { ListQueries } from '$lib/server/queries';
import { text, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();
	const { listEntry } = body;
	await ListQueries.update(listEntry);
	return text('Updated list entry');
};
