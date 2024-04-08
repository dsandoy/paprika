<script lang="ts">
	import { dishes, ingredients, user } from '$lib/stores';
	import { DishValidator } from '$lib/utils.js';
	import PrimaryButton from '$lib/components/PrimaryButton.svelte';
	import SecondaryButton from '$lib/components/SecondaryButton.svelte';
	import BottomCircles from '$lib/components/BottomCircles.svelte';
	import { DBService, DishQueries } from '$lib/Firebase';
	import type { Dish } from '$lib/types.js';
	import { error } from '@sveltejs/kit';
	import { onMount } from 'svelte';

	export let data: { dishName: string };

	let formElement: HTMLFormElement;
	let ingredientInput: HTMLInputElement;

	let ingredient = '';
	let url_text = '';
	let name_text = '';
	let customImageUrl: string | undefined;
	let customImage: File | undefined;
	let hasImageChanged = false;
	let errorMessage = '';
	let dishID: string | undefined = '';

	async function getDish() {
		let dish: Dish | undefined;
		const q = DishQueries.dish($user, data.dishName);
		await DBService.getResources(q)
			.then((response) => {
				dish = response as unknown as Dish;
			})
			.catch((error) => {
				console.error('Failed to fetch the dish from database!', error);
			});

		if (dish === undefined) {
			console.log('failed to load the dish somehow');
			error(420, 'Failed to locate the dish');
		}
		dishID = dish.id;
		ingredients.set(dish.ingredients || []);
		url_text = dish.url;
		name_text = dish.name;
		customImageUrl = dish.customImage;
		return dish;
	}
	getDish();

	function validateIngredients() {
		if ($ingredients.some((i) => i === ingredient)) {
			ingredientInput.setCustomValidity('Denne ingrediensen er allerede lagt til');
		} else {
			ingredientInput.setCustomValidity('');
		}
		ingredientInput.reportValidity();
	}

	const addIngrendient = () => {
		// prevent empty or duplicated ingredients
		if (!ingredient) return;
		if ($ingredients.some((i) => i === ingredient)) return;

		$ingredients.push(ingredient);
		ingredient = '';
		$ingredients = $ingredients;
	};

	function validateUrl() {
		const url = formElement.children.namedItem('url') as HTMLInputElement;
		if (DishValidator.validateURL(url_text) !== DishValidator.VALID) {
			url.setCustomValidity('Linken er ikke gyldig..');
			url.reportValidity();
		} else {
			url.setCustomValidity('');
			url.reportValidity();
		}
	}

	function validateName() {
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

	/** Let the user see the image they uploaded..*/
	function handleImageUpload(event: Event) {
		customImage = (event.target as HTMLInputElement)?.files?.[0];
		if (!customImage) {
			customImageUrl = undefined;
			return;
		}
		if (DishValidator.validateImage(customImage) === DishValidator.VALID) {
			customImageUrl = URL.createObjectURL(customImage);
			hasImageChanged = true;
		}
	}

	async function UpdateDish() {
		const dish: Dish = {
			id: dishID,
			name: name_text,
			url: url_text,
			user: $user?.uid as string,
			customImage: customImageUrl,
			ingredients: $ingredients
		};
		const result = DishValidator.validateAll(dish, $dishes, true);
		if (result !== DishValidator.VALID) {
			console.warn('Validation failed: the data failed the validateAll function');
			errorMessage = 'Ugyldig input';
			errorMessage = errorMessage;
			return;
		}

		if (customImage && hasImageChanged) {
			const url = await DBService.uploadImage(customImage as File);
			dish.customImage = url;
		}
		await DBService.updateDish(dish);
		window.location.href = '/dishes';
	}

	let smallSize = true;
	onMount(() => {
		smallSize = window.matchMedia('(max-width: 800px)').matches;
	});
</script>

<section class="flex flex-col items-center w-full h-full pb-8 justify-center">
	<h2 class="mb-12 mt-12 text-3xl">Endre matrett</h2>
	<form
		class="w-[80%] md:w-[40%] xl:w-[50%] flex flex-col justify-center items-center"
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
			on:input={validateName}
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
			on:input={validateUrl}
		/>

		<!-- upload image -->
		<div class="flex flex-row justify-center items-center w-full mb-5 gap-5">
			{#if customImageUrl}
				<img src={customImageUrl} class="w-24 h-24" alt="uploaded" />
			{/if}
			<SecondaryButton type="button" classNames="w-36">
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
		<div
			class="w-full border-[1px] p-5 rounded border-grey-300 grid grid-cols-1 lg:grid-cols-2 gap-3 mb-6"
		>
			<div class="flex flex-col items-center">
				<input
					class="input text-sm lg:text-base"
					type="text"
					name="temp-ingredients"
					bind:this={ingredientInput}
					bind:value={ingredient}
					on:input={validateIngredients}
					placeholder="Ingrediens"
				/>
				<SecondaryButton
					type="button"
					classNames="w-32 text-base lg:text-lg"
					on:click={addIngrendient}>Legg til</SecondaryButton
				>
			</div>
			<div>
				<h3 class="px-5 pb-5 text-gray-400">ingredienser</h3>
				<div class="overflow-auto h-48 lg:h-64">
					{#each $ingredients as ingredient}
						<button
							type="button"
							class="block hover:bg-red hover:text-white lg:text-base text-sm rounded-lg pl-5 pr-5"
							on:click={() => ($ingredients = $ingredients.filter((i) => i !== ingredient))}
							>{ingredient}</button
						>
					{/each}
				</div>
			</div>
			<!-- include ingredients -->
			<input type="hidden" value={$ingredients} name="ingredients" />
		</div>
		<PrimaryButton classNames="w-48" type="button" on:click={UpdateDish}
			>Lagre endringer</PrimaryButton
		>
		<div>
			<p class="text-red">
				{#if errorMessage}{errorMessage}{/if}
			</p>
		</div>
	</form>
	{#if !smallSize}
		<BottomCircles />
	{/if}
</section>
