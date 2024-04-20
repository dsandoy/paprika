<script lang="ts">
	import { onMount } from 'svelte';
	import '../app.css'; // import the tailwind stuff
	import { onAuthStateChanged } from 'firebase/auth';
	import { user } from '$lib/stores';
	import { auth } from '$lib/Firebase';

	onMount(() => {
		onAuthStateChanged(auth, (u) => {
			if (u) {
				user.set(u);
			} else {
				user.set(null);
			}
		});
	});
</script>

<slot />
