<script lang="ts">
	import Card from '$lib/components/dish/Card.svelte';
	import Table from '$lib/components/dish/Table.svelte';
	import DishSearch from '$lib/components/DishSearch.svelte';
	import Icons from '$lib/components/Icons.svelte';
	import { dishes, ingredients } from '$lib/stores.js';
	import type { Dish } from '@prisma/client';

	export let data;

	let viewMode: 'table' | 'card' = 'table';

	ingredients.set(['']);

	function setDishes() {
		if (!data.dishes) {
			try {
				console.log(data.error);
			} catch {
				return;
			}
		}
		dishes.set(data.dishes as Dish[]);
	}
	setDishes();

	function selectTable() {
		viewMode = 'table';
	}

	function selectCard() {
		viewMode = 'card';
	}

	let filteredDishes: Dish[] = [];
</script>

<section class="flex flex-col items-center align-center w-full h-full m-0">
	<div class="sticky top-0 w-full lg:w-[80%] pb-8">
		<div class="w-full pl-4">
			<h2 class="text-3xl mt-8 mb-4 lg:mb-8 lg:text-center">Matretter</h2>
		</div>
		<div class="flex flex-row content-center gap-4 justify-between w-full pl-4 pr-4 h-12">
			<div class="flex flex-row justify-center items-center gap-3">
				<div class="dropdown dropdown-top">
					<div tabindex="0" role="button" class="btn m-1">
						{#if viewMode === 'table'}
							<Icons iconName="zondicons:list" />
						{:else if viewMode === 'card'}
							<Icons iconName="mage:dashboard-fill" />
						{/if}
					</div>
					<ul
						tabindex="-1"
						class="dropdown-content z-[10] menu p-2 shadow bg-base-100 rounded-box w-52"
					>
						<li>
							<button on:click={selectTable}>
								<Icons iconName="zondicons:list" />
								Tabell
							</button>
						</li>
						<li>
							<button on:click={selectCard}>
								<Icons iconName="mage:dashboard-fill" />
								Bilder
							</button>
						</li>
					</ul>
				</div>
			</div>
			<div>
				<DishSearch dishes={$dishes} bind:filteredDishes />
				<div class="dropdown dropdown-top">
					<span class="text-sm cursor-pointer" tabindex="-1">
						Kategori:
						<div class="badge badge-neutral">Matrett</div>
					</span>
					<p
						class="dropdown-content z-[10] flex flex-row gap-2 items-center bg-base-300 text-xs p-4 rounded w-48"
					>
						<Icons iconName="zondicons:wrench" height="0.75rem" />
						Her kan man snart endre søkskategori
					</p>
				</div>
			</div>
			<a href="/dishes/add">
				<button class="btn btn-primary gap-2 text-white">
					<span class="hidden lg:block">Legg til</span>
					<Icons iconName="zondicons:add-solid" />
				</button></a
			>
		</div>
	</div>
	{#if viewMode === 'table'}
		{#if !data}
			<div>"Ingen middager"</div>
		{:else}
			<div class=" pt-5 pb-12 flex items-center justify-center">
				<Table bind:dishes={filteredDishes} />
			</div>
		{/if}
	{:else if viewMode === 'card'}
		<div
			class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 lg:grid-cols-3 gap-8 lg:gap-16 mt-12 p-4 lg:w-[80%] w-full overflow-y-auto h-[80%]"
		>
			{#each filteredDishes as dish}
				<Card {dish} />
			{/each}
		</div>
	{/if}
</section>
