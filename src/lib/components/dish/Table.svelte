<script lang="ts">
	import type { Dish } from '@prisma/client';
	import Icons from '../Icons.svelte';
	import type { ReadDish } from '$lib/types';

	export let dishes: Dish[];

	function displayIngredients(dish: ReadDish) {
		const ingredients = dish.ingredients?.map((i) => i.value) || [];
		if (ingredients) return ingredients.join(', ');
		return '';
	}
</script>

{#if !dishes || dishes?.length === 0}
	<div>
		Du har ingen middager ennå! Trykk Legg til for å gjøre noe med det (Sørg for at du er innlogget)
		...
	</div>
{:else}
	<div class="overflow-x-auto">
		<table class="table">
			<!--Head-->
			<thead>
				<tr>
					<th class="hidden lg:block"></th>
					<th>Matrett</th>
					<th class="hidden lg:block">Ingredienser</th>
					<th>URL</th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				{#each dishes as dish}
					<tr>
						<td class="hidden lg:block">
							<!-- <div class="badge badge-success text-white">Ny</div> -->
						</td>
						<td>
							<div class="flex flex-row gap-4 items-center justify-start">
								<div class="avatar">
									<div class="mask mask-squircle w-12 h-12 lg:w-16 lg:h-16">
										<img src={`/api/dishes/${dish.id}/image/`} alt="Dish" />
									</div>
								</div>
								<div class="">{dish.name}</div>
							</div>
						</td>
						<td class="hidden lg:block max-w-96">
							{displayIngredients(dish)}
						</td>
						<td>
							{#if dish.url !== ''}
								<a href={dish.url} class="w-12 lg:w-16">
									<button class="btn btn-primary text-white rounded-lg lg:rounded-sm">
										<span class="hidden lg:block">Oppskrift</span>
										<Icons height="1rem" />
									</button>
								</a>
							{/if}
						</td>
						<td>
							<a href="/dishes/edit/{dish.id}" class="btn btn-secondary rounded-lg lg:rounded-sm">
								<span class="hidden lg:block">Endre</span>
								<Icons iconName="zondicons:edit-pencil" height="1rem" />
							</a>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{/if}
