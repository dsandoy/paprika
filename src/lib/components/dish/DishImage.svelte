<script lang="ts">
	export let imagesrc = '';
	export let classNames = '';
</script>

{#if imagesrc}
	<img src={imagesrc} alt="dish" class="{classNames} rounded-sm lg:rounded" />
{:else}
	<img src="logo-green.svg" alt="dish" class="{classNames} rounded-sm lg:rounded" />
{/if}
