<script lang="ts">
	export let classNames = '';
	export let type: 'button' | 'submit' = 'submit';
	export let formaction = '';
	/** special attribute used to control reactivity from data attributes in tailwind*/
	export let data_ui = false;
</script>

<button
	class="{classNames} h-11 flex justify-center items-center text-lg cursor-pointer"
	{type}
	data-ui={data_ui}
	on:click
	{formaction}
>
	<slot />
</button>
