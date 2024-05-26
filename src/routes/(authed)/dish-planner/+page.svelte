<script lang="ts">
	import Checkbox from '$lib/components/Checkbox.svelte';
	import Icons from '$lib/components/Icons.svelte';
	import Loading from '$lib/components/Loading.svelte';
	import PlannerEntry from '$lib/components/dish/PlannerEntry.svelte';
	import { currentPlans, dishes } from '$lib/stores';
	import type { ReadPlan } from '$lib/types.js';
	import { DateHandler } from '$lib/utils';
	import { onMount } from 'svelte';

	export let data;

	let loading = false;
	let updateLoading = false;
	let modal: HTMLDialogElement;
	let hasCreatedShoppingList = false;

	onMount(() => {
		// create missing plans for current and next week..
		loading = true;
		dishes.set(data.dishes);
		currentPlans.set(data.plans);
		loading = false;
	});

	let allCheckedThis = false;

	function checkAll() {
		allCheckedThis = !allCheckedThis;
		const list = $currentPlans;
		list.forEach((p) => (p.checked = allCheckedThis));
		currentPlans.set(list);
	}

	async function updateShoppingList() {
		if (hasCreatedShoppingList) return;
		updateLoading = true;
		let checkedPlans: ReadPlan[] = $currentPlans.filter((p) => p.checked);
		if (checkedPlans.length == 0) {
			updateLoading = false;
			return;
		}

		const response = await fetch('/api/list/add-dishes', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				plans: checkedPlans,
				email: data.user.email
			})
		});

		if (response.ok) {
			console.log('ok');
			hasCreatedShoppingList = true;
		}
		updateLoading = false;
	}
</script>

<section
	class="absolute top-16 bottom-0 left-0 right-0 flex flex-col items-center gap-5 bg-base-100"
>
	<h1 class="text-3xl lg:text-5xl rounded mt-8 mb-8">Middagsplanlegger</h1>
	<div class="p-4 flex justify-end items-center">
		<button class="btn btn-primary text-white" on:click={() => modal.showModal()}>
			<Icons iconName="zondicons:list-add" height="1.5rem" />
			Generer Handleliste</button
		>
	</div>
	<Loading bind:loading>
		<div>
			<!-- This week -->
			<section>
				<ul class="timeline timeline-vertical timeline-compact">
					{#if $currentPlans}
						{#each $currentPlans as plannerEntry}
							<PlannerEntry bind:plannerEntry />
						{/each}
					{/if}
				</ul>
			</section>
		</div>
	</Loading>
</section>

<dialog bind:this={modal} class="modal">
	<div class="modal-box">
		<h3 class="font-bold text-lg">Generer handleliste</h3>
		{#if hasCreatedShoppingList}
			<div class="flex flex-col gap-4 justify-center items-center">
				<Icons iconName="zondicons:checkmark-outline" height="3.5rem" classNames="text-success" />
				<p>Du har generert handlelisten!</p>
				<div class="flex flex-row gap-4">
					<a href="/shopping-list" class="btn btn-primary w-52 text-white">La meg se</a>
					<button class="btn btn-secondary" on:click={() => (hasCreatedShoppingList = false)}>
						<Icons iconName="zondicons:refresh" height="1.5rem" />
						Generer igjen</button
					>
					<form method="dialog">
						<button class="btn btn-accent">Lukk</button>
					</form>
				</div>
			</div>
		{:else}
			<p class="py-4 text-sm">Velg alle matrettene du vil handle for</p>
			<button on:click={checkAll} class="btn btn-neutral mb-4">Velg Alle</button>
			<div class="max-h-96 text-sm overflow-y-auto flex flex-col gap-2">
				{#each $currentPlans as plan}
					{#if (DateHandler.isTimestampToday(plan.date) == 'after' || DateHandler.isTimestampToday(plan.date) == 'today') && plan.dish}
						<button
							data-ui={plan.checked}
							class="flex gap-2 bg-base-200 data-isOpen:bg-primary p-2 rounded-sm"
							on:click={() => (plan.checked = !plan.checked)}
						>
							<Checkbox bind:checked={plan.checked} disableCheckToggle />
							<p>{DateHandler.showDate(plan.date)}</p>
							<img alt="dish" src={`/api/dishes/${plan.dishId}/image/`} class="h-8 w-8 rounded" />
							<p>{plan.dish.name}</p>
						</button>
					{/if}
				{/each}
			</div>
			<div class="modal-action">
				<button
					class="btn btn-primary text-white w-52 lg:w-64"
					on:click={() => updateShoppingList()}
				>
					<Loading bind:loading={updateLoading}>
						<Icons iconName="zondicons:list-add" height="1.5rem" />
						Generer
					</Loading>
				</button>
				<form method="dialog">
					<button class="btn btn-accent">Tilbake</button>
				</form>
			</div>
		{/if}
	</div>
	<form method="dialog" class="modal-backdrop">
		<button></button>
	</form>
</dialog>
