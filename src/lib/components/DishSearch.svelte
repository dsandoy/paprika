<script lang="ts">
	import type { Dish } from '$lib/types';

	export let dishes: Dish[];
	let searchWord = '';

	/** returns the dishes matching the search word. Not case sensitive*/
	function search() {
		dishes = dishes.filter((dish) => dish.name.toLowerCase().includes(searchWord.toLowerCase()));
		dishes = dishes;
	}
</script>

<input
	placeholder="Søk"
	type="text"
	class="input"
	bind:value={searchWord}
	on:change={() => search()}
/>
