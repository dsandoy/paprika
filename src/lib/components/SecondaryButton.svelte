<script lang="ts">
	import Button from "./Button.svelte";

	export let classNames = '';
	export let type: 'button' | 'submit' = 'submit';
	export let formaction = '';
	/** special attribute used to control reactivity from data attributes in tailwind*/
	export let data_ui = false;
</script>

<Button
	classNames="rounded-lg border-[1px] px-5 border-green bg-gradient-to-r from-gray-100 to-gray-100 via-white hover:from-green hover:to-green hover:text-white {classNames}"
	{type}
	{formaction}
	on:click
	{data_ui}
>
	<slot />
</Button>
