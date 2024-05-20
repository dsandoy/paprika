<script lang="ts">
	import Checkbox from '../Checkbox.svelte';
	import type { Note, ReadDish, ReadPlan } from '$lib/types.js';
	import { DateHandler } from '$lib/utils';
	import DishImage from './DishImage.svelte';
	import { dishes } from '$lib/stores';
	import DishSearch from '../DishSearch.svelte';
	import Icons from '../Icons.svelte';

	export let plannerEntry: ReadPlan;

	export let filteredDishes: ReadDish[] = [];
	let note = plannerEntry.note || '';

	let chosenDish: ReadDish | null | Note | undefined = plannerEntry.dish;

	function fetchDish() {
		chosenDish = plannerEntry.dish;
		if (chosenDish === null) {
			chosenDish = plannerEntry.note;
		}
		if (chosenDish === undefined) {
			chosenDish = null;
		}
	}

	fetchDish();
	export let searchWord = '';
	// $: fetchDish(), $dishes;

	async function setChosenDish(dish: ReadDish) {
		if (chosenDish !== dish) {
			chosenDish = dish;
		} else {
			chosenDish = null;
		}

		plannerEntry.note = null;

		const response = await fetch('/api/plans/update', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				plan: plannerEntry,
				dishId: chosenDish?.id
			})
		});
		if (response.ok) {
			console.log('updated');
		}
	}

	async function removeNote() {
		note = '';
		chosenDish = null;
		plannerEntry.note = null;
		const response = await fetch('/api/plans/update', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				plan: plannerEntry,
				dishId: null
			})
		});
		if (response.ok) {
			console.log('updated');
		}
	}

	async function addNote() {
		chosenDish = note;
		plannerEntry.note = note;
		const response = await fetch('/api/plans/update', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				plan: plannerEntry,
				dishId: null
			})
		});
		if (response.ok) {
			console.log('updated');
		}
	}
</script>

<div class="flex flex-row justify-center items-center p-4 gap-2">
	<Checkbox bind:checked={plannerEntry.checked} />
	<p
		class="lg:w-24 w-16 text-sm text-center"
		class:text-gray-500={DateHandler.isTimestampToday(plannerEntry.date) === 'before'}
	>
		{DateHandler.showDate(plannerEntry.date)}
	</p>

	<!-- dish dropdown -->
	<section class="dropdown">
		<div
			class="border-[1px] border-base-300 flex flex-row h-14 w-52 lg:w-64 gap-4 rounded align-center items-center hover:border-primary p-2 bg-base-200 cursor-pointer"
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
			</div>
		</ul>
	</section>
	<!-- note dropdown -->
	<section class="dropdown dropdown-end">
		<div class="p-1 text-neutral cursor-pointer" tabindex="-1">
			<Icons iconName="zondicons:compose" />
		</div>

		<div class="dropdown-content shadow p-2 rounded bg-base-200 z-10">
			<strong>Legg til notat</strong>
			<input
				type="text"
				bind:value={note}
				placeholder="Legg til notat"
				class="input input-sm input-primary mt-3 mb-3"
			/>
			<div class="flex items-center justify-between">
				<button class="btn btn-neutral" on:click={addNote}>Legg til</button>
				<button class="btn btn-accent" on:click={removeNote}>Fjern</button>
			</div>
		</div>
	</section>
</div>
