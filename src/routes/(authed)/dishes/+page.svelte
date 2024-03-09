<script lang="ts">
	import Table from '$lib/components/dish/Table.svelte';
	import type { Dish } from '$lib/types.js';
	import { dishes } from '$lib/stores.js';
	import PrimaryButton from '$lib/components/PrimaryButton.svelte';
	import Icons from '$lib/components/Icons.svelte';

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
				class="w-16 h-12 lg:w-20 text-base lg:text-lg"
				class:selected-tab={viewMode === 'table'}
				on:click={() => (viewMode = 'table')}>Tabell</button
			>
			<button
				class="w-16 lg:w-20 h-12 text-base lg:text-lg"
				class:selected-tab={viewMode === 'images'}
				on:click={() => (viewMode = 'images')}>Bilder</button
			>
		</div>
		<a href="/dishes/add">
			<PrimaryButton>Legg Til</PrimaryButton>
		</a>
	</div>
	{#if viewMode === 'table'}
		{#if !data.response}
			<div>"Ingen middager"</div>
		{:else}
			<Table />
		{/if}
	{:else if viewMode === 'images'}
		<div class="mt-64">Bilder kommer snart...</div>
	{/if}
</section>
