<script lang="ts">
	import Button from '../Button.svelte';
	import Icons from '../Icons.svelte';

	export let imagesrc = '';
	export let classNames = '';
</script>

{#if imagesrc}
	<img src={imagesrc} alt="dishimg" class={classNames} />
{:else}
	<Button classNames="{classNames} text-gray-400 flex justify-center items-center">
		<Icons iconName="zondicons:camera" height="2.0rem" classNames=""></Icons>
	</Button>
{/if}
