<script lang="ts">
	import Card from '$lib/components/dish/Card.svelte';
	import Table from '$lib/components/dish/Table.svelte';
	import DishSearch from '$lib/components/DishSearch.svelte';
	import Dropdown from '$lib/components/Dropdown.svelte';
	import Button from '$lib/components/Button.svelte';
	import Icons from '$lib/components/Icons.svelte';
	import PrimaryButton from '$lib/components/PrimaryButton.svelte';
	import { DBService, DishQueries } from '$lib/Firebase.js';
	import { dishes, ingredients, user } from '$lib/stores.js';
	import type { Dish } from '$lib/types.js';

	export let data;

	let viewMode: 'table' | 'card' = 'table';

	let isOpen = false;

	ingredients.set(['']);

	function getDishes() {
		const q = DishQueries.dishes($user);
		DBService.getResources(q).then((result) => {
			dishes.set(result as Dish[]);
		});
	}
	$: getDishes(), $user;

	function selectTable() {
		viewMode = 'table';
		isOpen = false;
	}

	function selectCard() {
		viewMode = 'card';
		isOpen = false;
	}

	let filteredDishes: Dish[] = [];
</script>

<section class="flex flex-col items-center align-center w-svw h-[92svh] m-0 bg-green/10">
	<div class="sticky top-0 bg-green-50 w-full lg:w-[80%]">
		<div class="w-full pl-4">
			<h2 class="text-3xl mt-8 mb-4 lg:mb-8 lg:text-center">Matretter</h2>
		</div>
		<div
			class="flex flex-row content-center gap-4 justify-between w-full pl-4 pr-4 lg:w-[80%] h-12 bg-green-50"
		>
			<div class="flex flex-row gap-3">
				<Dropdown
					classNamesButton="px-3 lg:px-5"
					relative
					bind:isOpen
					classNamesContent="border-green border-[1px] rounded absolute bg-white z-value-1"
				>
					<button
						slot="button"
						class="w-10 h-12 lg:w-16 text-base lg:text-lg flex items-center justify-center"
						data-ui={viewMode === 'table'}
					>
						{#if viewMode === 'table'}
							<Icons iconName="zondicons:list" />
						{:else if viewMode === 'card'}
							<Icons iconName="mage:dashboard-fill" />
						{/if}
					</button>
					<div slot="content">
						<Button
							on:click={() => selectTable()}
							classNames="gap-2 flex hover:bg-green/20 p-2 pl-4"
						>
							<Icons iconName="zondicons:list" />
							<p>Tabell</p>
						</Button>
						<Button
							on:click={() => selectCard()}
							classNames="gap-2 flex hover:bg-green/20 p-2 pl-4"
						>
							<Icons iconName="mage:dashboard-fill" />
							<p>Bilder</p>
						</Button>
					</div>
				</Dropdown>
			</div>
			<DishSearch dishes={$dishes} bind:filteredDishes />
			<a href="/dishes/add">
				<PrimaryButton classNames="gap-2"
					><Icons iconName="zondicons:add-solid" /><span class="hidden lg:block">Legg til</span
					></PrimaryButton
				>
			</a>
		</div>
	</div>
	{#if viewMode === 'table'}
		{#if !data}
			<div>"Ingen middager"</div>
		{:else}
			<div class="bg-green-50 pt-5 pb-12 w-full flex items-center justify-center">
				<Table bind:dishes={filteredDishes} />
			</div>
		{/if}
	{:else if viewMode === 'card'}
		<div
			class="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-4 lg:grid-cols-3 gap-8 lg:gap-16 mt-12 p-4 overflow-auto h-[80%]"
		>
			{#each filteredDishes as dish}
				<Card {dish} />
			{/each}
		</div>
	{/if}
</section>
