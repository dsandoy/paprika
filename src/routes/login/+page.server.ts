import { auth } from '$lib/Firebase';
import { redirect } from '@sveltejs/kit';
import { get } from 'svelte/store';
import { userStore } from 'sveltefire';
export async function load() {
	const user = userStore(auth);
	if (get(user) !== null) {
		throw redirect(307, '/');
	}
	return {};
}
