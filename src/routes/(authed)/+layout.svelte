<script lang="ts">
	import SideBar from '$lib/components/SideBar.svelte';
	import ProfileDropdown from '$lib/components/user/ProfileDropdown.svelte';
	import { SignedIn } from 'sveltefire';
</script>

<SignedIn>
	<header class="w-svw h-16 flex bg-green justify-between px-5 items-center text-white">
		<SideBar />
		<a href="/dishes"
			><img class=" h-14 lg:w-16 lg:h-16" src="/paprika_logos/green.png" alt="Logo img" />
		</a>
		<div>
			<ProfileDropdown></ProfileDropdown>
		</div>
	</header>

	<slot />
</SignedIn>
