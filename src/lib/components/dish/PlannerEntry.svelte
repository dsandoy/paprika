<script lang="ts">
	import Checkbox from '../Checkbox.svelte';
	import type { Dish, PlanEntry } from '$lib/types.js';
	import { DateHandler } from '$lib/utils';
	import Dropdown from '../Dropdown.svelte';
	import { collectionStore, userStore } from 'sveltefire';
	import { DBService, DishQueries, auth, firestore } from '$lib/Firebase';
	import DishSearch from '../DishSearch.svelte';
	import { Timestamp } from 'firebase/firestore';
	import DishImage from './DishImage.svelte';

	export let plannerEntry: PlanEntry = {
		date: Timestamp.now()
	};

	const user = userStore(auth);
	const dishes = collectionStore<Dish>(firestore, DishQueries.dishes($user));
	let isOpen = false;

	let sortedDishes = $dishes;
	$: sortedDishes = $dishes;

	let chosenDish: Dish | undefined = undefined;
	$: chosenDish = plannerEntry.dish ? $dishes.find((d) => d.id === plannerEntry.dish) : undefined;

	function updateDish(dish: Dish) {
		if (plannerEntry.dish === dish.id) return;
		if (smallSize) {
			isOpen = false;
		}
		plannerEntry.dish = dish.id;
		plannerEntry = plannerEntry;
		DBService.updatePlanEntry(plannerEntry);
	}
	let smallSize = window.matchMedia('(max-width: 800px)').matches;
	$: smallSize = window.matchMedia('(max-width: 800px)').matches;
</script>

<div class="flex flex-row w-[100%] lg:w-[26rem] gap-5 align-center items-center p-4">
	<Checkbox bind:checked={plannerEntry.checked} />
	<p class="lg:w-24 text-sm text-center">{DateHandler.showDate(plannerEntry.date)}</p>
	<Dropdown
		bind:isOpen
		classNamesButton="flex items-center gap-3 cursor-pointer"
		classNamesContent="absolute bg-white border-[1px] border-green rounded z-10 text-black lg:right-[-19rem] lg:bottom-[-8rem] right-[3rem] bottom-[8rem] p-5 w-[18rem] h-[22rem]"
		relative={!smallSize}
	>
		<!-- dropdown "button" -->
		<div
			data-ui={isOpen}
			class="border-[1px] border-grey-300 flex flex-row h-14 w-64 gap-4 rounded data-isOpen:border-green align-center items-center hover:border-green p-2"
			slot="button"
		>
			{#if chosenDish}
				<DishImage imagesrc={chosenDish.customImage} classNames="w-10 lg:w-11 h-10 lg:h-11" />

				<p class="text-base">{chosenDish.name}</p>
			{/if}
		</div>
		<!-- the change dish dropdown content  -->
		<div slot="content">
			<!-- add arrow if big screen -->
			{#if !smallSize}
				<div class="absolute left-[-1rem] bottom-[9.3rem] h-4 w-4 z-20">
					<div
						class="absolute z-30 top-0 left-1/2 transform -translate-x-1/2 w-0 h-0 border-t-[10px] border-b-[10px] border-r-[15px] border-b-transparent border-t-transparent border-r-green"
					></div>
				</div>
			{/if}

			<h3 class="h-16">Legg til Middag: {DateHandler.showDate(plannerEntry.date)}</h3>
			<DishSearch bind:dishes={sortedDishes} />
			<div class="overflow-y-auto h-[10rem]">
				{#each sortedDishes as dish}
					<button
						on:click={() => updateDish(dish)}
						data-ui={chosenDish === dish}
						class="flex flex-row gap-6 text-sm hover:bg-gray-200 cursor-pointer p-2 w-full data-isOpen:bg-gray-200 data-isOpen:cursor-default"
					>
						<DishImage classNames="rounded h-8 lg:h-10 w-8 lg:w-10" imagesrc={dish.customImage} />

						<p class="mt-3">{dish.name}</p>
					</button>
				{/each}
			</div>
		</div></Dropdown
	>
</div>
