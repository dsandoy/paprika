<script lang="ts">
	import { auth } from '$lib/Firebase';
	import SideBar from '$lib/components/SideBar.svelte';
	import ProfileDropdown from '$lib/components/user/ProfileDropdown.svelte';
	import { user } from '$lib/stores';
	import { onAuthStateChanged } from 'firebase/auth';
	import { onMount } from 'svelte';

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

<header class="w-svw h-16 flex justify-between px-5 items-center bg-green/10">
	<SideBar />
	<a href="/dishes"><img class=" h-14 lg:w-16 lg:h-16" src="/logo-green.svg" alt="Logo img" /> </a>
	<div>
		<ProfileDropdown></ProfileDropdown>
	</div>
</header>

<slot />
