<script lang="ts">
	export let imagesrc = '';
	export let classNames = '';
</script>

<div class="avatar">
	<div class="mask mask-squircle {classNames}">
		{#if imagesrc}
			<img src={imagesrc} alt="dish" />
		{:else}
			<img src="logo-green.svg" alt="dish" />
		{/if}
	</div>
</div>
