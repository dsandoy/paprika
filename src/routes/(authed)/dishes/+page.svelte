<script lang="ts">
	import Table from '$lib/components/dish/Table.svelte';
	import type { Dish } from '$lib/types.js';
	import { dishes } from '$lib/stores.js';

	export let data;
	if (data.response) {
		$dishes = data.response as Dish[];
	}

	let viewMode: 'table' | 'images' = 'table';
</script>

<section class="flex flex-col items-center align-center w-svw h-[92svh] m-0">
	<div
		class="border-b-[1px] border-grey-300 border-solid flex flex-row content-center justify-between w-[80%] h-12 mt-28"
	>
		<div>
			<button
				class="w-20 h-12"
				class:selected-tab={viewMode === 'table'}
				on:click={() => (viewMode = 'table')}>Tabell</button
			>
			<button
				class="w-20 h-12"
				class:selected-tab={viewMode === 'images'}
				on:click={() => (viewMode = 'images')}>Bilder</button
			>
		</div>
		<button class="btn-primary">Ny Matrett</button>
	</div>
	{#if viewMode === 'table'}
		{#if data.error}
			<div>{data.error.message}</div>
		{:else}
			<Table />
		{/if}
	{:else if viewMode === 'images'}
		<div class="mt-64">Bilder kommer snart...</div>
	{/if}
</section>
