<script lang="ts">
	import BottomCircles from '$lib/components/BottomCircles.svelte';
	import DishImage from '$lib/components/dish/DishImage.svelte';
	import { DBService, DishQueries, PlanQueries } from '$lib/Firebase';
	import { closePlans, dishes, user } from '$lib/stores';
	import { DateHandler } from '$lib/utils';
	import type { Dish, PlanEntry } from '$lib/types';
	import { ValueError } from '$lib/errors';
	import Loading from '$lib/components/Loading.svelte';
	import Icons from '$lib/components/Icons.svelte';
	import { navigations } from '$lib/utils';

	let loadDinners = false;

	function getDishes() {
		loadDinners = true;
		const q = DishQueries.dishes($user);
		DBService.getResources(q).then((result) => {
			dishes.set(result as Dish[]);
		});
	}

	async function fetchDishPlan() {
		const today = new Date();
		const dataRange = [
			DateHandler.getDayNDaysAway(today, -1),
			DateHandler.getDayNDaysAway(today, 1)
		];
		const q = PlanQueries.getPlans($user, dataRange);
		const dishPlans = (await DBService.getResources(q)) as unknown as PlanEntry[];
		if (!dishPlans) return;

		const dinnerDishes: Dish[] = [];
		dishPlans.forEach((plan) => {
			// fetch the dishes corresponding with
			if (!plan.dish) return;
			const dish = fetchDish(plan.dish);
			dinnerDishes.push(dish);
		});

		closePlans.set(dinnerDishes);
		loadDinners = false;
	}

	function fetchDish(dishId: string) {
		const dish = $dishes.find((d) => d.id === dishId);
		if (!dish) throw new ValueError('dish not found in dishes!');
		return dish;
	}

	function getimageURL(dish: Dish) {
		try {
			return dish.customImage;
		} catch {
			return '';
		}
	}

	function getUrl(dish: Dish) {
		try {
			return dish.url;
		} catch {
			return '';
		}
	}

	$: getDishes(), $user;
	$: fetchDishPlan(), $dishes;
</script>

<main class=" w-full h-[93svh] flex flex-col items-center left-0 right-0 gap-2 bg-green/10">
	<!-- what is for dinner ?  -->
	<div class="w-full p-4 mt-4">
		<h1 class="text-2xl lg:text-center">Dashbord</h1>
		<div class="flex flex-row gap-5 items-center justify-center pt-4">
			{#each navigations as nav}
				<a
					class="text-sm p-2 pl-4 pr-4 gap-2 rounded flex flex-col items-center justify-center bg-white"
					href={nav.url}
				>
					<Icons iconName={nav.icon} height="2rem" />
					{nav.name}
				</a>
			{/each}
		</div>
	</div>
	<Loading bind:loading={loadDinners}>
		{#if $closePlans}
			<section class="flex flex-col gap-4 w-full p-4">
				<h1 class="text-xl lg:text-center">Lag Middag</h1>
				<div class="flex flex-col lg:flex-row gap-2 lg:gap-8 lg:items-center lg:justify-center">
					{#if $closePlans[0]}
						<a href={getUrl($closePlans[0])}>
							<button class="flex flex-row gap-2 p-2 items-center w-full lg:w-64 bg-white rounded">
								<DishImage classNames="h-11 w-11" imagesrc={getimageURL($closePlans[0])} />
								<p class="text-xs text-slate-400">I går</p>
								<p class="text-sm text-slate-400">{$closePlans[0].name}</p>
							</button>
						</a>
					{/if}
					{#if $closePlans[1]}
						<a href={getUrl($closePlans[1])}>
							<button
								class="flex flex-row gap-3 p-2 items-center rounded w-full lg:w-64 bg-nice-blue/40"
							>
								<DishImage classNames="h-11 w-11" imagesrc={getimageURL($closePlans[1])} />
								<p class="text-sm text-nice-blue/70 font-semibold">I dag</p>
								<p class="text-base">{$closePlans[1].name}</p>
							</button>
						</a>
					{/if}
					{#if $closePlans[2]}
						<a href={getUrl($closePlans[2])}>
							<button class="flex flex-row gap-2 p-2 items-center w-full lg:w-64 bg-white rounded">
								<DishImage classNames="h-11 w-11" imagesrc={getimageURL($closePlans[2])} />
								<p class="text-xs text-slate-400">I morgen</p>
								<p class="text-sm text-slate-400">{$closePlans[2].name}</p>
							</button>
						</a>
					{/if}
				</div>
			</section>
		{/if}
	</Loading>

	<BottomCircles></BottomCircles>
</main>
