import { auth } from '$lib/Firebase';
import { redirect } from '@sveltejs/kit';
export async function load() {
	if (auth.currentUser !== null) {
		throw redirect(307, '/');
	}
	return {};
}
