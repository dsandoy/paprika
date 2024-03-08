<script lang="ts">
	import Button from './Button.svelte';

	export let classNames = '';
	export let type: 'button' | 'submit' = 'submit';
	export let formaction = '';
	/** special attribute used to control reactivity from data attributes in tailwind*/
	export let data_ui = false;
</script>

<Button
	classNames="rounded-lg border-[1px] px-5 border-green bg-gradient-to-r from-green to-green hover:from-gray-200 hover:to-gray-200 hover:via-white text-white hover:text-black hover:bg-p-green {classNames}"
	{type}
	on:click
	{formaction}
	{data_ui}
>
	<slot />
</Button>
