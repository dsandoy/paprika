<script lang="ts">
	import SecondaryButton from '$lib/components/SecondaryButton.svelte';
	import SideBar from '$lib/components/SideBar.svelte';
	import ProfileDropdown from '$lib/components/user/ProfileDropdown.svelte';
	import { SignedIn, SignedOut } from 'sveltefire';
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
<SignedOut>
	<div
		class="flex items-center justify-center flex-col border-l-[8px] border-red p-3 mt-24 pr-16 rounded bg-gray-100 w-64 lg:w-96 gap-4"
	>
		<div class="text-sm lg:text-base">Du er ikke innlogget!</div>
	</div>
	<a href="/login"><SecondaryButton>Logg Inn</SecondaryButton></a>
</SignedOut>
