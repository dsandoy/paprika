<script lang="ts">
	import { PlanQueries, auth, firestore } from '$lib/Firebase';
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
		PlansHandler.CreateMissingPlans($user);
	});

	/** Checks all plans, set next to true to check for next week*/
	function checkAll(next = false) {
		// TODO
	}
	/** unchecks all plans. Set Next to true to check for next week*/
	function unCheckAll(next = false) {}
</script>

<section class="w-full h-[93svh] flex flex-col items-center left-0 right-0 gap-5">
	<h1 class="text-3xl lg:text-5xl rounded mt-20 lg:mt-24">Middagsplanlegger</h1>
	<!-- This week -->
	<section>
		{#if $currentPlans}
			{#each $currentPlans as plannerEntry}
				<PlannerEntry {plannerEntry} />
			{/each}
		{/if}
	</section>
	<!-- next week -->
	<section>
		{#if $nextWeekPlans}
			{#each $nextWeekPlans as plannerEntry}
				<PlannerEntry {plannerEntry} />
			{/each}
		{/if}
	</section>
</section>
