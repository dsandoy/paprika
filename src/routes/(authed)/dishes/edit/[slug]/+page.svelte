<script lang="ts">
	import { dishes, ingredients, user } from '$lib/stores';
	import { DishValidator } from '$lib/utils.js';
	import PrimaryButton from '$lib/components/PrimaryButton.svelte';
	import SecondaryButton from '$lib/components/SecondaryButton.svelte';
	import BottomCircles from '$lib/components/BottomCircles.svelte';
	import { DBService, DishQueries } from '$lib/Firebase';
	import type { Dish } from '$lib/types.js';
	import { error } from '@sveltejs/kit';

	export let data: { dishName: string };

	let formElement: HTMLFormElement;
	let ingredientInput: HTMLInputElement;

	let ingredient = '';
	let url_text = '';
	let name_text = '';
	let customImageUrl: string | undefined;
	let customImage: File | undefined;
	let errorMessage = '';

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
		}
	}

	/** TODO */
	async function UpdateDish() {
		const dish: Dish = {
			name: name_text,
			url: url_text,
			user: $user?.uid as string,
			ingredients: $ingredients
		};
		const result = DishValidator.validateAll(dish, $dishes);
		if (result !== DishValidator.VALID) {
			errorMessage = 'Ugyldig input';
			errorMessage = errorMessage;
			return;
		}

		if (customImage) {
			const url = await DBService.uploadImage(customImage as File);
			dish.customImage = url;
		}
		await DBService.createDish(dish);
		window.location.href = '/dishes/add/success';
	}
</script>

<section class="flex flex-col items-center w-full h-full justify-center">
	<h2 class="mb-12 mt-12 text-3xl">Endre matrett</h2>
	<form
		class="w-[70%] md:w-[40%] xl:w-[30%] flex flex-col justify-center items-center"
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
		<div class="w-full border-[1px] p-5 rounded border-grey-300 flex flex-row mb-6">
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
				<div class="overflow-auto h-48">
					{#each $ingredients as ingredient}
						<button
							type="button"
							class="block hover:bg-red hover:text-white rounded-lg pl-5 pr-5"
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
	<BottomCircles />
</section>
