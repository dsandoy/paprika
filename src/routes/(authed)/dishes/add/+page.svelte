<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import type { Ingredient } from '$lib/types';
	import { ingredients } from '$lib/stores';

	export let formData;

	let ingredient: Ingredient = { value: '' };

	/** add ingredient to ingredients list */
	const addIngrendient = () => {
		if (!ingredient.value) return;
		if ($ingredients.some((i) => i.value === ingredient.value)) return;

		const ingredientCopy = { ...ingredient };
		$ingredients.push(ingredientCopy);
		ingredient = { value: '' };
		$ingredients = $ingredients;
	};
</script>

<section class="flex flex-col items-center justify-center">
	<h2 class="mb-12 mt-12">Legg til ny Matrett</h2>
	<form
		use:enhance
		class="w-[80%] md:w-[60%] xl:w-[40%] flex flex-col justify-center items-center"
		method="post"
		action="/dishes/add"
	>
		<!-- set name  -->
		<input class="input" type="text" name="name" placeholder="Navn" />
		<!-- set recipe url -->
		<input class="input" type="text" name="url" placeholder="Link til oppskrift" />

		<!-- upload image -->
		<div class="flex flex-row w-full mb-5">
			<label class=" px-5 flex items-center justify-center text-gray-400" for="image"
				>Last opp Bilde:</label
			>
			<input
				class="rounded-lg py-2 px-5 block cursor-pointer"
				type="file"
				name="image"
				accept="image/*"
			/>
		</div>
		<!-- ingredients -->
		<div class=" w-full border-[1px] p-5 rounded border-grey-300 flex flex-row mb-6">
			<div class="flex flex-col w-[50%] items-center">
				<input
					class="input"
					type="text"
					name="ingredients"
					bind:value={ingredient.value}
					placeholder="Ingrediens"
				/>
				<button class="btn-primary w-32" on:click={addIngrendient}>Legg til</button>
			</div>
			<div class="w-[50%] pl-5">
				<h3 class="px-5 text-gray-400">ingredienser</h3>
				{#each $ingredients as ingredient}
					<button
						class="block hover:bg-red hover:text-white rounded-lg pl-5 pr-5"
						on:click={() => ($ingredients = $ingredients.filter((i) => i !== ingredient))}
						>{ingredient.value}</button
					>
				{/each}
			</div>
			<!-- include ingredients -->
			<input type="hidden" value={ingredients} />
		</div>
		<button class="btn-secondary w-48">Legg til matrett</button>
	</form>
</section>
