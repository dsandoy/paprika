<script lang="ts">
	import type { Dish } from '$lib/types';
	import Icons from '../Icons.svelte';

	/** The dish to display on the card */
	export let dish: Dish;

	function edit() {
		try {
			window.location.href = 'dishes/edit/' + dish.name;
		} catch {
			return;
		}
	}
</script>

<button
	class="card shadow-lg bg-white transform transition duration-300 hover:scale-110"
	on:click={edit}
>
	<figure class="max-h-28 lg:max-h-40">
		{#if dish.customImage}
			<img src={dish.customImage} alt="dish" />
		{:else}
			<img src="/logo-red.svg" alt="dish" />
		{/if}
	</figure>
	<div class="card-title p-4 pb-0">
		<h2 class="text-sm lg:text-lg">{dish.name}</h2>
	</div>
	<div class="card-actions justify-end w-full pr-4 p-2">
		{#if dish.url}
			<button class="btn btn-xs btn-primary h-8 lg:h-10 text-white hidden lg:block"
				><a href={dish.url} class="flex flex-row justify-center items-center gap-2"
					>Oppskrift<Icons height="1rem" /></a
				></button
			>
		{/if}
	</div>
</button>
