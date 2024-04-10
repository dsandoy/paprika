<script lang="ts">
	import ShoppingList from '$lib/components/shopping/ShoppingList.svelte';
	import { shoppingList, user } from '$lib/stores';
	import { ListQueries, DBShoppingList, NoDocumentError } from '$lib/Firebase';

	async function getShoppingList() {
		const q = ListQueries.get($user);
		if (q !== undefined) {
			try {
				const list = await DBShoppingList.get(q);
				shoppingList.set(list);
			} catch (error) {
				if (error instanceof NoDocumentError) {
					await createShoppingList();
				} else console.error(error);
			}
		}
	}

	async function createShoppingList() {
		try {
			await DBShoppingList.create($user);
			console.log('created new shoppinglist');
		} catch (error) {
			console.error(error);
		}
	}

	$: getShoppingList(), $user;
</script>

<section class="flex flex-col gap-5 justify-center items-center">
	<h1 class="text-5xl my-8">Handleliste</h1>
	<div class="w-[60%]">
		<ShoppingList shoppingList={$shoppingList} />
	</div>
</section>
