<script lang="ts">
	import { DBService, DBShoppingList, DishQueries, ListQueries, PlanQueries } from '$lib/Firebase';
	import Button from '$lib/components/Button.svelte';
	import Checkbox from '$lib/components/Checkbox.svelte';
	import Loading from '$lib/components/Loading.svelte';
	import SecondaryButton from '$lib/components/SecondaryButton.svelte';
	import PlannerEntry from '$lib/components/dish/PlannerEntry.svelte';
	import { NoDocumentError } from '$lib/errors';
	import { currentPlans, dishes, nextWeekPlans, shoppingList, user } from '$lib/stores';
	import type { Dish, PlanEntry } from '$lib/types';
	import { DateHandler, PlansHandler, ShoppingListHandler } from '$lib/utils';
	import { onMount } from 'svelte';

	const nextWeek = DateHandler.getWeek(DateHandler.getNextMonday(new Date()));
	const currentWeek = DateHandler.getWeek(new Date());

	let loading = false;
	let updateLoading = false;

	onMount(() => {
		// create missing plans for current and next week..
		loading = true;
		if ($user) {
			const date = DateHandler.getNextMonday(DateHandler.getDayNDaysAway(new Date(), -7));
			PlansHandler.CreateMissingPlans($user, date);
			PlansHandler.CreateMissingPlans($user);
		}
		loading = false;
	});

	function getPlans() {
		if ($user) {
			const q = PlanQueries.getPlans($user, currentWeek);
			DBService.getResources(q).then((result) => {
				currentPlans.set(result as PlanEntry[]);
			});
			const q2 = PlanQueries.getPlans($user, nextWeek);
			DBService.getResources(q2).then((result) => {
				nextWeekPlans.set(result as PlanEntry[]);
			});
		}
	}

	async function getShoppingList() {
		loading = true;
		if (!$user) {
			console.log('user not loaded yet or not logged in');
			return;
		}
		try {
			const q = ListQueries.get($user);
			try {
				const list = await DBShoppingList.get(q);
				shoppingList.set(list);
				console.log('fetched shoppinglist');
				loading = false;
			} catch (error) {
				if (error instanceof NoDocumentError) {
					await createShoppingList();
				} else console.error(error);
			}
		} catch (error) {
			// should not happen but just in case
			console.error(error);
		}
	}

	async function createShoppingList() {
		try {
			await DBShoppingList.create($user);
			console.log('created new shoppinglist');
		} catch (error) {
			console.error(error);
		}
	}

	async function updateShoppingList(next = false) {
		updateLoading = true;
		const plans = next ? $nextWeekPlans : $currentPlans;
		await getShoppingList();
		const dishesToAdd = PlansHandler.extractCheckedDishes(plans, $dishes);
		if (!dishesToAdd || dishesToAdd.length === 0) {
			updateLoading = false;
			return;
		}

		let list = $shoppingList.list;
		dishesToAdd.forEach((d) => {
			try {
				list = ShoppingListHandler.addIngredients(list, d);
			} catch (error) {
				console.warn(error);
			}
		});
		$shoppingList.list = list;
		await DBShoppingList.update($shoppingList);
		updateLoading = false;
	}

	function getDishes() {
		const q = DishQueries.dishes($user);
		DBService.getResources(q).then((result) => {
			dishes.set(result as Dish[]);
		});
	}
	$: getDishes(), $user;
	$: getPlans(), $user;

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

<section class="w-full min-h-[93svh] flex flex-col items-center left-0 right-0 gap-5 bg-green-50">
	<h1 class="text-3xl lg:text-5xl rounded mt-8 mb-8">Middagsplanlegger</h1>
	<Loading bind:loading>
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:w-auto">
			<!-- This week -->
			<section class="flex flex-col items-center relative">
				<div
					class="flex gap-8 lg:gap-12 p-4 justify-center items-center border-b-2 border-b-gray-200"
				>
					<Button classNames="flex gap-4 w-auto" on:click={() => checkAll()}>
						<Checkbox bind:checked={allCheckedThis} disableCheckToggle></Checkbox>
						<p class="text-xs">Velg alle</p>
					</Button>
					<h3 class="text-sm">Denne uka</h3>
					<SecondaryButton
						on:click={() => updateShoppingList()}
						classNames="text-xs h-auto w-auto p-2 rounded-[15px]"
					>
						<Loading bind:loading={updateLoading}>Lag Handleliste</Loading>
					</SecondaryButton>
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
					class="flex gap-8 lg:gap-12 p-4 justify-center items-center border-b-2 border-b-gray-200"
				>
					<Button classNames="flex gap-4 w-auto" on:click={() => checkAll(true)}>
						<Checkbox bind:checked={allCheckedNext} disableCheckToggle></Checkbox>
						<p class="text-xs">Velg alle</p>
					</Button>
					<h3 class="text-sm">Neste Uke</h3>
					<SecondaryButton classNames="text-xs h-auto w-auto p-2 rounded-[15px]"
						>Lag Handleliste</SecondaryButton
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
