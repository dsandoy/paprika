<script lang="ts">
	import Icons from '$lib/components/Icons.svelte';
	import SideBar from '$lib/components/SideBar.svelte';
	import ThemeController from '$lib/components/ThemeController.svelte';
	import ProfileDropdown from '$lib/components/user/ProfileDropdown.svelte';
	import { navigations } from '$lib/utils';
	import { onMount } from 'svelte';

	let smallSize = true;
	onMount(() => {
		smallSize = window.matchMedia('(max-width: 800px)').matches;
	});
</script>

<header class="w-svw h-16 flex justify-between px-5 items-center">
	{#if smallSize}
		<SideBar />
	{:else}
		<div class="w-16"></div>
		<div class="absolute top-4 left-4 z-10 flex flex-row gap-5">
			<a href="/dashboard" class="hover:text-primary flex gap-2 items-end text-sm" title="Dashbord"
				><Icons iconName="zondicons:home" height="1.5rem" /> Dashboard</a
			>
			{#each navigations as nav}
				<a href={nav.url} class="hover:text-primary flex gap-2 items-end text-sm" title={nav.name}
					><Icons iconName={nav.icon} height="1.5rem" />{nav.name}</a
				>
			{/each}
		</div>
	{/if}
	<a href="/dashboard" class="lg:pl-20"
		><img class=" h-14 lg:w-16 lg:h-16" src="/logo-green.svg" alt="Logo img" />
	</a>
	<div class="flex flex-row gap-4 justify-center items-center">
		<ThemeController />
		<ProfileDropdown />
	</div>
</header>

<slot />
