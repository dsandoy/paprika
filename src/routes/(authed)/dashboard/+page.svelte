<script lang="ts">
	import BottomCircles from '$lib/components/BottomCircles.svelte';
	import DishImage from '$lib/components/dish/DishImage.svelte';
	import PrimaryButton from '$lib/components/PrimaryButton.svelte';
	import { DBService, DishQueries, PlanQueries } from '$lib/Firebase';
	import { closePlans, dishes, user } from '$lib/stores';
	import { DateHandler } from '$lib/utils';
	import type { Dish, PlanEntry } from '$lib/types';
	import { ValueError } from '$lib/errors';
	import Loading from '$lib/components/Loading.svelte';
	import SecondaryButton from '$lib/components/SecondaryButton.svelte';

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

	function displayDishName(dish: Dish | undefined) {
		if (dish) {
			return dish.name;
		}
		return '';
	}

	$: getDishes(), $user;
	$: fetchDishPlan(), $dishes;
</script>

<main class=" w-full h-[93svh] flex flex-col items-center left-0 right-0 gap-2 bg-green/10">
	<!-- what is for dinner ?  -->
	<div class="w-full p-4 mt-4">
		<h1 class="text-2xl">Dashbord</h1>
	</div>
	<Loading bind:loading={loadDinners}>
		<section class="flex flex-col gap-4 w-full p-4">
			<h1 class="text-xl">Lag Middag</h1>
			<div class="grid col-span-1 gap-2">
				<a href={$closePlans[0].url}>
					<button class="flex flex-row gap-2 p-2 items-center w-full bg-white rounded">
						<DishImage classNames="h-11 w-11" imagesrc={$closePlans[0].customImage} />
						<p class="text-xs text-slate-400">I går</p>
						<p class="text-sm text-slate-400">{displayDishName($closePlans[0])}</p>
					</button>
				</a>
				<a href={$closePlans[1].url}>
					<button class="flex flex-row gap-3 p-2 items-center rounded w-full bg-nice-blue/40">
						<DishImage classNames="h-11 w-11" imagesrc={$closePlans[1].customImage} />
						<p class="text-sm text-nice-blue/70 font-semibold">I dag</p>
						<p class="text-base">{displayDishName($closePlans[1])}</p>
					</button>
				</a>
				<a href={$closePlans[2].url}>
					<button class="flex flex-row gap-2 p-2 items-center w-full bg-white rounded">
						<DishImage classNames="h-11 w-11" imagesrc={$closePlans[2].customImage} />
						<p class="text-xs text-slate-400">I morgen</p>
						<p class="text-sm text-slate-400">{displayDishName($closePlans[2])}</p>
					</button>
				</a>
			</div>
			<a href="/dish-planner" class="flex items-center justify-center">
				<PrimaryButton classNames="w-36 text-sm">Middagsplan</PrimaryButton>
			</a>
		</section>
	</Loading>

	<section>
		<h1>Handleliste</h1>
	</section>

	<section>
		<h1>Administrer Matretter</h1>
	</section>

	<BottomCircles></BottomCircles>
</main>
