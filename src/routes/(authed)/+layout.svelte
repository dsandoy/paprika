<script lang="ts">
	// the top bar is inserted here...

	import ProfileDropdown from '$lib/components/user/ProfileDropdown.svelte';
</script>

<header class="w-svw h-16 flex bg-green justify-between px-5 items-center text-white">
	<div class="text-white">Menu</div>
	<a href="/dishes"
		><img class=" h-14 lg:w-16 lg:h-16" src="/paprika_logos/green.png" alt="Logo img" />
	</a>
	<div>
		<ProfileDropdown></ProfileDropdown>
	</div>
</header>

<slot />
