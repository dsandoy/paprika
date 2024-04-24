<script lang="ts">
	import type { Dish, PlanEntry } from '$lib/types.js';
	import { DateHandler } from '$lib/utils';
	import Dropdown from '../Dropdown.svelte';
	import DishSearch from '../DishSearch.svelte';
	import DishImage from '../dish/DishImage.svelte';
	import { demoDishes } from '../../../routes/demodata';

	export let plannerEntry: PlanEntry;

	export let isOpen = false;
	let filteredDishes: Dish[] = [];

	let chosenDish: Dish | undefined = undefined;

	function fetchDish() {
		chosenDish = plannerEntry.dish
			? $demoDishes.find((d) => d.id === plannerEntry.dish)
			: undefined;
	}

	$: fetchDish(), $demoDishes;

	function updateDish(dish: Dish) {
		if (smallSize) {
			isOpen = false;
		}
		// if the dish is already selected, unselect it
		if (plannerEntry.dish === dish.id) {
			plannerEntry.dish = '';
		} else {
			plannerEntry.dish = dish.id;
		}
		plannerEntry = plannerEntry;
		fetchDish();
	}

	// returns true if small size
	function determineWindowSize() {
		try {
			return window.matchMedia('(max-width: 800px)').matches;
		} catch {
			return;
		}
	}

	let smallSize = determineWindowSize();
	$: smallSize = determineWindowSize();
</script>

<div class="flex flex-row w-auto align-center items-center p-4">
	<p
		class="lg:w-24 w-24 text-sm text-center"
		class:text-nice-blue={DateHandler.isTimestampToday(plannerEntry.date) === 'today'}
		class:font-semibold={DateHandler.isTimestampToday(plannerEntry.date) === 'today'}
		class:text-gray-500={DateHandler.isTimestampToday(plannerEntry.date) === 'before'}
	>
		{DateHandler.showDate(plannerEntry.date)}
	</p>
	<Dropdown
		bind:isOpen
		classNamesButton="flex items-center gap-3 cursor-pointer"
		classNamesContent="absolute bg-white border-[1px] border-green rounded z-10 text-black lg:right-[-19rem] lg:bottom-[-8rem] right-[3rem] bottom-[8rem] p-5 w-[18rem] h-[22rem]"
		relative={!smallSize}
	>
		<!-- dropdown "button" -->
		<div
			data-ui={isOpen}
			class="border-[1px] border-grey-300 flex flex-row h-14 w-60 lg:w-64 gap-4 rounded data-isOpen:border-green align-center items-center hover:border-green p-2 bg-white"
			slot="button"
		>
			{#if chosenDish}
				<DishImage imagesrc={chosenDish.customImage} classNames="w-10 lg:w-11 h-10 lg:h-11" />

				<p
					class="text-base"
					class:text-nice-blue={DateHandler.isTimestampToday(plannerEntry.date) === 'today'}
					class:font-semibold={DateHandler.isTimestampToday(plannerEntry.date) === 'today'}
					class:text-gray-500={DateHandler.isTimestampToday(plannerEntry.date) === 'before'}
				>
					{chosenDish.name}
				</p>
			{:else}
				<p class="w-full">Klikk meg</p>
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

			<span class="mb-8 flex gap-8 items-center">
				<h3>Legg til Middag:</h3>
				<span class="text-sm text-gray-600">{DateHandler.showDate(plannerEntry.date)}</span>
			</span>

			<DishSearch dishes={$demoDishes} bind:filteredDishes />
			<div class="overflow-y-auto h-[10rem]">
				{#each filteredDishes as dish}
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
