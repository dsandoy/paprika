<script lang="ts">
	import type { Dish } from '$lib/types';
	import Button from '../Button.svelte';
	import Icons from '../Icons.svelte';
	import DishImage from './DishImage.svelte';

	/** The dish to display on the card */
	export let dish: Dish;
</script>

<div
	class="flex items-center justify-center flex-col gap-3 p-4 border-[1px] border-gray-200 rounded bg-white"
>
	<div>
		<a href="dishes/edit/{dish.name}" title="Endre matrett">
			<DishImage
				imagesrc={dish.customImage}
				classNames="
     h-30 w-32 lg:h-40 lg:w-44"
			/>
		</a>
	</div>
	<div class="flex items-center justify-center flex-row gap-2 lg:gap-3">
		<h2 class=" text-sm lg:text-base">{dish.name}</h2>
		<Button classNames="rounded-lg w-8 h-8 bg-green text-white"
			><a href={dish.url}><Icons height="1rem" /></a></Button
		>
	</div>
</div>
