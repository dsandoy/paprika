<script lang="ts">
	import Button from './Button.svelte';
	import Dropdown from './Dropdown.svelte';
	import Icons from './Icons.svelte';

	/** The text describing what to delete*/
	export let text = 'dette';

	/** the function to call when the delete button is triggered */
	export let deleteFunction = (): void => {};

	let isOpen = false;
	function deleteItem() {
		deleteFunction();
		isOpen = false;
	}

	function cancel() {
		isOpen = false;
	}
</script>

<Dropdown
	classNamesContent="w-64 h-40 absolute bg-base-200 shadow-lg  z-20 lg:right-[40%] lg:bottom-[20%] right-[20%] bottom-[20%] p-5 rounded"
	bind:isOpen
>
	<Button
		slot="button"
		classNames="rounded-lg hover:bg-accent hover:text-white h-12 w-12 bg-base-200 text-accent border-[1px] border-accent mr-2"
	>
		<Icons height="1.5rem" iconName="zondicons:trash" /></Button
	>
	<div slot="content">
		<p class="mb-4">Er du sikker på at du vil slette {text}?</p>

		<div class="flex flex-row justify-between items-center">
			<Button
				on:click={deleteItem}
				classNames="rounded-lg h-14 w-14 bg-primary text-white flex items-center justify-center"
			>
				<Icons height="1.5rem" iconName="zondicons:thumbs-up" />
			</Button>

			<Button
				on:click={cancel}
				classNames="rounded-lg h-14 w-14 bg-base-200 text-red flex items-center justify-center border-[1px] border-accent"
			>
				<Icons height="1.5rem" iconName="zondicons:thumbs-down" />
			</Button>
		</div>
	</div>
</Dropdown>
