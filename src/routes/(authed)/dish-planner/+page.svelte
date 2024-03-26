<script lang="ts">
	import { PlanQueries, auth, firestore } from '$lib/Firebase';
	import Button from '$lib/components/Button.svelte';
	import Checkbox from '$lib/components/Checkbox.svelte';
	import SecondaryButton from '$lib/components/SecondaryButton.svelte';
	import PlannerEntry from '$lib/components/dish/PlannerEntry.svelte';
	import { DateHandler, PlansHandler } from '$lib/utils';
	import { onMount } from 'svelte';
	import { collectionStore, userStore } from 'sveltefire';

	const currentWeek = DateHandler.getWeek(new Date());
	const nextWeek = DateHandler.getWeek(DateHandler.getNextMonday(new Date()));
	const user = userStore(auth);
	const currentPlans = collectionStore(firestore, PlanQueries.getPlans($user, currentWeek));
	const nextWeekPlans = collectionStore(firestore, PlanQueries.getPlans($user, nextWeek));

	onMount(() => {
		const date = DateHandler.getNextMonday(DateHandler.getDayNDaysAway(new Date(), -7));
		PlansHandler.CreateMissingPlans($user, date);
		PlansHandler.CreateMissingPlans($user);
	});

	let allCheckedThis = false;
	let allCheckedNext = false;

	/** Checks or unchecks all plans, set next to true to check for next week*/
	function checkAll(next = false) {
		if (next) {
			allCheckedNext = !allCheckedNext;
			// todo
		} else {
			allCheckedThis = !allCheckedThis;
		}
	}
</script>

<section class="w-full h-[93svh] flex flex-col items-center left-0 right-0 gap-5">
	<h1 class="text-3xl lg:text-5xl rounded mt-8 mb-8">Middagsplanlegger</h1>
	<div class="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:w-auto">
		<!-- This week -->
		<section class="w-[90%] lg:w-auto">
			<div
				class="flex gap-8 lg:gap-12 pb-3 justify-center items-center border-b-2 border-b-gray-200"
			>
				<Button classNames="flex gap-4 w-auto" on:click={() => checkAll()}>
					<Checkbox bind:checked={allCheckedThis}></Checkbox>
					<p class="text-sm">Velg alle</p>
				</Button>
				<h3>Denne uka</h3>
				<SecondaryButton classNames="text-xs h-auto w-auto p-2">Lag Handleliste</SecondaryButton>
			</div>
			{#if $currentPlans}
				{#each $currentPlans as plannerEntry}
					<PlannerEntry {plannerEntry} />
				{/each}
			{/if}
		</section>
		<!-- next week -->
		<section>
			<div class="flex gap-12 pb-3 justify-center items-center border-b-2 border-b-gray-200">
				<Button classNames="flex gap-4 w-auto" on:click={() => checkAll(true)}>
					<Checkbox bind:checked={allCheckedNext}></Checkbox>
					<p class="text-sm">Velg alle</p>
				</Button>
				<h3>Neste Uke</h3>
				<SecondaryButton classNames="text-sm h-auto w-auto p-2">Lag Handleliste</SecondaryButton>
			</div>
			{#if $nextWeekPlans}
				{#each $nextWeekPlans as plannerEntry}
					<PlannerEntry {plannerEntry} />
				{/each}
			{/if}
		</section>
	</div>
</section>
