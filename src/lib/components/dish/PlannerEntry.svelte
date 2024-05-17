<script lang="ts">
	import Checkbox from '../Checkbox.svelte';
	import type { Note, ReadDish, ReadPlan } from '$lib/types.js';
	import { DateHandler } from '$lib/utils';
	import DishImage from './DishImage.svelte';
	import { dishes } from '$lib/stores';
	import DishSearch from '../DishSearch.svelte';
	import Icons from '../Icons.svelte';

	export let plannerEntry: ReadPlan;

	let isOpen = false;
	export let filteredDishes: ReadDish[] = [];

	let chosenDish: ReadDish | null | Note = null;

	function fetchDish() {
		// chosenDish = plannerEntry.dish ? $dishes.find((d) => d.id === plannerEntry.dish) : undefined;
		chosenDish = plannerEntry.dish;
	}

	fetchDish();
	export let searchWord = '';
	// $: fetchDish(), $dishes;

	function setChosenDish(dish: ReadDish) {
		if (chosenDish !== dish) {
			isOpen = false;
			chosenDish = dish;
		} else {
			chosenDish = null;
		}
	}

	function addNote() {
		chosenDish = searchWord;
	}
</script>

<div class="flex flex-row lg:w-[26rem] align-center items-center p-4">
	<Checkbox bind:checked={plannerEntry.checked} />
	<p
		class="lg:w-24 w-24 text-sm text-center"
		class:text-gray-500={DateHandler.isTimestampToday(plannerEntry.date) === 'before'}
	>
		{DateHandler.showDate(plannerEntry.date)}
	</p>

	<!-- dropdown "button" -->
	<div class="dropdown">
		<div
			data-ui={isOpen}
			class="border-[1px] border-base-300 flex flex-row h-14 w-60 lg:w-64 gap-4 rounded align-center items-center hover:border-primary p-2 bg-base-200 cursor-pointer"
			tabindex="-1"
		>
			{#if chosenDish && typeof chosenDish === 'object'}
				<DishImage
					classNames="w-10 lg:w-11 h-10 lg:h-11"
					imagesrc={`/api/dishes/${chosenDish.id}/image/`}
				/>

				<p class="text-base">
					{chosenDish.name}
				</p>
			{:else if chosenDish && typeof chosenDish === 'string'}
				<div class="flex justify-center items-center pl-3 pr-3">
					<Icons iconName="zondicons:edit-pencil" classNames="text-primary" height="1.0rem" />
				</div>
				<p class="text-base">{chosenDish}</p>
			{/if}
		</div>
		<ul class="dropdown-content menu p-4 shadow bg-base-200 rounded-box z-10">
			<div class="flex gap-2 justify-between pr-4">
				<strong class="mb-4">Legg til matrett</strong>
				{DateHandler.showDate(plannerEntry.date)}
			</div>
			<button class="pb-4">
				<DishSearch bind:filteredDishes dishes={$dishes} classNames="text-sm" bind:searchWord />
			</button>
			<div class="overflow-x-auto h-60">
				{#if !filteredDishes || filteredDishes?.length === 0}
					<button class="btn btn-secondary btn-sm" on:click={addNote}>Legg til notat</button>
				{:else}
					{#each filteredDishes as dish}
						<li>
							<button
								class="flex gap-2 justify-between items-center"
								on:click={() => setChosenDish(dish)}
							>
								<p>{dish.name}</p>
								<img
									class="h-8 w-8 lg:h-10 lg:w-10 rounded"
									src={`/api/dishes/${dish.id}/image/`}
									alt="dish"
								/>
							</button>
						</li>
					{/each}
				{/if}
			</div>
		</ul>
	</div>
	<!-- dropdown content -->
</div>
