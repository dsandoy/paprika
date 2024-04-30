<script lang="ts">
	import DemoShoppingList from '$lib/components/demo/DemoShoppingList.svelte';
	import { demoDishes, demoShopping } from './demodata';
</script>

<section class="flex flex-col justify-center items-center gap-4">
	<h3 class="text-3xl">3. Hva må jeg handle?</h3>
	<p class="h-[30%] text-center lg:text-left">
		Legg inn ingrediensene og la Paprika lage handlelista!
	</p>
	<div class="col-span-2 flex justify-center items-center">
		<!-- shopping list demo -->
		<div class=" bg-white rounded lg:w-[30rem] mt-8 shadow-sm border-[1px] border-green/20">
			<DemoShoppingList shoppingList={$demoShopping} bind:dishes={$demoDishes}></DemoShoppingList>
		</div>
	</div>
</section>
