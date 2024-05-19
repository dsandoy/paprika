<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Checkbox from '$lib/components/Checkbox.svelte';
	import Loading from '$lib/components/Loading.svelte';
	import PlannerEntry from '$lib/components/dish/PlannerEntry.svelte';
	import { currentPlans, dishes, nextWeekPlans } from '$lib/stores';
	import { onMount } from 'svelte';

	export let data;

	let loading = false;
	let updateLoading = false;

	onMount(() => {
		// create missing plans for current and next week..
		loading = true;
		dishes.set(data.dishes);
		currentPlans.set(data.thisWeekPlans);
		nextWeekPlans.set(data.nextWeekPlans);
		loading = false;
	});

	let allCheckedThis = false;
	let allCheckedNext = false;

	function checkAll(next = false) {
		if (next) {
			allCheckedNext = !allCheckedNext;
			const list = $nextWeekPlans;
			list.forEach((p) => (p.checked = allCheckedNext));
			nextWeekPlans.set(list);
		} else {
			allCheckedThis = !allCheckedThis;
			const list = $currentPlans;
			list.forEach((p) => (p.checked = allCheckedThis));
			currentPlans.set(list);
		}
	}
</script>

<section
	class="absolute top-16 bottom-0 left-0 right-0 flex flex-col items-center gap-5 bg-base-100"
>
	<h1 class="text-3xl lg:text-5xl rounded mt-8 mb-8">Middagsplanlegger</h1>
	<Loading bind:loading>
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:w-auto">
			<!-- This week -->
			<section class="flex flex-col items-center relative">
				<div
					class="flex gap-8 lg:gap-12 p-4 justify-center items-center border-b-2 border-b-base-300"
				>
					<Button classNames="flex gap-4 w-auto" on:click={() => checkAll()}>
						<Checkbox bind:checked={allCheckedThis} disableCheckToggle></Checkbox>
						<p class="text-xs">Velg alle</p>
					</Button>
					<h3 class="text-sm">Denne uka</h3>
					<button class="text-xs h-auto w-auto p-2 btn btn-primary btn-outline">
						<Loading bind:loading={updateLoading}>Lag Handleliste</Loading>
					</button>
				</div>
				{#if $currentPlans}
					{#each $currentPlans as plannerEntry}
						<PlannerEntry bind:plannerEntry />
					{/each}
				{/if}
				<div class="lg:hidden h-[2px] w-[90%] mt-8 bg-gray-300"></div>
			</section>
			<!-- next week -->
			<section class="flex flex-col items-center relative">
				<div
					class="flex gap-8 lg:gap-12 p-4 justify-center items-center border-b-2 border-b-base-300"
				>
					<Button classNames="flex gap-4 w-auto" on:click={() => checkAll(true)}>
						<Checkbox bind:checked={allCheckedNext} disableCheckToggle></Checkbox>
						<p class="text-xs">Velg alle</p>
					</Button>
					<h3 class="text-sm">Neste Uke</h3>
					<button class="text-xs h-auto w-auto p-2 btn btn-primary btn-outline"
						>Lag Handleliste</button
					>
				</div>
				{#if $nextWeekPlans}
					{#each $nextWeekPlans as plannerEntry}
						<PlannerEntry {plannerEntry} />
					{/each}
				{/if}
			</section>
		</div>
	</Loading>
</section>
