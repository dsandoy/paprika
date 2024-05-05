<script lang="ts">
	import type { Dish } from '$lib/types';
	import Icons from './Icons.svelte';

	/** word that is searched for*/
	export let searchWord: string = '';
	/** the dishes that should be filtered */
	export let dishes: Dish[] = [];
	/** the output of the search function*/
	export let filteredDishes: Dish[] = [];

	/** returns the dishes matching the search word. Not case sensitive*/
	function search() {
		if (!searchWord) {
			filteredDishes = dishes;
			return;
		}
		filteredDishes = dishes.filter((dish) =>
			dish.name.toLowerCase().includes(searchWord.toLowerCase())
		);
	}
	$: search(), dishes;
	$: search(), searchWord;
</script>

<label class="input input-bordered input-primary rounded flex items-center gap-2">
	<input placeholder="Søk" type="text" class="grow" bind:value={searchWord} />
	<Icons iconName="zondicons:search" height="1.5rem" classNames="text-green" />
</label>
