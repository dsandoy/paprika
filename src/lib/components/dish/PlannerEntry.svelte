<script lang="ts">
	import Checkbox from '../Checkbox.svelte';
	import type { ReadDish, ReadPlan } from '$lib/types.js';
	import { DateHandler } from '$lib/utils';
	import DishImage from './DishImage.svelte';

	export let plannerEntry: ReadPlan;

	let isOpen = false;

	let chosenDish: ReadDish | null = null;

	function fetchDish() {
		// chosenDish = plannerEntry.dish ? $dishes.find((d) => d.id === plannerEntry.dish) : undefined;
		chosenDish = plannerEntry.dish;
	}

	fetchDish();
	// $: fetchDish(), $dishes;
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
	<div
		data-ui={isOpen}
		class="border-[1px] border-grey-300 flex flex-row h-14 w-60 lg:w-64 gap-4 rounded data-isOpen:border-green align-center items-center hover:border-green p-2 bg-white"
	>
		{#if chosenDish}
			<DishImage imagesrc={chosenDish.customImage} classNames="w-10 lg:w-11 h-10 lg:h-11" />

			<p class="text-base">
				{chosenDish.name}
			</p>
		{/if}
	</div>
</div>
