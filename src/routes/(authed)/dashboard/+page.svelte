<script lang="ts">
	import BottomCircles from '$lib/components/BottomCircles.svelte';
	import DishImage from '$lib/components/dish/DishImage.svelte';
	import { closePlans, dishes, user } from '$lib/stores';
	import type { Dish } from '$lib/types';
	import { ValueError } from '$lib/errors';
	import Loading from '$lib/components/Loading.svelte';
	import Icons from '$lib/components/Icons.svelte';
	import { navigations } from '$lib/utils';
	import { DemoData } from '../../demodata';

	let loadDinners = false;

	function getDishes() {
		dishes.set(DemoData.dishes);
	}

	async function fetchDishPlan() {
		closePlans.set(DemoData.dishPlans);
	}

	function fetchDish(dishId: string) {
		const dish = $dishes.find((d) => d.id === dishId);
		if (!dish) throw new ValueError('dish not found in dishes!');
		return dish;
	}

	function getName(dish: Dish) {
		try {
			return dish.name;
		} catch {
			return 'ingenting planlagt';
		}
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

<main class="flex flex-col items-center left-0 right-0 absolute top-16 bottom-0 gap-2">
	<!-- what is for dinner ?  -->
	<div class="w-full p-4 mt-4">
		<h1 class="text-2xl lg:text-3xl lg:text-center">Dashbord</h1>
		<div class="flex flex-row gap-5 items-center justify-center pt-4">
			{#each navigations as nav}
				<a
					class="text-sm p-4 lg:pl-6 lg:pr-6 gap-2 rounded flex flex-col items-center justify-center bg-white hover:bg-grey-100"
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
				<h1 class="text-xl lg:text-2xl lg:text-center">Lag Middag</h1>
				<div class="flex flex-col lg:flex-row gap-2 lg:gap-8 lg:items-center lg:justify-center">
					<a href={getUrl($closePlans[0])}>
						<button
							class="flex flex-row gap-2 p-2 items-center w-full lg:w-64 bg-white hover:bg-grey-100 rounded"
						>
							<DishImage classNames="h-11 w-11" imagesrc={getimageURL($closePlans[0])} />
							<p class="text-xs text-slate-400">I går</p>
							<p class="text-sm text-slate-400">{getName($closePlans[0])}</p>
						</button>
					</a>
					<a href={getUrl($closePlans[1])}>
						<button
							class="flex flex-row gap-3 p-2 items-center rounded w-full lg:w-64 bg-nice-blue/20 hover:bg-nice-blue/40"
						>
							<DishImage classNames="h-11 w-11" imagesrc={getimageURL($closePlans[1])} />
							<p class="text-sm text-nice-blue/70 font-semibold">I dag</p>
							<p class="text-base">{getName($closePlans[1])}</p>
						</button>
					</a>
					<a href={getUrl($closePlans[2])}>
						<button
							class="flex flex-row gap-2 p-2 items-center w-full lg:w-64 bg-white hover:bg-grey-100 rounded"
						>
							<DishImage classNames="h-11 w-11" imagesrc={getimageURL($closePlans[2])} />
							<p class="text-xs text-slate-400">I morgen</p>
							<p class="text-sm text-slate-400">{getName($closePlans[2])}</p>
						</button>
					</a>
				</div>
			</section>
		{/if}
	</Loading>

	<BottomCircles></BottomCircles>
</main>
