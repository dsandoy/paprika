<script lang="ts">
	import { ingredients } from '$lib/stores';
	import { DishValidator } from '$lib/utils.js';
	import PrimaryButton from '$lib/components/PrimaryButton.svelte';
	import SecondaryButton from '$lib/components/SecondaryButton.svelte';
	import BottomCircles from '$lib/components/BottomCircles.svelte';
	import { collectionStore, userStore } from 'sveltefire';
	import { DBService, DishQueries, auth, firestore } from '$lib/Firebase';
	import type { Dish } from '$lib/types.js';

	let formElement: HTMLFormElement;
	let ingredientInput: HTMLInputElement;
	let ingredient = '';

	const user = userStore(auth);
	const dishes = collectionStore<Dish>(firestore, DishQueries.dishes($user));

	/** Tell the user that the ingredient is already in the list */
	function validateIngredients() {
		if ($ingredients.some((i) => i === ingredient)) {
			ingredientInput.setCustomValidity('Denne ingrediensen er allerede lagt til');
		} else {
			ingredientInput.setCustomValidity('');
		}
		ingredientInput.reportValidity();
	}

	/** add ingredient to client kept ingredients list */
	const addIngrendient = () => {
		// prevent empty or duplicated ingredients
		if (!ingredient) return;
		if ($ingredients.some((i) => i === ingredient)) return;

		$ingredients.push(ingredient);
		ingredient = '';
		$ingredients = $ingredients;
	};

	let url_text = '';
	/** offer a validation on the url in real time... */
	function validatetheUrl() {
		const url = formElement.children.namedItem('url') as HTMLInputElement;
		if (DishValidator.validateURL(url_text) !== 0) {
			url.setCustomValidity('Linken er ikke gyldig..');
			url.reportValidity();
		} else {
			url.setCustomValidity('');
			url.reportValidity();
		}
	}

	let name_text = '';
	/** Validate the name in real time...*/
	function validatetheName() {
		const name = formElement.children.namedItem('name') as HTMLInputElement;
		const result = DishValidator.validateName(name_text, $dishes);
		if (result === DishValidator.EMPTY) {
			name.setCustomValidity('Navnet kan ikke være tomt..');
		} else if (result === DishValidator.IN_USE) {
			name.setCustomValidity('Du har allerede en matrett med dette navet');
		} else {
			name.setCustomValidity('');
		}
		name.reportValidity();
	}

	let customImageUrl: string | null = null;
	/** Let the user see the image they uploaded..*/
	function handleImageUpload(event: Event) {
		const image = (event.target as HTMLInputElement)?.files?.[0];
		if (!image) {
			customImageUrl = null;
			return;
		}
		customImageUrl = URL.createObjectURL(image);
	}

	let errorMessage = '';
	async function AddDish() {
		const dish: Dish = {
			name: name_text,
			url: url_text,
			user: $user?.uid as string,
			ingredients: $ingredients
		};
		const valid = DishValidator.validateAll(dish, $dishes);
		// Todo set som error message
		if (valid !== 0) {
			errorMessage = 'Ugyldig input';
			errorMessage = errorMessage;
			return;
		}

		await DBService.createDish(dish);
		window.location.href = `/dishes/add/success`;
	}
</script>

<section class="flex flex-col items-center justify-center">
	<h2 class="mb-12 mt-12">Legg til ny Matrett</h2>
	<form
		class="w-[80%] md:w-[60%] xl:w-[40%] flex flex-col justify-center items-center"
		method="post"
		bind:this={formElement}
		enctype="multipart/form-data"
	>
		<!-- set name  -->
		<input
			class="input"
			type="text"
			name="name"
			bind:value={name_text}
			on:input={validatetheName}
			placeholder="Navn"
			required
		/>
		<!-- set recipe url -->
		<input
			class="input"
			type="text"
			name="url"
			placeholder="Link til oppskrift"
			bind:value={url_text}
			on:input={validatetheUrl}
		/>

		<!-- upload image -->
		<div class="flex flex-row justify-center items-center w-full mb-5 gap-5">
			{#if customImageUrl}
				<img src={customImageUrl} class="w-24 h-24" alt="uploaded" />
			{/if}
			<SecondaryButton type="button" classNames="w-36 cursor-pointer">
				<label class="cursor-pointer" for="upload_image"
					>Velg Bilde
					<input
						class="hidden"
						type="file"
						id="upload_image"
						name="image"
						accept="image/*"
						on:change={handleImageUpload}
					/>
				</label>
			</SecondaryButton>
		</div>
		<!-- ingredients -->
		<div class=" w-full border-[1px] p-5 rounded border-grey-300 flex flex-row mb-6">
			<div class="flex flex-col w-[50%] items-center">
				<input
					class="input"
					type="text"
					name="temp-ingredients"
					bind:this={ingredientInput}
					bind:value={ingredient}
					on:input={validateIngredients}
					placeholder="Ingrediens"
				/>
				<SecondaryButton type="button" classNames="w-32" on:click={addIngrendient}
					>Legg til</SecondaryButton
				>
			</div>
			<div class="w-[50%] pl-5">
				<h3 class="px-5 text-gray-400">ingredienser</h3>
				{#each $ingredients as ingredient}
					<button
						type="button"
						class="block hover:bg-red hover:text-white rounded-lg pl-5 pr-5"
						on:click={() => ($ingredients = $ingredients.filter((i) => i !== ingredient))}
						>{ingredient}</button
					>
				{/each}
			</div>
			<!-- include ingredients -->
			<input type="hidden" value={$ingredients} name="ingredients" />
		</div>
		<PrimaryButton classNames="w-48" type="button" on:click={AddDish}
			>Legg til matrett</PrimaryButton
		>
		<div>
			<p class="text-red">
				{#if errorMessage}{errorMessage}{/if}
			</p>
		</div>
	</form>
	<BottomCircles />
</section>
