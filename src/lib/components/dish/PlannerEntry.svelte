<script lang="ts">
	import Checkbox from '../Checkbox.svelte';
	import type { Dish, PlanEntry } from '$lib/types.js';
	import { DateHandler } from '$lib/utils';
	import Dropdown from '../Dropdown.svelte';
	import { collectionStore, userStore } from 'sveltefire';
	import { DishQueries, auth, firestore } from '$lib/Firebase';
	import DishSearch from '../DishSearch.svelte';
	import { Timestamp } from 'firebase/firestore';
	import DishImage from './DishImage.svelte';

	export let plannerEntry: PlanEntry = {
		date: Timestamp.now(),
		dish: {
			name: 'Sushi Bowl',
			user: 'user', // not relevant
			url: '',
			customImage:
				'https://firebasestorage.googleapis.com/v0/b/paprika-dsa.appspot.com/o/dishes%2F62-Rectangle%2073.png?alt=media&token=8cd3427e-69ac-4925-8d3c-3db72e3a0ad6'
		}
	};

	const user = userStore(auth);
	const dishes = collectionStore<Dish>(firestore, DishQueries.dishes($user));
	let isOpen = false;

	let sortedDishes = $dishes;
	$: sortedDishes = $dishes;

	function updateDish(dish: Dish) {
		plannerEntry.dish = dish;
		plannerEntry = plannerEntry;
	}
</script>

<div class="flex flex-row w-[26rem] gap-5 align-center items-center p-4">
	<Checkbox bind:checked={plannerEntry.checked} />
	<p class="w-24 text-sm text-center">{DateHandler.showDate(plannerEntry.date)}</p>
	<Dropdown
		bind:isOpen
		classNamesButton="flex items-center gap-3 cursor-pointer"
		classNamesContent="absolute bg-white border-[1px] border-green rounded z-10 text-black right-[-19rem] bottom-[-8rem] p-5 w-[18rem] h-[22rem]"
		relative
	>
		<div
			data-ui={isOpen}
			class="border-[1px] border-grey-300 flex flex-row h-14 w-64 gap-4 rounded data-isOpen:border-green align-center items-center hover:border-green p-2"
			slot="button"
		>
			{#if plannerEntry.dish}
				<DishImage
					imagesrc={plannerEntry.dish.customImage}
					classNames="w-10 lg:w-11 h-10 lg:h-11"
				/>

				<p class="text-base">{plannerEntry.dish.name}</p>
			{/if}
		</div>
		<div slot="content">
			<div class="absolute left-[-1rem] bottom-[9.3rem] h-4 w-4 z-20">
				<div
					class="absolute z-30 top-0 left-1/2 transform -translate-x-1/2 w-0 h-0 border-t-[10px] border-b-[10px] border-r-[15px] border-b-transparent border-t-transparent border-r-green"
				></div>
			</div>
			<section class="h-16">Legg til Middag: {DateHandler.showDate(plannerEntry.date)}</section>

			<DishSearch bind:dishes={sortedDishes} />
			<div class="overflow-y-auto h-[10rem]">
				{#each sortedDishes as dish}
					<button
						on:click={() => updateDish(dish)}
						data-ui={plannerEntry.dish === dish}
						class="flex flex-row gap-6 text-sm hover:bg-gray-200 cursor-pointer p-2 w-full data-isOpen:bg-gray-200"
					>
						<DishImage classNames="rounded h-8 lg:h-10 w-8 lg:w-10" imagesrc={dish.customImage} />

						<p class="mt-3">{dish.name}</p>
					</button>
				{/each}
			</div>
		</div></Dropdown
	>
</div>
