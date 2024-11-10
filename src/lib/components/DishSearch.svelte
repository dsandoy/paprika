<script lang="ts">
	import type { ReadDish } from '$lib/types';
	import Icons from './Icons.svelte';

	/** word that is searched for*/
	export let searchWord: string = '';
	/** the dishes that should be filtered */
	export let dishes: ReadDish[] = [];
	/** the output of the search function*/
	export let filteredDishes: ReadDish[] = [];

	export let classNames = '';

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

<label
	class="input input-primary min-h-10 h-10 max-h-10 min-w-52 w-52 max-w-52 p-2 flex justify-center items-center gap-2 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary"
>
	<input
		placeholder="Søk"
		type="text"
		class="{classNames} min-w-40 w-40 max-w-40"
		bind:value={searchWord}
	/>
	<Icons iconName="zondicons:search" height="1.5rem" classNames="text-green" />
</label>
