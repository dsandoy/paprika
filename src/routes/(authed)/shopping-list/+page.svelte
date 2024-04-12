<script lang="ts">
	import ShoppingList from '$lib/components/shopping/ShoppingList.svelte';
	import { shoppingList, user } from '$lib/stores';
	import { ListQueries, DBShoppingList, NoDocumentError } from '$lib/Firebase';

	async function getShoppingList() {
		if (!$user) {
			console.log('user not loaded yet or not logged in');
			return;
		}
		try {
			const q = ListQueries.get($user);
			try {
				const list = await DBShoppingList.get(q);
				shoppingList.set(list);
				console.log('fetched shoppinglist');
			} catch (error) {
				if (error instanceof NoDocumentError) {
					await createShoppingList();
				} else console.error(error);
			}
		} catch (error) {
			// should not happen but just in case
			console.error(error);
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
	<!-- <h1 class="text-5xl my-8">Handleliste</h1> -->
	<div class="w-full lg:w-[60%] lg:my-8">
		<ShoppingList shoppingList={$shoppingList} />
	</div>
</section>
