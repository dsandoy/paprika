<script lang="ts">
	import Card from '$lib/components/dish/Card.svelte';
	import Table from '$lib/components/dish/Table.svelte';
	import DishSearch from '$lib/components/DishSearch.svelte';
	import Icons from '$lib/components/Icons.svelte';
	import PrimaryButton from '$lib/components/PrimaryButton.svelte';
	import { DBService, DishQueries } from '$lib/Firebase.js';
	import { dishes, user } from '$lib/stores.js';
	import type { Dish } from '$lib/types.js';

	export let data;

	let viewMode: 'table' | 'images' = 'table';

	function getDishes() {
		const q = DishQueries.dishes($user);
		DBService.getResources(q).then((result) => {
			dishes.set(result as Dish[]);
		});
	}
	$: getDishes(), $user;

	let filteredDishes: Dish[] = [];
</script>

<section class="flex flex-col items-center align-center w-svw h-[92svh] m-0">
	<h2 class="text-3xl mt-16 mb-4">Matretter</h2>
	<div
		class="border-b-[1px] border-grey-300 border-solid flex flex-row content-center justify-between w-[80%] h-12"
	>
		<div class="flex flex-row">
			<button
				class="w-10 h-12 lg:w-16 text-base lg:text-lg flex items-center justify-center"
				class:selected-tab={viewMode === 'table'}
				on:click={() => (viewMode = 'table')}><Icons iconName="zondicons:list" /></button
			>
			<button
				class="w-10 lg:w-16 h-12 text-base lg:text-lg flex items-center justify-center"
				class:selected-tab={viewMode === 'images'}
				on:click={() => (viewMode = 'images')}><Icons iconName="mage:dashboard-fill" /></button
			>
		</div>
		<DishSearch dishes={$dishes} bind:filteredDishes />
		<a href="/dishes/add">
			<PrimaryButton classNames="gap-2"
				><Icons iconName="twemoji:shallow-pan-of-food" /><span class="hidden lg:block"
					>Legg til</span
				></PrimaryButton
			>
		</a>
	</div>
	{#if viewMode === 'table'}
		{#if !data}
			<div>"Ingen middager"</div>
		{:else}
			<Table bind:dishes={filteredDishes} />
		{/if}
	{:else if viewMode === 'images'}
		<div
			class="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-4 lg:grid-cols-3 gap-8 lg:gap-16 mt-12 p-4 overflow-auto h-[80%]"
		>
			{#each filteredDishes as dish}
				<Card {dish} />
			{/each}
		</div>
	{/if}
</section>
