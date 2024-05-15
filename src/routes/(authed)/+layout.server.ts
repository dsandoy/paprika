import { redirect } from '@sveltejs/kit';

export async function load(event) {
	const { session } = await event.parent();
	if (!session?.user) {
		redirect(307, '/login');
	}
	return {
		user: session.user
	};
}
