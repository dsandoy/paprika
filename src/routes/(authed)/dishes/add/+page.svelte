<script lang="ts">
	import { dishes, ingredients, user } from '$lib/stores';
	import { DishValidator } from '$lib/utils.js';
	import PrimaryButton from '$lib/components/PrimaryButton.svelte';
	import SecondaryButton from '$lib/components/SecondaryButton.svelte';
	import { onMount } from 'svelte';
	import BottomCircles from '$lib/components/BottomCircles.svelte';
	import { DBService } from '$lib/Firebase';
	import type { Dish } from '$lib/types.js';
	import Loading from '$lib/components/Loading.svelte';

	let formElement: HTMLFormElement;
	let ingredientInput: HTMLInputElement;
	let ingredient = '';
	let url_text = '';
	let name_text = '';
	let customImageUrl: string | null = null;
	let customImage: File | undefined;
	let errorMessage = '';
	let loading = false;

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

	/** offer a validation on the url in real time... */
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

	/** Validate the name in real time...*/
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
			customImageUrl = null;
			return;
		}
		if (DishValidator.validateImage(customImage) === DishValidator.VALID) {
			customImageUrl = URL.createObjectURL(customImage);
		}
	}

	async function AddDish() {
		loading = true;
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
			loading = false;
			return;
		}

		if (customImage) {
			const url = await DBService.uploadImage(customImage as File);
			dish.customImage = url;
		}
		await DBService.createDish(dish);
		window.location.href = '/dishes/add/success';
		loading = false;
	}
	let smallSize = true;
	onMount(() => {
		smallSize = window.matchMedia('(max-width: 800px)').matches;
	});
</script>

<section
	class="flex flex-col items-center absolute top-16 bottom-0 left-0 right-0 pb-8 justify-center bg-green-50"
>
	<h2 class="mb-12 mt-12 text-3xl">Legg til ny Matrett</h2>
	<form
		class="w-[80%] md:w-auto flex flex-col justify-center items-center"
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
					class="input"
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
				<div class="overflow-auto h-48">
					{#each $ingredients as ingredient}
						<button
							type="button"
							class="block hover:bg-red hover:text-white text-sm lg:text-base rounded-lg pl-5 pr-5"
							on:click={() => ($ingredients = $ingredients.filter((i) => i !== ingredient))}
							>{ingredient}</button
						>
					{/each}
				</div>
			</div>
			<!-- include ingredients -->
			<input type="hidden" value={$ingredients} name="ingredients" />
		</div>
		<PrimaryButton classNames="w-48" type="button" on:click={AddDish}>
			<Loading bind:loading>Legg til matrett</Loading>
		</PrimaryButton>
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
