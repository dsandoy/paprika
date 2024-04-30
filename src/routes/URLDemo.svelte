<script lang="ts">
	import DishImage from '$lib/components/dish/DishImage.svelte';
	import { demoDishes } from './demodata';

	const dish = $demoDishes[4];
</script>

<section class="flex flex-col justify-center items-center gap-8">
	<div class="flex flex-col justify-center items-center gap-4">
		<h3 class="text-3xl">2. Hvordan lager jeg det?</h3>
		<p class="">Gå enkelt til oppskriften fra Paprika!</p>
	</div>
	<a href={dish.url}>
		<button class="flex flex-row gap-2 p-2 items-center w-full lg:w-64 bg-white rounded">
			<DishImage classNames="h-11 w-11" imagesrc={dish.customImage} />
			<p class="text-sm">{dish.name}</p>
		</button>
	</a>
</section>
